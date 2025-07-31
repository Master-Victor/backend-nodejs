import { Request, Response } from 'express';
import {
  registerUserService,
  loginUserService,
  refreshTokenService,
  logoutService
} from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const { user, accessToken, refreshToken } = await registerUserService(email, password, name);

    res.status(201).json({
      message: 'User registered successfully',
      user,
      tokens: { accessToken, refreshToken }
    });
  } catch (error: any) {
    if (error.message === 'USER_EXISTS') {
      return res.status(409).json({
        error: 'User already exists',
        message: 'A user with this email address already exists'
      });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await loginUserService(email, password);

    res.json({
      message: 'Login successful',
      user,
      tokens: { accessToken, refreshToken }
    });
  } catch (error: any) {
    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'The email or password is incorrect'
      });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await refreshTokenService(refreshToken);

    res.json({
      message: 'Tokens refreshed successfully',
      tokens
    });
  } catch (error: any) {
    const errors: Record<string, number> = {
      INVALID_REFRESH_TOKEN: 401,
      REFRESH_EXPIRED: 401,
      INVALID_REFRESH_SIGNATURE: 401
    };

    const status = errors[error.message] || 500;
    console.error('Token refresh error:', error);
    res.status(status).json({ error: 'Error refreshing token' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    await logoutService(refreshToken);
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
