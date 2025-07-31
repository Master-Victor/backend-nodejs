# Movies & TV Shows REST API

A complete REST API for managing movies, TV shows, actors, and directors, built with Node.js, TypeScript, Express, and PostgreSQL.

## 🚀 Features

- **Authentication**: JWT-based authentication with refresh token support
- **Movie Management**: CRUD operations with filtering and sorting
- **TV Show Management**: Full management of shows, seasons, and episodes
- **Actors & Directors**: Comprehensive management of cast and crew
- **Advanced Filtering**: Search, filter, and sort capabilities
- **Strict Typing**: Fully implemented in TypeScript
- **Database Relationships**: Efficient handling of complex many-to-many relations

## 🛠️ Technologies

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Zod
- **Security**: Helmet, CORS, bcryptjs

## 📋 Prerequisites

- Node.js 20 or higher
- PostgreSQL database
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
  ```bash
  git clone <your-repo-url>
  cd movies-tv-api
  ```

2. **Install dependencies**
  ```bash
  npm install
  ```

3. **Configure environment variables**
  ```bash
  cp .env.example .env
  ```
  
  Edit `.env` with your configuration:
  ```env
  DATABASE_URL="postgresql://user:password@localhost:5432/movies_tv_db?schema=public"
  JWT_ACCESS_SECRET="your-access-secret-key"
  JWT_REFRESH_SECRET="your-refresh-secret-key"
  JWT_ACCESS_EXPIRES_IN="15m"
  JWT_REFRESH_EXPIRES_IN="7d"
  PORT=3000
  NODE_ENV="development"
  ```

4. **Set up the database**
  ```bash
  # Generate Prisma client
  npm run db:generate

  # Run migrations
  npm run db:migrate

  # Optional: Seed the database with sample data
  npm run db:seed
  ```

5. **Start the development server**
  ```bash
  npm run dev
  ```

The API will be available at `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Log in
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Log out

### Movies
- `GET /api/movies` - Get all movies (with filters and sorting)
- `GET /api/movies/:id` - Get specific movie
- `POST /api/movies` - Create new movie

### TV Shows & Episodes
- `GET /api/tv-shows` - Get all TV shows
- `GET /api/tv-shows/:id` - Get specific TV show
- `POST /api/tv-shows` - Create new TV show
- `GET /api/tv-shows/:tvShowId/seasons/:seasonNumber/episodes/:episodeNumber` - Get specific episode with director info

### Actors
- `GET /api/actors` - Get all actors
- `GET /api/actors/:id` - Get specific actor
- `POST /api/actors` - Create new actor

## 🗄️ Database Schema

The API uses a relational database with the following main entities:

- **Users**: Authentication and authorization
- **Directors**: Directors of movies and episodes
- **Actors**: Cast members in movies and TV shows
- **Movies**: Movie information with director and cast
- **TV Shows**: TV show information with cast
- **Seasons**: TV show seasons
- **Episodes**: Individual episodes with optional director
- **Refresh Tokens**: JWT refresh token management

### Key Relationships:
- Movies have one director and multiple actors (many-to-many)
- TV shows have multiple actors (many-to-many)
- TV shows have multiple seasons, seasons have multiple episodes
- Episodes can have a director
- Actors can appear in multiple movies and TV shows

## 🔒 Authentication

The API uses JWT tokens for authentication:

1. **Access Token**: Short-lived (15 minutes) for API requests
2. **Refresh Token**: Long-lived (7 days) for renewing the token

Include the access token in the Authorization header:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start server in production
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:seed` - Seed the database with sample data
- `npm run db:reset` - Reset the database (⚠️ destructive)
- `npm run lint` - Run ESLint

