# Frontend Features

## Authentication (`/auth`)

All auth pages share the Miles Capital reference look (see `design.md` → Auth Pages): dark navy background, gold accent, Rubik, centered 480px card. `/` redirects to `/auth/landing`.

### Landing (`/auth/landing`)
- Hero "Start Trading Today" + subtitle + gold "Create Account"
- Feature carousel (4 slides: deposits, trading, wallets, finance ops) with arrows, dots, autoplay
- Header shows "Create Account" and "Log In" buttons

### Login (`/auth/login`)
- "Welcome back" card: Email, Password (eye toggle), "Forgot password?" link, auto-width "Log In" button (disabled until filled)
- SSO token login (`?sso=`) via `/proxy/api/v1/auth/sso-login`
- Footer "Don't have an account? Sign up"

### Register (`/auth/register`)
- "Enter Account Details": First Name, Last Name, Country (flag select), City, Phone (dial-code select + number), Email, Enter Password (rule list), Repeat password, "I agree with Customer Agreement" checkbox
- "Continue" disabled until form valid + agreement checked; payload unchanged (`firstname, lastname, country, city, phone, email, password, repeat_password`)
- "← Back" under the card; referral code from `?referral=` stored in localStorage

### OTP Verification (`/auth/otp`)
- "Verify your email" card, six 56px slots, "Continue" enabled at 6 digits, "Resend" link
- Guards: only accessible when `otpAccess` is set

### Forgot Password (`/auth/forgot-password`)
- "Reset Password" card: instruction text, Email field, full-width "Continue", "← Back"

### Reset Password (`/auth/reset-password`)
- "Reset Password" card: New password (rule list) + Repeat password, full-width "Continue"

---

## Dashboard (`/root/dashboard`)
- Header title "Welcome, {first name}"
- Identity-verification banner with ring progress and "Verify Now" (hidden once KYC approved)
- Portfolio block: All / Trading Accounts / Wallet pills, combined balance (wallet + live MT5), Deposit and Transfer shortcuts
- Last Transactions: latest 4 from the all-transactions feed with direction-colored amounts and status dots, "All" link to Transaction History
- Trading Accounts: horizontal row of MT5 account cards (balance, login, Transfer), "+ Create New" opens the MT5 connect modal

## App Shell
- 272px sidebar: Dashboard, Wallets, MT5, Funds (Deposit, Withdraw, Transfer, MT5 to Wallet, Internal Transfer), Transaction History, Helpdesk (New badge / unread count), IB Room; footer "Leave feedback" and "Collapse"
- 80px header: page title, theme toggle, language chip, notifications bell with unread pill, helpdesk shortcut, avatar menu (Profile Info, Verification level, Security, Logout)

## Profile (`/root/profile`)
- Reference "Profile Info" layout: key/value sections (Profile info, Account, Other, Sign out) + initials avatar block on the right

- **Personal Information**: Name, email, phone, country, city — editable
- **Password Change**: Current password + new password form
- **Notification Preferences**: Toggle notification types
- **KYC Status**: Shows verification level, link to verification page
- **Avatar Upload**: Profile picture management (Cloudflare R2 storage)

---

## Wallets (`/root/wallets`)
- Reference layout: estimated total (hide/show), search, sort, layout toggle, All/Favorites/Fiat/Crypto pills, "Hide zero balances", two-column wallet cards with Base Value / On Hold; favorites saved locally

- **Wallet Balance**: Real-time balance display
- **Transaction History**: Paginated list of all wallet transactions
- **IB Wallet**: Separate IB commission wallet balance
- **Statement Download**: Export transaction history

---

## Transactions (`/root/transactions`)
- Underline tabs (All default), reference table with search, status/type filters, date range, Columns picker, pagination footer

- Full transaction history across all sources
- Filters: date range, type (deposit/withdrawal/transfer), status
- Sortable columns via TanStack Table
- Pagination with URL state (nuqs)
- Export functionality

---

## Funds (`/root/funds`)
- Underline tabs across Deposit / Withdraw / Transfer / MT5 to Wallet / Internal Transfer; each page = form (left) + `HistoryList` (right) with "See More" to Transactions

### Deposit (`/root/funds/deposit`)
- Select payment method (bank transfer, card, crypto)
- Payment options fetched from `/api/v1/payment-options`
- Upload proof of payment (Cloudflare R2)
- CoinsBuy crypto payment integration
- Pending status tracking

### Withdrawal (`/root/funds/withdraw`)
- Withdrawal amount entry
- Select withdrawal method
- Bank account details entry
- Minimum/maximum amount validation
- Pending approval flow

### Wallet Transfer (`/root/funds/transfer`)
- Transfer between user wallets
- Amount + recipient selection
- Real-time balance check

### Internal Transfer (`/root/funds/internal-transfer`)
- Wallet ↔ MT5 account transfers
- Select MT5 account from user's accounts
- Available balance validation

### MT5 → MT5 Transfer (`/root/funds/mt5-mt5`)
- Transfer between two MT5 trading accounts
- Both accounts must belong to the same user
- Amount and direction selection

### MT5 → Wallet (`/root/funds/mt5-wallet`)
- Withdraw funds from MT5 account to wallet
- Fetches current MT5 balance via bridge API

---

## MT5 Accounts (`/root/mt5`)
- Reference list: Add Account / Last Updated, All/Live/Demo pills, search, sort, two-column account cards; settings icon opens details (copy, reset passwords, leverage, Deposit, Trade)

- **Account List**: All user's MT5 trading accounts
- **Account Details**: Balance, equity, leverage, group, category
- **Create Account**: Request new MT5 account (live/demo)
- **Password Change**: Reset master and investor passwords
- **Account Types**: Standard, Pro, Premium, Zero, Edu (by group)
- **Account Credentials**: View/copy login, master password, investor password
- **Bridge Integration**: Real-time balance/equity via MT5 bridge API

---

## IB Room (`/root/ib-room`)
- Underline tabs Overview / Clients / Commissions / Transactions; overview shows Plan box, Partner Link card, IB Wallet card, client counts, referred clients list

- **IB Dashboard**: Commission overview, referral tree statistics
- **Referral Link**: Unique referral link generation and copy
- **Commission History**: Paginated commission earnings
- **Downline Clients**: List of referred clients and their trading activity
- **IB Wallet**: Commission wallet balance and claim functionality
- **Commission Plans**: View assigned commission plan details

---

## Verification / KYC (`/root/verification`)
- Reference layout: level header with progress + Upgrade, Level 0 / Level 1 tabs, features table, KYC requirements, Document Verification table with View modal

- **Verification Status**: Current KYC level (unverified / pending / verified)
- **Document Upload**: ID front/back, proof of address
- **Selfie Upload**: Liveness check photo
- **Upgrade Path**: `/root/verification/upgrade` — step-by-step upgrade flow
- **Status Tracking**: Real-time status updates after document submission

---

## Support (`/root/support`) — shown as "Helpdesk"
- Underline status tabs, "+ New Ticket", ticket rows; thread view with gold client / navy support bubbles

### Ticket List (`/root/support`)
- All open and closed support tickets
- Status badges (open, in progress, closed)
- Create new ticket button (opens modal — `useSupportUiStore`)

### Ticket Detail (`/root/support/[id]`)
- Full conversation thread with admin
- Message reply form
- Ticket status and category display
- File attachment support

---

## Notifications

- **Bell Icon**: Header notification badge with unread count
- **Notification Feed**: Slide-in panel with notification list
- **Mark as Read**: Individual and bulk mark-as-read
- **Types**: Deposit approved, withdrawal processed, KYC update, support reply, MT5 updates

---

## Command Palette (kbar)

- Activated via keyboard shortcut (⌘K / Ctrl+K)
- Quick navigation to any page
- Recent actions shortcut
- **Library**: `kbar ^0.1.0-beta.45`

---

## Real-time Features

- **Prices**: Live market data polled via React Query with `refetchInterval`
- **Notifications**: Polling or WebSocket for real-time notification updates
- **MT5 Balance**: Balance fetched live from bridge API when viewing account

---

## URL State Persistence

All list pages use **nuqs** to persist:
- Current page number
- Active filters (date range, status, type)
- Sort column and direction
- Search query

This means filter state survives page refresh and can be shared via URL.

---

## Responsive Features

- **Mobile Sidebar**: Collapses to slide-in drawer on mobile
- **use-mobile hook**: Components conditionally render mobile-optimized layouts
- **Responsive tables**: Horizontal scroll on small screens, column hiding on mobile
- **Touch gestures**: Drawer/sheet components support swipe-to-close via `vaul`

---

## Payment Methods

| Method | Integration | Status |
|--------|------------|--------|
| Bank Transfer | Manual upload | Active |
| Credit/Debit Card | Payment gateway | Active |
| Crypto | CoinsBuy API | Active |
| Custom | Admin-configured payment options | Configurable |

---

## API Services Enum

```typescript
enum Services {
  AUTH     = "/api/v1/auth"
  DEPOSIT  = "/api/v1/deposit"
  WITHDRAW = "/api/v1/withdrawal"
  KYC      = "/api/v1/kyc"
  MT5      = "/api/v1/mt5"
  WALLET   = "/api/v1/wallet"
  NOTIFICATION = "/api/v1/notifications"
  PRICES   = "/api/v1/prices"
  USERS    = "/api/v1/users"
  ACCOUNTS = "/api/v1/accounts"
  SUPPORT  = "/api/v1/support/tickets"
  IB       = "/api/v1/ib"
  WALLET_TRANSFERS = "/api/v1/wallet-transfers"
  PAYMENT_OPTIONS  = "/api/v1/payment-options"
  COINSBUY = "/api/v1/coinsbuy"
}
```
