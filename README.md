# Email Service API

A simple email service built with Express.js, TypeScript, and Prisma.

## Features

- Send emails via SMTP
- Email tracking and status management
- Recent emails retrieval
- Email history by ID
- Input validation with Zod
- TypeScript support
- Prisma ORM with SQLite

## API Endpoints

### Health Check
- `GET /health` - Check service health

### Email Operations
- `POST /api/email/send` - Send an email
- `GET /api/email/recent?limit=10` - Get recent emails
- `GET /api/email/:id` - Get email by ID

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your SMTP configuration

5. Generate Prisma client:
   ```bash
   npm run db:generate
   ```

6. Run database migrations:
   ```bash
   npm run db:migrate
   ```

### Development

Start the development server:
```bash
npm run start:dev
```

### Production

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm run start:prod
```

## API Usage

### Send Email

```bash
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Test Email",
    "html": "<p>Hello, world!</p>"
  }'
```

### Get Recent Emails

```bash
curl http://localhost:3000/api/email/recent?limit=5
```

### Get Email by ID

```bash
curl http://localhost:3000/api/email/{email-id}
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - Database connection string
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `FROM_EMAIL` - Default sender email

## Database

The service uses SQLite with Prisma ORM. Database file is located at `prisma/dev.db`.

### Database Schema

```prisma
model Email {
  id        String   @id @default(cuid())
  to        String
  subject   String
  html      String?
  templateID String?
  vars      Json?
  status    String
  error     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:prod` - Start in production mode
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## License

UNLICENSED