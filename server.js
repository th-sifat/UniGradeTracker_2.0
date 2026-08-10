import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

// Load local environment variables for local development
dotenv.config();

import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'unigrade-secret-key-development-only';

const app = express();
const PORT = 3000;

app.use(express.json());
  app.use(cookieParser());

  // Authentication Middleware
  const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.userId;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  // API Routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password, university } = req.body;
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) return res.status(400).json({ error: 'Email already registered' });
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, university }
      });
      
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(401).json({ error: 'Invalid email or password' });
      
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(401).json({ error: 'Invalid email or password' });
      
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
  });

  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: 'Email is required' });
      
      // We simulate sending a reset email here
      // Real apps would create a token in DB and send an email using SendGrid/SMTP
      const user = await prisma.user.findUnique({ where: { email } });
      
      // Delay to simulate network/email send
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Always return success to prevent email enumeration
      res.json({ success: true, message: 'Reset link sent if account exists.' });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });

  app.get('/api/user', authMiddleware, async (req, res) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { id: true, name: true, email: true, university: true } });
      res.json({ user });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });

  app.get('/api/semesters', authMiddleware, async (req, res) => {
    try {
      const semesters = await prisma.semester.findMany({
        where: { userId: req.userId },
        include: { courses: true },
        orderBy: { id: 'asc' }
      });
      res.json({ semesters });
    } catch (error) {
      console.error('Get semesters error:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });

  app.post('/api/semesters', authMiddleware, async (req, res) => {
    try {
      console.log('POST /api/semesters', req.body);
      const { semesterName, courses, gpa } = req.body;
      const semester = await prisma.semester.create({
        data: {
          userId: req.userId,
          semesterName,
          gpa,
          courses: {
            create: courses.map(c => ({
              courseCode: c.courseCode,
              courseTitle: c.courseTitle,
              credit: c.credit,
              grade: c.grade,
              gradePoint: c.gradePoint
            }))
          }
        },
        include: { courses: true }
      });
      res.json({ semester });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });

  app.delete('/api/semesters/:id', authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await prisma.semester.deleteMany({
        where: { id, userId: req.userId }
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });

  app.put('/api/semesters/:id', authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { semesterName, courses, gpa } = req.body;
      
      // First verify ownership
      const existing = await prisma.semester.findFirst({
        where: { id, userId: req.userId }
      });
      
      if (!existing) return res.status(404).json({ error: 'Not found' });

      // Update semester and replace courses
      // Easiest is to delete existing courses and create new ones
      await prisma.course.deleteMany({
        where: { semesterId: id }
      });

      const updatedSemester = await prisma.semester.update({
        where: { id },
        data: {
          semesterName,
          gpa,
          courses: {
            create: courses.map(c => ({
              courseCode: c.courseCode,
              courseTitle: c.courseTitle,
              credit: c.credit,
              grade: c.grade,
              gradePoint: c.gradePoint
            }))
          }
        },
        include: { courses: true }
      });

      res.json({ semester: updatedSemester });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });

  app.post('/api/test-create', async (req, res) => {
    try {
      const user = await prisma.user.findFirst();
      if (!user) return res.status(404).json({ error: 'No users found' });
      
      const semester = await prisma.semester.create({
        data: {
          userId: user.id,
          semesterName: 'Test Semester',
          gpa: 3.5,
          courses: {
            create: [
              {
                courseCode: 'TEST 101',
                courseTitle: 'Test Course',
                credit: 3,
                grade: 'A',
                gradePoint: 4.0
              }
            ]
          }
        },
        include: { courses: true }
      });
      res.json({ semester });
    } catch (error) {
      console.error('Test create error:', error);
      res.status(500).json({ error: 'Internal error', details: error.message });
    }
  });

  app.post('/api/test-create-with-payload', async (req, res) => {
    try {
      const user = await prisma.user.findFirst();
      if (!user) return res.status(404).json({ error: 'No users found' });
      
      const { semesterName, courses, gpa } = req.body;
      const semester = await prisma.semester.create({
        data: {
          userId: user.id,
          semesterName,
          gpa,
          courses: {
            create: courses.map(c => ({
              courseCode: c.courseCode,
              courseTitle: c.courseTitle,
              credit: c.credit,
              grade: c.grade,
              gradePoint: c.gradePoint
            }))
          }
        },
        include: { courses: true }
      });
      res.json({ semester });
    } catch (error) {
      console.error('Test payload create error:', error);
      res.status(500).json({ error: 'Internal error', details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    (async () => {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);

      app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })();
  }

export default app;
