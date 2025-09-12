import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { executeQuery } from './db.js';

const JWT_SECRET = import.meta.env.JWT_SECRET;
const JWT_EXPIRES_IN = import.meta.env.JWT_EXPIRES_IN || '7d';

export async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function createUser(username, email, password) {
  try {
    const hashedPassword = await hashPassword(password);
    const result = await executeQuery(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    return { id: result.insertId, username, email };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Username or email already exists');
    }
    throw error;
  }
}

export async function findUserByEmail(email) {
  const users = await executeQuery(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return users[0] || null;
}

export async function findUserById(id) {
  const users = await executeQuery(
    'SELECT id, username, email, created_at FROM users WHERE id = ?',
    [id]
  );
  return users[0] || null;
}

export async function authenticateUser(email, password) {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }

  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email
  };
}

export async function getUserFromRequest(request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '') ||
                getCookieFromRequest(request, 'auth_token');
  
  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  return await findUserById(payload.userId);
}

function getCookieFromRequest(request, name) {
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});
  return cookies[name];
}