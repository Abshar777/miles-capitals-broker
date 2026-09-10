# Frontend Architecture


## Overview

**Framework**: Next.js 15.5.9 (App Router)  
**Language**: TypeScript 5  
**Runtime**: React 19.2.1  
**Deployment Target**: Production at `https://testing-client.carlton-fx.com`  
**Backend API**: `https://api-crm-client.carltonfx.com`

---

## Project Structure

```
src/
├── app/                    # Next.js App Router — pages and API routes
│   ├── api/
│   │   └── auth/[...nextauth]/route.ts   # NextAuth catch-all handler
│   ├── auth/               # Public authentication pages
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── otp/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── token/[id]/page.tsx
│   ├── root/               # Protected application pages
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── wallets/page.tsx
│   │   ├── transactions/page.tsx
│   │   ├── mt5/page.tsx
│   │   ├── ib-room/page.tsx
│   │   ├── verification/page.tsx
│   │   ├── support/page.tsx
│   │   ├── support/[id]/page.tsx
│   │   └── funds/
│   │       ├── page.tsx
│   │       ├── deposit/page.tsx
│   │       ├── withdraw/page.tsx
│   │       ├── transfer/page.tsx
│   │       ├── internal-transfer/page.tsx
│   │       ├── mt5-mt5/page.tsx
│   │       └── mt5-wallet/page.tsx
│   ├── layout.tsx          # Root layout (fonts, providers, metadata)
│   ├── page.tsx            # Root redirect (/ → /root/dashboard or /auth/login)
│   └── globals.css         # Global CSS variables and base styles
├── api/                    # API call modules (axios-based)
├── components/             # React components
│   ├── ui/                 # shadcn/ui base components
│   ├── layout/             # Sidebar, header, navigation
│   ├── forms/              # Feature-specific forms
│   └── (feature dirs)/     # Feature-specific components
├── config/                 # App configuration (auth.config.ts)
├── constants/              # Enums and constants (apiServices.ts)
├── hooks/                  # 25 custom React hooks
├── lib/                    # Shared utilities (utils.ts)
├── schema/                 # Zod validation schemas
├── store/                  # 7 Zustand state stores
├── types/                  # TypeScript type definitions
└── utils/                  # Helper functions
middleware.ts               # NextAuth route protection
next.config.ts              # Next.js build configuration
tailwind.config.js          # Tailwind CSS + HeroUI config
```

---

## Authentication Architecture

### Provider: NextAuth v4 (`next-auth ^4.24.11`)
- **Strategy**: JWT sessions with `CredentialsProvider`
- **Session cookie**: `client-mt5-session-token` (custom name)
- **Session data stored**: `email`, `token` (access_token), `verified`, `otpAccess`, `country`, `city`, `name`, `id`
- **Config**: `src/config/auth.config.ts`

### Auth Flow
```
User submits credentials
       ↓
CredentialsProvider.authorize()
  → POST /api/v1/auth/login (backend)
  → Returns {token, user_data}
       ↓
NextAuth JWT callback
  → Stores token in JWT
       ↓
Session callback
  → Exposes data to client
       ↓
Middleware (middleware.ts)
  → withAuth checks session
  → Redirects unauthenticated → /auth/login
  → Redirects authenticated from /auth → /root/dashboard
```

### OTP Flow
- After login: backend returns `otpAccess: false`
- Middleware checks `token.otpAccess` → redirects to `/auth/otp`
- After OTP verified: `otpAccess: true` → access granted

### Password Reset Flow
- `/auth/forgot-password` → backend sends email with token
- `/auth/token/[id]` → token verification page
- `/auth/reset-password` → password update form

---

## Data Fetching Architecture

### Primary: TanStack React Query v5
- **Version**: `@tanstack/react-query ^5.66.0`
- All server state (API data) managed via React Query
- Hooks wrap React Query: `useQueryData`, `useMutation`
- Cache keys tied to feature domains (`["mt5", login]`, `["wallet"]`, etc.)

### HTTP Client: Axios
- **Version**: `axios ^1.7.9`
- Centralized in `src/api/` modules
- Base URL from environment: `NEXTAUTH_URL` / backend API URL
- Auth token injected from NextAuth session in each request

### API Modules (`src/api/`)
| Module | API Prefix | Purpose |
|--------|-----------|---------|
| `auth.ts` | `/api/v1/auth` | Login, register, OTP, password reset |
| `user.ts` | `/api/v1/users` | Profile, settings |
| `wallet.ts` | `/api/v1/wallet` | Wallet balance, history |
| `deposit.ts` | `/api/v1/deposit` | Deposit requests |
| `withdraw.ts` | `/api/v1/withdrawal` | Withdrawal requests |
| `transfers.ts` | `/api/v1/accounts` | Fund transfers |
| `walletTransfer.ts` | `/api/v1/wallet-transfers` | Wallet-to-wallet transfers |
| `mt5.ts` | `/api/v1/mt5` | MT5 account CRUD, password change |
| `ib.ts` | `/api/v1/ib` | IB referral program |
| `ib-wallet.ts` | `/api/v1/ib` | IB wallet operations |
| `kyc.ts` | `/api/v1/kyc` | KYC document upload |
| `notification.ts` | `/api/v1/notifications` | Real-time notifications |
| `supportSystem.ts` | `/api/v1/support/tickets` | Support ticket CRUD |
| `prices.ts` | `/api/v1/prices` | Live market prices |
| `coinsbay.ts` | `/api/v1/coinsbuy` | Crypto payment via CoinsBuy |
| `paymentOptions.ts` | `/api/v1/payment-options` | Payment method config |
| `utils.ts` | — | Shared axios helpers |

---

## State Management Architecture

### Client State: Zustand v5
7 stores in `src/store/`:

| Store | File | State |
|-------|------|-------|
| `useUserStore` | `userStore.ts` | `user`, `isKYCVerified` |
| `useUiStore` | `uiStore.ts` | `theme`, `color` |
| `useModalStore` | `successModalUiStore.ts` | `isOpen`, `title`, `message`, `data` |
| `useSupportUiStore` | `supportUiStore.ts` | `openModal`, `ticketId` |
| `useMt5UiStore` | `mt5uiStore.ts` | `openModal` |
| `useIbUiStore` | `ibUiStore.ts` | `openModal` |
| `useCoinsbayUiStore` | `coinsBayUiStore.ts` | `value` |

### Server State: React Query
- Async data, caching, background refetch
- `useQueryData` hook wraps `useQuery`
- `useMutation` hook wraps `useMutation` with toast callbacks

---

## URL State Management
- **nuqs** (`^2.7.2`) — type-safe URL search params
- Used for pagination, filters, table state persisted in URL

---

## Routing Architecture

### Route Groups
- `/auth/*` — Public (unauthenticated) routes
- `/root/*` — Protected (authenticated) routes

### Middleware (`middleware.ts`)
```typescript
// Protected routes
matcher: ["/auth/:path*", "/root/:path*"]

// Logic:
// 1. No session → redirect to /auth/login
// 2. Has session + on /auth → redirect to /root/dashboard
// 3. otpAccess=false → redirect to /auth/otp
// 4. Token routes → special handling
```

---

## Component Architecture

### Layers
```
app/root/[feature]/page.tsx         ← Page (data fetching trigger)
  └── components/[feature]/         ← Feature components
        ├── FeatureTable.tsx         ← Data display
        ├── FeatureForm.tsx          ← Forms
        └── FeatureModal.tsx         ← Modals/dialogs
              └── components/ui/    ← shadcn base components
```

### Form Pattern
```typescript
const form = useZodForm({ schema: featureSchema })
const { mutate } = useMutation({
  mutationFn: api.feature.create,
  onSuccess: () => { toast.success("Done") },
  onError: (e) => { toast.error(e.message) }
})
```

---

## Build Configuration

### `next.config.ts`
- `typescript.ignoreBuildErrors: true` — allow TS errors in production build
- `eslint.ignoreDuringBuilds: true` — skip ESLint in CI
- `images.remotePatterns`: localhost, deltatradinghub.com, Cloudflare R2

### Environment Variables
| Variable | Purpose |
|----------|---------|
| `NEXTAUTH_URL` | App base URL for NextAuth |
| `NEXTAUTH_SECRET` | JWT signing secret |
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

---

## Key Architectural Decisions

1. **App Router over Pages Router** — Uses Next.js 13+ App Router for RSC support, layouts, and streaming
2. **Session token naming** — Custom `client-mt5-session-token` avoids cookie collision with admin app
3. **No Redux** — Zustand for UI state (lightweight), React Query for server state (no duplication)
4. **Axios over fetch** — Interceptors, request cancellation, error normalization
5. **Zod + RHF** — Type-safe forms with single source of truth for validation schema
6. **nuqs for URL state** — Filters/pagination survive page refresh without sessionStorage hacks
