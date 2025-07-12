import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/client';
// @ts-ignore
import logger from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// POST /auth/register
export const registerHandler = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password, role } = req.body;

    if (!['user', 'bank'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be either "user" or "bank".' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    logger.info(`🆕 Registered user ${email}`);
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Error registering user:', error);
    res.status(500).json({ message: 'Registration failed', error });
  }
};

// POST /auth/login
export const loginHandler = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    logger.info(`🔓 Logged in user ${email}`);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Error logging in user:', error);
    res.status(500).json({ message: 'Login failed', error });
  }
};
