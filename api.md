# Frontend API Reference

## Overview

All API calls go to the backend client API at `https://api.milescapitals.com`.

**Auth**: Bearer token from NextAuth session (`session.user.token`)  
**HTTP Client**: Axios with interceptors (`src/utils/axios.ts`)  
**Pattern**: Each module in `src/api/` maps to one feature domain  

### Axios Setup (`src/utils/axios.ts`)
```typescript
baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
withCredentials: true
headers: { Authorization: `Bearer ${token}` }
// Request interceptor auto-appends:
// - skip, limit from URL query params
// - use_cache: false, skip_cache: true (disables server cache)
```

### API Service Base Paths (`src/constants/apiServices.ts`)
```typescript
AUTH            = "/api/v1/auth"
DEPOSIT         = "/api/v1/deposit"
WITHDRAW        = "/api/v1/withdrawal"
KYC             = "/api/v1/kyc"
MT5             = "/api/v1/mt5"
WALLET          = "/api/v1/wallet"
NOTIFICATION    = "/api/v1/notifications"
PRICES          = "/api/v1/prices"
USERS           = "/api/v1/users"
ACCOUNTS        = "/api/v1/accounts"
SUPPORT         = "/api/v1/support/tickets"
IB              = "/api/v1/ib"
WALLET_TRANSFERS = "/api/v1/wallet-transfers"
PAYMENT_OPTIONS = "/api/v1/payment-options"
COINSBUY        = "/api/v1/coinsbuy"
```

---

## `src/api/auth.ts` — Authentication

**Why used**: Handles complete user auth flow — register, login, OTP verification, password reset. Called from `/auth/*` pages.

| Function | Method | Endpoint | Body / Params | Used On Page |
|----------|--------|----------|--------------|-------------|
| `register` | POST | `/api/v1/auth/signup` | `{email, password, name}` | `/auth/register` |
| `login` | POST | `/api/v1/auth/login` | `{email, password}` | `/auth/login` (via NextAuth) |
| `verifyOtp` | POST | `/api/v1/auth/verify` | `{code, email}` | `/auth/otp` |
| `resendOtpApi` | POST | `/api/v1/auth/resend-verification?email=` | query param | `/auth/otp` |
| `OAuthLogin` | POST | `/api/v1/auth/auth/oauth-login` | `{token, provider}` | OAuth buttons |
| `forgetPasswordApi` | POST | `/api/v1/auth/forgot-password` | `{email}` | `/auth/forgot-password` |
| `verifyResetCode` | POST | `/api/v1/auth/verify-reset-code` | `{code, email}` | `/auth/reset-password` |
| `resendResetCodeApi` | POST | `/api/v1/auth/resend-reset-code` | `{email}` | `/auth/forgot-password` |
| `conformPasswordApi` | POST | `/api/v1/auth/reset-password` | `{reset_token, new_password, repeat_password}` | `/auth/reset-password` |

---

## `src/api/user.ts` — User Profile

**Why used**: Fetches logged-in user's profile data. Stored in `useUserStore` Zustand store for global access.

| Function | Method | Endpoint | Body / Params | Used On Page |
|----------|--------|----------|--------------|-------------|
| `getUser` | GET | `/api/v1/auth/profile` | token in header | Loaded on dashboard init, `/root/profile` |

---

## `src/api/wallet.ts` — Wallet

**Why used**: Displays wallet balance and transaction history. The main financial account for the client.

| Function | Method | Endpoint | Body / Params | Used On Page |
|----------|--------|----------|--------------|-------------|
| `walletBalance` | GET | `/api/v1/wallet/balance` | token | `/root/dashboard`, `/root/wallets` |
| `walletSummery` | GET | `/api/v1/wallet/summary` | token | `/root/wallets` |
| `trasferHistory` | GET | `/api/v1/wallet/transactions` | pagination params | `/root/wallets`, `/root/transactions` |

---

## `src/api/deposit.ts` — Deposits

**Why used**: Clients submit deposit requests with proof-of-payment screenshots. Admin reviews and approves.

| Function | Method | Endpoint | Body / Params | Used On Page |
|----------|--------|----------|--------------|-------------|
| `deposit` | POST | `/api/v1/deposit/deposit` | FormData: `{amount, receive_amount, currency, proof_deposit_image, payment_mode, payment_option_id}` | `/root/funds/deposit` |
| `getDepositeHistory` | GET | `/api/v1/deposit/deposits/history` | `?skip&limit&status&currency&payment_mode&date_from&date_to` | `/root/transactions` |
| `deleteDeposit` | DELETE | `/api/v1/deposit/deposit/{id}` | deposit id in path | `/root/transactions` (cancel button) |

---

## `src/api/withdraw.ts` — Withdrawals

**Why used**: Clients request to withdraw funds via multiple methods. Different endpoints for different withdrawal types (bank, crypto, cash, dynamic).

| Function | Method | Endpoint | Body / Params | Used On Page |
|----------|--------|----------|--------------|-------------|
| `getWithdrawalTypes` | GET | `/api/v1/withdrawal/types` | token | `/root/funds/withdraw` (populate method dropdown) |
| `withdraw` | POST | `/api/v1/withdrawal/request` | `{amount, currency, withdrawal_method}` | `/root/funds/withdraw` (generic) |
| `withdrawBankTransfer` | POST | `/api/v1/withdrawal/bank` | `{amount, currency, bank_name, account_number, account_holder_name, swift_code, routing, ifsc, branch}` | `/root/funds/withdraw` (bank tab) |
| `withdrawCrypto` | POST | `/api/v1/withdrawal/crypto` | `{amount, currency, crypto_address, crypto_amount, network}` | `/root/funds/withdraw` (crypto tab) |
| `withdrawCash` | POST | `/api/v1/withdrawal/cash` | `{amount, currency, collector_id_type, collector_id_number, collector_name, collection_location}` | `/root/funds/withdraw` (cash tab) |
| `createWithdrawal` | POST | `/api/v1/withdrawals` | `{amount, currency, withdrawal_type_id, withdrawal_name, details}` | `/root/funds/withdraw` (dynamic type) |
| `getWithdrawHistory` | GET | `/api/v1/withdrawals/dynamic/history` | pagination + filters | `/root/transactions` |
| `cancelWithdrawal` | POST | `/api/v1/withdrawal/{id}/cancel` | id in path | `/root/transactions` (cancel button) |

---

## `src/api/kyc.ts` — KYC Verification

**Why used**: Regulatory compliance — clients upload identity documents to unlock full account features (higher withdrawal limits etc.).

| Function | Method | Endpoint | Body / Params | Used On Page |
|----------|--------|----------|--------------|-------------|
| `kyc` | POST | `/api/v1/kyc/upload` | FormData: `{identity_name, identity_front, identity_back, residency_name, residency_front, residency_back}` | `/root/verification` |
| `getKYCDocuments` | GET | `/api/v1/kyc/documents` | token | `/root/verification` (show submitted docs) |

---

## `src/api/mt5.ts` — MT5 Trading Accounts

**Why used**: Core trading feature. Clients create, fund, and manage MT5 accounts. Balance/equity fetched live from MT5 server via bridge API.

| Function | Method | Endpoint | Body / Params | Used On Page |
|----------|--------|----------|--------------|-------------|
| `getMt5AccList` | GET | `/api/v1/mt5/accounts?account_type=` | optional type filter | `/root/mt5` (account list) |
| `getAccDetails` | GET | `/api/v1/mt5/accounts/{login}?credential_id=` | login + credential | `/root/mt5` (account card expand) |
| `createMt5Acc` | POST | `/api/v1/mt5/accounts` | `{leverage, account_category, currency, firstname, lastname, credentials_id, type}` | `/root/mt5` (create account modal) |
| `getMt5Credentials` | GET | `/api/v1/mt5/credentials` | token | `/root/mt5` (populate server dropdown when creating) |
| `getMt5Groups` | GET | `/api/v1/mt5/account-categories` | token | `/root/mt5` (populate category dropdown) |
| `resetMt5Password` | POST | `/api/v1/mt5/accounts/reset-password` | `{login, credential_id}` | `/root/mt5` (reset password button) |
| `updateLavrage` | POST | `/api/v1/mt5/accounts/update-leverage` | leverage data | `/root/mt5` (change leverage) |
| `transferFunds` | POST | `/api/v1/mt5/deposit` | `{user_login, deposit_amount, comment, credential_id}` | `/root/funds/deposit` (deposit to MT5) |
| `getMt5Balance` | GET | `/api/v1/mt5/wallet-balance` | token | `/root/funds/deposit` (show available wallet) |
| `getMt5DepositHistory` | GET | `/api/v1/mt5/deposit-history` | pagination | `/root/transactions` |
| `mT5ToMT5Transfer` | POST | `/api/v1/mt5/internal-transfer` | `{credential_id, source_login, destination_login, amount}` | `/root/funds/mt5-mt5` |
| `mT5ToMt5TransferHistory` | GET | `/api/v1/mt5/internal-transfer/history` | pagination | `/root/funds/mt5-mt5` (history tab) |
| `mt5ToWalletTransfer` | POST | `/api/v1/mt5/transfer-to-wallet` | `{credential_id, mt5_login, amount, currency: "USD"}` | `/root/funds/mt5-wallet` |
| `getMt5TransferToWalletHistory` | GET | `/api/v1/mt5/transfer-to-wallet/history` | token | `/root/funds/mt5-wallet` (history tab) |
| `getMt5ToWalletTransferByID` | GET | `/api/v1/mt5/transfer-to-wallet/{id}` | id in path | Transfer detail view |
| `getUserIdValid` | GET | `/api/v1/users/find-by-id/{userId}` | userId in path | Validate recipient before transfer |

---

## `src/api/ib.ts` — Introducing Broker Program

**Why used**: Clients can become IBs — they share referral links and earn commission on every trade their referred clients make.

| Function | Method | Endpoint | Body / Params | Used On Page |
|----------|--------|----------|--------------|-------------|
| `getIbStatus` | GET | `/api/v1/ib/status` | token | `/root/ib-room` (check if user is IB) |
| `applyIB` | POST | `/api/v1/ib/apply` | application data | `/root/ib-room` (apply to become IB) |
| `getMyRefralLink` | GET | `/api/v1/ib/my-referral-link` | token | `/root/ib-room` (show referral link) |
| `getPlans` | GET | `/api/v1/ib/plans/public` | token | `/root/ib-room` (show available plans) |
| `getDefaultPlan` | GET | `/api/v1/ib/plans/default` | token | `/root/ib-room` |
| `joinReferralApi` | POST | `/api/v1/ib/referrals/join` | `{referral_code}` | Registration flow (referral code input) |
| `claimRefralApi` | GET | `/api/v1/ib/claims/ref/{refCode}` | ref code in path | Referral landing page |
| `getMyClients` | GET | `/api/v1/ib/my-clients?skip_cache=true` | token | `/root/ib-room` (downline clients table) |
| `getMt5Trades` | GET | `/api/v1/ib/mt5/trades` | token | `/root/ib-room` (trades from referred clients) |

---

## `src/api/ib-wallet.ts` — IB Commission Wallet

**Why used**: IB commissions accumulate in a separate IB wallet. Clients can view earnings and transfer to main wallet.

| Function | Method | Endpoint | Body / Params | Used On Page |
|----------|--------|----------|--------------|-------------|
| `getIbWalletBalance` | GET | `/api/v1/ib/wallet/balance` | token | `/root/ib-room` (commission balance card) |
| `getIbWalletCommissions` | GET | `/api/v1/ib/wallet/commissions` | pagination | `/root/ib-room` (commissions tab) |
| `getIbWalletTransactions` | GET | `/api/v1/ib/wallet/transactions` | pagination | `/root/ib-room` (wallet history tab) |
| `transferToMain` | POST | `/api/v1/ib/wallet/transfer-to-main` | `{amount}` | `/root/ib-room` (transfer to wallet button) |

---

## `src/api/notification.ts` — Notifications

**Why used**: Real-time alerts for deposit approvals, KYC decisions, support replies. Shows badge count in header.

| Function | Method | Endpoint | Body / Params | Used On Page |
|----------|--------|----------|--------------|-------------|
| `getUnreadCount` | GET | `/api/v1/notifications/unread-count` | token | Header (notification badge number) |
| `getNotifications` | GET | `/api/v1/notifications?is_read=` | optional filter | Notification dropdown panel |
| `readNotification` | POST | `/api/v1/notifications/{id}/read` | id in path | When user clicks a notification |
| `readAllNotifications` | POST | `/api/v1/notifications/mark-all-read` | token | "Mark all read" button |
| `deleteNotification` | DELETE | `/api/v1/notifications/{id}` | id in path | Delete notification button |

---

## `src/api/walletTransfer.ts` — Wallet-to-Wallet Transfers

**Why used**: Peer-to-peer fund transfer between registered users (e.g., client sending funds to another client).

| Function | Method | Endpoint | Body / Params | Used On Page |
|----------|--------|----------|--------------|-------------|
| `walletToWalletTransfer` | POST | `/api/v1/wallet-transfers` | `{to_user_id, amount, currency: "USD"}` | `/root/funds/transfer` |
| `walletTransferHistory` | GET | `/api/v1/wallet-transfers/history` | pagination | `/root/transactions` |
| `cancelWalletTransfer` | POST | `/api/v1/wallet-transfers/{id}/cancel` | id in path | `/root/transactions` (cancel button) |

---

## `src/api/transfers.ts` — All Transfers

**Why used**: Aggregated view of all transfer types on the transactions page.

| Function | Method | Endpoint | Body / Params | Used On Page |
|----------|--------|----------|--------------|-------------|
| `getAllTransfers` | GET | `/api/v1/mt5/all-transfers?{params}` | pagination params | `/root/transactions` (combined view) |

---

## `src/api/paymentOptions.ts` — Payment Options

**Why used**: Deposit form needs to show available payment methods. Admin configures these (bank accounts, crypto addresses).

| Function | Method | Endpoint | Body / Params | Used On Page |
|----------|--------|----------|--------------|-------------|
| `getPaymentOptions` | GET | `/api/v1/payment-options?currency=` | currency filter | `/root/funds/deposit` (payment method selector) |
| `getAvailableCurrencies` | GET | `/api/v1/payment-options/currencies/list` | token | `/root/funds/deposit` (currency dropdown) |

---

## `src/api/prices.ts` — Market Prices

**Why used**: Dashboard displays live exchange rates and asset prices in charts. Auto-refreshes via React Query interval.

| Function | Method | Endpoint | Body / Params | Used On Page |
|----------|--------|----------|--------------|-------------|
| `getPrices` | GET | `/api/v1/prices` | token | `/root/dashboard` (price charts) |
| `getPrice` | GET | `/api/v1/prices/{code}` | code in path | Currency conversion displays |

---

## `src/api/supportSystem.ts` — Support Tickets

**Why used**: Client-to-admin communication channel for help requests, account issues, complaints.

| Function | Method | Endpoint | Body / Params | Used On Page |
|----------|--------|----------|--------------|-------------|
| `getTickets` | GET | `/api/v1/support/tickets` | pagination + filters | `/root/support` (ticket list) |
| `getTicketById` | GET | `/api/v1/support/tickets/{id}` | id in path | `/root/support/[id]` |
| `raiseTicket` | POST | `/api/v1/support/tickets` | FormData: `{subject, message, attachment?}` | Create ticket modal |
| `sendMessage` | POST | `/api/v1/support/tickets/{id}/messages` | FormData: `{message, attachment?}` | Ticket detail reply form |
| `readMessage` | POST | `/api/v1/support/tickets/{id}/read` | id in path | Auto-called when viewing ticket |

---

## `src/api/coinsbay.ts` — Crypto Payments (CoinsBuy)

**Why used**: Alternative deposit method using cryptocurrency. Creates a payment intent and monitors status.

| Function | Method | Endpoint | Body / Params | Used On Page |
|----------|--------|----------|--------------|-------------|
| `createCoinsbayDeposit` | POST | `/api/v1/coinsbuy/create-deposit` | deposit data | `/root/funds/deposit` (crypto tab) |
| `getCoinsbayDepositStatus` | GET | `/api/v1/coinsbuy/deposit/{id}/status` | id in path | Deposit status polling |
| `coinsbayWebhook` | POST | `/api/v1/coinsbuy/webhook` | webhook payload | Handled server-side |
| `getCoinsbayWallets` | GET | `/api/v1/coinsbuy/wallets` | token | Crypto wallet selector |

---

## `src/api/utils.ts` — Exchange Rates (External)

**Why used**: Real-time currency conversion rates for showing amounts in local currency (AED, INR, USDT).

| Function | Method | URL | Returns | Used On Page |
|----------|--------|-----|---------|-------------|
| `fetchExchangeRates` | GET | `https://api.exchangerate-api.com/v4/latest/USD` | `{AED, INR, USD, USDT rates}` | Deposit/withdrawal forms (currency conversion display) |

> **Note**: This calls an **external** API (exchangerate-api.com), not the backend. Results are cached to avoid rate limits.

---

## Hook Usage Pattern

Every API module is wrapped in a custom hook:

```typescript
// useDeposit.ts
import { useQueryData } from "./useQueryData"
import { useMutation } from "./useMutation"
import { getDepositeHistory, deposit } from "@/api/deposit"
import { useSession } from "next-auth/react"

export function useDepositHistory(filters) {
  const { data: session } = useSession()
  // React Query caches this — refetched when filters change
  return useQueryData(
    ["deposits", "history", filters],
    () => getDepositeHistory(session?.user?.token!, filters)
  )
}

export function useDeposit() {
  return useMutation({
    mutationFn: (data) => deposit(token, data),
    onSuccess: () => {
      toast.success("Deposit submitted")
      queryClient.invalidateQueries({ queryKey: ["deposits"] })
    },
    onError: (e) => toast.error(e.message)
  })
}
```

---

## Common Request Headers

```typescript
// Every authenticated request includes:
Authorization: Bearer <session.user.token>
Content-Type: application/json         // for JSON requests
Content-Type: multipart/form-data      // for file uploads (KYC, deposits, support)
```

## Pagination Convention

Most list endpoints use:
```typescript
?skip=0&limit=20    // offset-based pagination
?offset=0&limit=20  // alternative naming
```
URL state managed via `nuqs` — pagination state persists in URL.
