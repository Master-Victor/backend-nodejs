import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth.routes';
import { movieRoutes } from './routes/movie.routes';
import { tvShowRoutes } from './routes/tvShow.routes';
import { actorRoutes } from './routes/actor.routes';
import { errorHandler } from './middleware/errorHandler';

// Cargo las variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;  //Default port to 3000 if not specified

// Middleware
app.use(helmet());                              // Protects the app from common vulnerabilities
app.use(cors());                                // Allows CORS requests
app.use(express.json({ limit: '10mb' }));       // Allows JSON requests with a size limit of 10mb
app.use(express.urlencoded({ extended: true }));// Allows URL-encoded requests with a size limit of 10mb

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Simpson API!'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/tv-shows', tvShowRoutes);
app.use('/api/actors', actorRoutes);

// Error 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`
  });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});