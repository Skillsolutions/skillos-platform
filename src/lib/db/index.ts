// Database connection and models for SkillOS platform

import { Pool } from 'pg';
import { UserRole } from '../auth/types';

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'skillos',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
};

// Create connection pool
const pool = new Pool(dbConfig);

// Test database connection
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('Database connection successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// User model
export interface UserModel {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: UserRole;
  department?: string;
  organization_id: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Organization model
export interface OrganizationModel {
  id: string;
  name: string;
  domain: string;
  subscription_plan: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// User repository
export const UserRepository = {
  // Find user by ID
  async findById(id: string): Promise<UserModel | null> {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  },

  // Find user by email
  async findByEmail(email: string): Promise<UserModel | null> {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  },

  // Create user
  async create(user: Omit<UserModel, 'id' | 'created_at' | 'updated_at'>): Promise<UserModel | null> {
    try {
      const result = await pool.query(
        `INSERT INTO users (
          email, password_hash, name, role, department, organization_id, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          user.email,
          user.password_hash,
          user.name,
          user.role,
          user.department,
          user.organization_id,
          user.is_active
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  },

  // Update user
  async update(id: string, user: Partial<UserModel>): Promise<UserModel | null> {
    try {
      const fields = Object.keys(user).filter(key => key !== 'id' && key !== 'created_at');
      if (fields.length === 0) return null;

      const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');
      const values = fields.map(field => (user as any)[field]);

      const result = await pool.query(
        `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
        [id, ...values]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  },

  // Delete user
  async delete(id: string): Promise<boolean> {
    try {
      const result = await pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING id',
        [id]
      );
      // Fix: Add null check for rowCount before comparison
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  },

  // List users with pagination
  async list(page = 1, limit = 10, filters: Record<string, any> = {}): Promise<{ users: UserModel[], total: number }> {
    try {
      const offset = (page - 1) * limit;
      
      // Build WHERE clause from filters
      let whereClause = '';
      const whereParams: any[] = [];
      let paramIndex = 1;
      
      if (Object.keys(filters).length > 0) {
        whereClause = 'WHERE ';
        const conditions: string[] = [];
        
        for (const [key, value] of Object.entries(filters)) {
          if (value !== undefined && value !== null) {
            conditions.push(`${key} = $${paramIndex++}`);
            whereParams.push(value);
          }
        }
        
        whereClause += conditions.join(' AND ');
      }
      
      // Get users with pagination
      const usersQuery = `
        SELECT * FROM users 
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      
      const usersResult = await pool.query(
        usersQuery,
        [...whereParams, limit, offset]
      );
      
      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total FROM users ${whereClause}
      `;
      
      const countResult = await pool.query(
        countQuery,
        whereParams
      );
      
      return {
        users: usersResult.rows,
        total: parseInt(countResult.rows[0].total)
      };
    } catch (error) {
      console.error('Error listing users:', error);
      return { users: [], total: 0 };
    }
  }
};

// Organization repository
export const OrganizationRepository = {
  // Find organization by ID
  async findById(id: string): Promise<OrganizationModel | null> {
    try {
      const result = await pool.query(
        'SELECT * FROM organizations WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding organization by ID:', error);
      return null;
    }
  },

  // Create organization
  async create(org: Omit<OrganizationModel, 'id' | 'created_at' | 'updated_at'>): Promise<OrganizationModel | null> {
    try {
      const result = await pool.query(
        `INSERT INTO organizations (
          name, domain, subscription_plan, is_active
        ) VALUES ($1, $2, $3, $4) RETURNING *`,
        [
          org.name,
          org.domain,
          org.subscription_plan,
          org.is_active
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating organization:', error);
      return null;
    }
  },

  // Update organization
  async update(id: string, org: Partial<OrganizationModel>): Promise<OrganizationModel | null> {
    try {
      const fields = Object.keys(org).filter(key => key !== 'id' && key !== 'created_at');
      if (fields.length === 0) return null;

      const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');
      const values = fields.map(field => (org as any)[field]);

      const result = await pool.query(
        `UPDATE organizations SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
        [id, ...values]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error updating organization:', error);
      return null;
    }
  }
};

// Initialize database tables
export async function initializeDatabase() {
  try {
    const client = await pool.connect();
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        domain VARCHAR(255) NOT NULL,
        subscription_plan VARCHAR(50) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        department VARCHAR(100),
        organization_id UUID REFERENCES organizations(id),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        refresh_token VARCHAR(500) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    client.release();
    console.log('Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database tables:', error);
    return false;
  }
}

export default {
  pool,
  testConnection,
  initializeDatabase,
  UserRepository,
  OrganizationRepository
};
