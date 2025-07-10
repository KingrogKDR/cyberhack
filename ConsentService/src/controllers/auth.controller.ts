import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/client';
// @ts-ignore
import logger from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// POST /auth/register
export const registerHandler = async (req: Request, res: Response):Promise<any> => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    logger.info(`🆕 Registered user ${email}`);
    res.status(201).json({ message: 'User registered successfully', user: { id: user.id, email: user.email } });
  } catch (error) {
    logger.error('Error registering user:', error);
    res.status(500).json({ message: 'Registration failed', error });
  }
};

// POST /auth/login
export const loginHandler = async (req: Request, res: Response):Promise<any> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
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
      },
    });
  } catch (error) {
    logger.error('Error logging in user:', error);
    res.status(500).json({ message: 'Login failed', error });
  }
};
