import { neon } from '@neondatabase/serverless';
import { Order } from './types';

// In-memory fallback for local dev without DATABASE_URL
const inMemoryOrders: Map<string, Order> = new Map();

function getNeonSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || databaseUrl.includes('dummy_user')) return null;
  return neon(databaseUrl);
}

/**
 * Initializes the orders table in Neon PostgreSQL.
 * Safe to call multiple times — uses CREATE TABLE IF NOT EXISTS.
 */
export async function initDatabase() {
  const sql = getNeonSql();
  if (!sql) return;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id                VARCHAR(36)  PRIMARY KEY,
        customer_name     VARCHAR(100) NOT NULL,
        customer_phone    VARCHAR(25)  NOT NULL,
        customer_email    VARCHAR(150),
        store_name        VARCHAR(100),
        business_type     VARCHAR(100),
        package_type      VARCHAR(50)  NOT NULL,
        amount            INTEGER      NOT NULL,
        payment_method    VARCHAR(50)  NOT NULL DEFAULT 'mayar',
        payment_status    VARCHAR(20)  NOT NULL DEFAULT 'pending',
        mayar_payment_id  VARCHAR(100),
        mayar_payment_url TEXT,
        device_id         VARCHAR(100),
        serial_key        VARCHAR(100),
        activated_at      TIMESTAMP,
        email_sent_at     TIMESTAMP,
        notes             TEXT,
        created_at        TIMESTAMP    NOT NULL DEFAULT NOW()
      );
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_phone  ON orders(customer_phone);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(payment_status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_mayar  ON orders(mayar_payment_id);`;
  } catch (error) {
    console.error('[DB] Failed to init tables:', error);
  }
}

export async function createOrder(order: Order): Promise<Order> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await initDatabase();
      await sql`
        INSERT INTO orders (
          id, customer_name, customer_phone, customer_email,
          store_name, business_type, package_type, amount,
          payment_method, payment_status,
          mayar_payment_id, mayar_payment_url, notes, created_at
        ) VALUES (
          ${order.id},
          ${order.customerName},
          ${order.customerPhone},
          ${order.customerEmail ?? null},
          ${order.storeName ?? null},
          ${order.businessType ?? null},
          ${order.packageType},
          ${order.amount},
          ${order.paymentMethod},
          ${order.paymentStatus},
          ${order.mayarPaymentId ?? null},
          ${order.mayarPaymentUrl ?? null},
          ${order.notes ?? null},
          NOW()
        );
      `;
      return order;
    } catch (err) {
      console.warn('[DB] createOrder error, falling back to in-memory:', err);
    }
  }

  inMemoryOrders.set(order.id, order);
  return order;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`SELECT * FROM orders WHERE id = ${id} LIMIT 1;`;
      if (rows && rows.length > 0) return mapRow(rows[0]);
    } catch (err) {
      console.warn('[DB] getOrderById error, fallback to memory:', err);
    }
  }
  return inMemoryOrders.get(id) ?? null;
}

export async function getOrderByMayarId(mayarPaymentId: string): Promise<Order | null> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`
        SELECT * FROM orders WHERE mayar_payment_id = ${mayarPaymentId} LIMIT 1;
      `;
      if (rows && rows.length > 0) return mapRow(rows[0]);
    } catch (err) {
      console.warn('[DB] getOrderByMayarId error:', err);
    }
  }
  // Fallback: search in-memory
  for (const o of inMemoryOrders.values()) {
    if (o.mayarPaymentId === mayarPaymentId) return o;
  }
  return null;
}

export async function updateOrderPaymentStatus(
  id: string,
  status: 'paid' | 'pending' | 'cancelled'
): Promise<boolean> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`UPDATE orders SET payment_status = ${status} WHERE id = ${id};`;
      return true;
    } catch (err) {
      console.warn('[DB] updateOrderPaymentStatus error:', err);
    }
  }
  const existing = inMemoryOrders.get(id);
  if (existing) {
    existing.paymentStatus = status;
    return true;
  }
  return false;
}

export async function markEmailSent(id: string): Promise<boolean> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`UPDATE orders SET email_sent_at = NOW() WHERE id = ${id};`;
      return true;
    } catch (err) {
      console.warn('[DB] markEmailSent error:', err);
    }
  }
  const existing = inMemoryOrders.get(id);
  if (existing) {
    existing.emailSentAt = new Date().toISOString();
    return true;
  }
  return false;
}

export async function attachLicenseToOrder(
  id: string,
  deviceId: string,
  serialKey: string
): Promise<boolean> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        UPDATE orders
        SET device_id = ${deviceId}, serial_key = ${serialKey},
            activated_at = NOW(), payment_status = 'paid'
        WHERE id = ${id};
      `;
      return true;
    } catch (err) {
      console.warn('[DB] attachLicenseToOrder error:', err);
    }
  }
  const existing = inMemoryOrders.get(id);
  if (existing) {
    existing.deviceId = deviceId;
    existing.serialKey = serialKey;
    existing.activatedAt = new Date().toISOString();
    existing.paymentStatus = 'paid';
    return true;
  }
  return false;
}

export async function resetOrderDevice(id: string): Promise<boolean> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        UPDATE orders
        SET device_id = NULL, serial_key = NULL, activated_at = NULL
        WHERE id = ${id};
      `;
      return true;
    } catch (err) {
      console.warn('[DB] resetOrderDevice error:', err);
    }
  }
  const existing = inMemoryOrders.get(id);
  if (existing) {
    existing.deviceId = undefined;
    existing.serialKey = undefined;
    existing.activatedAt = undefined;
    return true;
  }
  return false;
}

export async function getAllOrders(): Promise<Order[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`
        SELECT * FROM orders ORDER BY created_at DESC LIMIT 200;
      `;
      return rows.map(mapRow);
    } catch (err) {
      console.warn('[DB] getAllOrders error:', err);
    }
  }
  return Array.from(inMemoryOrders.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// ─── Helper ────────────────────────────────────────────────────────────────
function mapRow(r: Record<string, unknown>): Order {
  return {
    id:               r.id              as string,
    customerName:     r.customer_name   as string,
    customerPhone:    r.customer_phone  as string,
    customerEmail:    r.customer_email  as string | undefined,
    storeName:        r.store_name      as string | undefined,
    businessType:     r.business_type   as string | undefined,
    packageType:      r.package_type    as 'software_only',
    amount:           Number(r.amount),
    paymentMethod:    (r.payment_method as string) as 'mayar' | 'manual_transfer',
    paymentStatus:    r.payment_status  as 'pending' | 'paid' | 'cancelled',
    mayarPaymentId:   r.mayar_payment_id  as string | undefined,
    mayarPaymentUrl:  r.mayar_payment_url as string | undefined,
    deviceId:         r.device_id       as string | undefined,
    serialKey:        r.serial_key      as string | undefined,
    activatedAt:      r.activated_at    as string | undefined,
    emailSentAt:      r.email_sent_at   as string | undefined,
    notes:            r.notes           as string | undefined,
    createdAt:        r.created_at      as string,
  };
}
