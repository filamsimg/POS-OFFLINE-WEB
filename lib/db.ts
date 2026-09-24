import { neon } from '@neondatabase/serverless';
import { Order } from './types';

// In-memory fallback for local dev when DATABASE_URL is not yet configured
const inMemoryOrders: Map<string, Order> = new Map();

function getNeonSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }
  return neon(databaseUrl);
}

/**
 * Initializes table in Neon if not already created.
 */
export async function initDatabase() {
  const sql = getNeonSql();
  if (!sql) return;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(36) PRIMARY KEY,
        customer_name VARCHAR(100) NOT NULL,
        customer_phone VARCHAR(25) NOT NULL,
        store_name VARCHAR(100),
        business_type VARCHAR(100),
        package_type VARCHAR(50) NOT NULL,
        amount INTEGER NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        payment_status VARCHAR(20) NOT NULL DEFAULT 'pending',
        device_id VARCHAR(50),
        serial_key VARCHAR(50),
        activated_at TIMESTAMP,
        shipping_address TEXT,
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone);`;
  } catch (error) {
    console.error('Failed to init Neon tables:', error);
  }
}

export async function createOrder(order: Order): Promise<Order> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await initDatabase();
      await sql`
        INSERT INTO orders (
          id, customer_name, customer_phone, store_name, business_type,
          package_type, amount, payment_method, payment_status,
          shipping_address, notes, created_at
        ) VALUES (
          ${order.id}, ${order.customerName}, ${order.customerPhone},
          ${order.storeName || ''}, ${order.businessType || ''},
          ${order.packageType}, ${order.amount}, ${order.paymentMethod},
          ${order.paymentStatus}, ${order.shippingAddress || ''},
          ${order.notes || ''}, NOW()
        );
      `;
      return order;
    } catch (err) {
      console.warn('Neon insert error, falling back to memory store:', err);
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
      if (rows && rows.length > 0) {
        const r = rows[0];
        return {
          id: r.id,
          customerName: r.customer_name,
          customerPhone: r.customer_phone,
          storeName: r.store_name,
          businessType: r.business_type,
          packageType: r.package_type,
          amount: Number(r.amount),
          paymentMethod: r.payment_method,
          paymentStatus: r.payment_status,
          deviceId: r.device_id,
          serialKey: r.serial_key,
          activatedAt: r.activated_at,
          shippingAddress: r.shipping_address,
          notes: r.notes,
          createdAt: r.created_at,
        };
      }
    } catch (err) {
      console.warn('Neon query error, fallback to memory:', err);
    }
  }

  return inMemoryOrders.get(id) || null;
}

export async function updateOrderPayment(id: string, status: 'paid' | 'pending' | 'cancelled'): Promise<boolean> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`UPDATE orders SET payment_status = ${status} WHERE id = ${id};`;
      return true;
    } catch (err) {
      console.warn('Neon update error:', err);
    }
  }

  const existing = inMemoryOrders.get(id);
  if (existing) {
    existing.paymentStatus = status;
    return true;
  }
  return false;
}

export async function attachLicenseToOrder(id: string, deviceId: string, serialKey: string): Promise<boolean> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        UPDATE orders
        SET device_id = ${deviceId}, serial_key = ${serialKey}, activated_at = NOW(), payment_status = 'paid'
        WHERE id = ${id};
      `;
      return true;
    } catch (err) {
      console.warn('Neon attachLicense error:', err);
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
      console.warn('Neon resetOrderDevice error:', err);
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
      const rows = await sql`SELECT * FROM orders ORDER BY created_at DESC LIMIT 100;`;
      return rows.map((r: any) => ({
        id: r.id,
        customerName: r.customer_name,
        customerPhone: r.customer_phone,
        storeName: r.store_name,
        businessType: r.business_type,
        packageType: r.package_type,
        amount: Number(r.amount),
        paymentMethod: r.payment_method,
        paymentStatus: r.payment_status,
        deviceId: r.device_id,
        serialKey: r.serial_key,
        activatedAt: r.activated_at,
        shippingAddress: r.shipping_address,
        notes: r.notes,
        createdAt: r.created_at,
      }));
    } catch (err) {
      console.warn('Neon getAllOrders error:', err);
    }
  }

  return Array.from(inMemoryOrders.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
