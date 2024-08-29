import { Request, Response, NextFunction } from 'express';

const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER || 'vs_tech_challenge';
const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD || 'SuperSecurePassword123@';

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  if (username !== BASIC_AUTH_USER || password !== BASIC_AUTH_PASSWORD) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  next();
};
