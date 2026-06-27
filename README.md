# InfinityAI

The Ultimate All-in-One AI Platform for Content Creation, Image Generation, Career Growth, Productivity, and Development.

InfinityAI is a full-stack AI SaaS application with a React/Tailwind frontend, Express backend, Clerk authentication, PostgreSQL with Prisma, Stripe billing, and AI/image integrations through Gemini, Clipdrop, and Cloudinary.

## Features

- Bright modern AI SaaS interface with responsive layouts and premium Tailwind styling
- Clerk authentication with automatic user sync into PostgreSQL
- Dashboard with categorized AI tools, search, filters, plan locks, and upgrade modal
- AI writing tools:
  - Article writer
  - Blog title generator
- AI image tools:
  - Text-to-image generation
  - Background removal
  - Object removal
- Career tool:
  - Resume review from PDF uploads
- Community gallery for published AI images
- User history page showing saved creations and tool usage
- Markdown-formatted AI outputs with polished loading states
- Credit tracking, plan access control, Stripe checkout, and billing summary
- Prisma models for users, subscriptions, payments, creations, credit usage, and tool usage
- Trie autocomplete with fuzzy tool search and category hash indexes
- Plan-priority AI job processing with bounded concurrency
- Server-side token-bucket rate limits and atomic credit deduction
- LRU/SHA-256 image result deduplication for repeated processing requests
- Deterministic resume ATS scoring using KMP matching, cosine similarity, and weighted ranking
- Usage analytics and weighted dashboard tool recommendations
- Token-safe document chunking, frequency analysis, and repeated-phrase detection
- All 54 catalog tools have runnable workspaces; no dashboard card is a placeholder
- PDF summarization, document analysis, lexical vector retrieval, and file Q&A
- OCR and image captioning through Gemini multimodal input
- AI image upscaling and format-aware logo, thumbnail, poster, and avatar generation
- AST-based JavaScript code intelligence with dependency ordering and complexity checks
- Browser speech recognition and speech synthesis for the voice assistant
- Binary-search history lookup by date

## Tech Stack

### Client

- React 19
- Vite
- Tailwind CSS 4
- React Router
- Clerk React
- Axios
- React Markdown
- Lucide React
- React Hot Toast

### Server

- Node.js
- Express 5
- Clerk Express
- Prisma 6
- PostgreSQL
- Google Generative AI SDK
- Clipdrop API
- Cloudinary
- Stripe
- Multer
- PDF Parse
- Acorn AST parser

## Project Structure

```text
.
|-- client
|   |-- public
|   |   `-- InfinityAI_logo.png
|   `-- src
|       |-- components
|       |-- data
|       |-- pages
|       |-- App.jsx
|       `-- main.jsx
`-- server
    |-- config
    |-- configs
    |-- controllers
    |-- middlewares
    |-- prisma
    |-- routes
    |-- scripts
    |-- utils
    `-- server.js
```

## Prerequisites

- Node.js 18 or newer
- npm
- PostgreSQL database URL
- Clerk application
- Gemini API key
- Clipdrop API key
- Cloudinary account
- Stripe account for paid plans

## Environment Variables

### Client

Create `client/.env`:

```env
VITE_BASE_URL="http://localhost:3000"
VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."
```

### Server

Create `server/.env` using `server/.env.example` as the base:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"

CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""

GEMINI_API_KEY=""
GEMINI_MODEL="gemini-2.5-flash"
CLIPDROP_API_KEY=""
AI_QUEUE_CONCURRENCY="2"
AI_QUEUE_MAX_SIZE="100"

CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

FRONTEND_URL="http://localhost:5173"
CLIENT_URL="http://localhost:5173"
NEXT_PUBLIC_APP_URL="http://localhost:5173"

STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_BASIC_PRICE_ID=""
STRIPE_MODERATE_PRICE_ID=""
STRIPE_PRO_PRICE_ID=""
```

Stripe price IDs must be real Stripe `price_...` IDs from the Stripe Dashboard. Do not use random values for paid plans.

## Installation

Install dependencies for both apps:

```powershell
cd "D:\AI for Everything\client"
npm install
```

```powershell
cd "D:\AI for Everything\server"
npm install
```

## Database Setup

Run these from the `server` folder:

```powershell
cd "D:\AI for Everything\server"
npx prisma generate
npx prisma migrate dev
```

Optional Prisma Studio:

```powershell
npm run prisma:studio
```

## Running Locally

Start the backend:

```powershell
cd "D:\AI for Everything\server"
npm run server
```

The API runs on:

```text
http://localhost:3000
```

Start the frontend:

```powershell
cd "D:\AI for Everything\client"
npm run dev
```

The app runs on:

```text
http://localhost:5173
```

## Available Scripts

### Client

```powershell
npm run dev
npm run build
npm run lint
npm run preview
```

### Server

```powershell
npm run server
npm start
npm run build
npm run lint
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

## Main Routes

### Frontend Routes

- `/` - Home page
- `/about` - About page
- `/contact` - Contact page
- `/privacy` - Privacy policy
- `/ai` - Dashboard
- `/ai/write-article` - Article writer
- `/ai/blog-titles` - Blog title generator
- `/ai/generate-images` - Image generator
- `/ai/remove-background` - Background remover
- `/ai/remove-object` - Object remover
- `/ai/review-resume` - Resume review
- `/ai/tools/:toolSlug` - Shared workspace for every additional catalog tool
- `/ai/community` - Community gallery
- `/ai/history` - User history
- `/ai/billing` - Billing and plans
- `/ai/billing/success` - Billing success
- `/ai/billing/cancel` - Billing cancel

### API Routes

Base API URL:

```text
http://localhost:3000
```

AI routes, protected by Clerk:

- `POST /api/ai/generate-article`
- `POST /api/ai/generate-blog-title`
- `POST /api/ai/generate-image`
- `POST /api/ai/remove-bg`
- `POST /api/ai/remove-object`
- `POST /api/ai/resume-review`
- `POST /api/ai/tools/:toolSlug` - Protected executor for text, image, PDF, OCR, ATS, code, chat, and study workflows

User routes, protected by Clerk:

- `GET /api/user/sync`
- `GET /api/user/history`
- `GET /api/user/get-user-creations`
- `GET /api/user/get-published-creations`
- `POST /api/user/toggle-like-creation`

Billing routes:

- `GET /api/billing/summary`
- `POST /api/billing/checkout`
- `POST /api/billing/cancel`
- `POST /api/billing/webhook`

Tools route:

- `GET /api/tools`

## Database Models

The Prisma schema includes:

- `User`
- `Subscription`
- `Payment`
- `Creation`
- `CreditUsage`
- `ToolUsage`

Key enums:

- `Plan`: `BASIC`, `MODERATE`, `PRO`
- `SubscriptionStatus`
- `PaymentStatus`
- `ToolCategory`
- `CreditAction`

## Authentication Flow

The frontend uses Clerk for sign-in and session tokens. `UserSync.jsx` calls:

```text
GET /api/user/sync
```

after sign-in. The server Clerk middleware verifies the user and upserts the user into PostgreSQL through Prisma.

## AI Provider Notes

- Gemini powers text generation and resume review.
- Gemini multimodal powers OCR and image captioning.
- `GEMINI_MODEL` defaults to `gemini-2.5-flash`.
- Clipdrop powers text-to-image and background removal.
- Cloudinary stores generated and processed images.
- Object removal uses Cloudinary generative image transformations.
- Image upscaling uses Cloudinary's `e_upscale` transformation and accepts source images below 4.2 megapixels.

If a provider fails, check that the relevant `.env` key exists and that the provider account has access to the requested feature.

## Stripe Notes

Paid checkout uses Stripe Checkout. Moderate and Pro plans require real Stripe price IDs:

```env
STRIPE_MODERATE_PRICE_ID="price_..."
STRIPE_PRO_PRICE_ID="price_..."
```

The Basic plan can remain local/free unless you decide to sell it through Stripe.

For local webhook testing, use the Stripe CLI and forward events to:

```text
http://localhost:3000/api/billing/webhook
```

## Verification

Client:

```powershell
cd "D:\AI for Everything\client"
npm run lint
npm run build
npm test
```

Server:

```powershell
cd "D:\AI for Everything\server"
npm run lint
npm run build
```

If `npm run build` on the server fails with a Prisma Windows `EPERM` error, stop any running server, Prisma Studio, or Node process that may be locking files inside `server/node_modules/.prisma/client`, then rerun the command.

The DSA and scoring additions use the existing database models; no schema migration is required.

## Troubleshooting

### Gemini model not found

Set a supported model in `server/.env`:

```env
GEMINI_MODEL="gemini-2.5-flash"
```

Restart the server after changing `.env`.

### User is not saved after Clerk sign-in

Confirm:

- `CLERK_SECRET_KEY` is set in `server/.env`
- `VITE_CLERK_PUBLISHABLE_KEY` is set in `client/.env`
- Backend is running
- Frontend `VITE_BASE_URL` points to the backend
- `GET /api/user/sync` is not failing in the browser network tab

### Image tools fail

Confirm:

- `CLIPDROP_API_KEY` is valid
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are valid
- Cloudinary account supports the transformation used by object removal

### Stripe checkout fails

Confirm:

- `STRIPE_SECRET_KEY` is valid
- Paid plans use real `price_...` IDs
- `FRONTEND_URL` points to the frontend app

## License

ISC
