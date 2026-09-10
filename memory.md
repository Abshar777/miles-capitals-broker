# Frontend Developer Memory

## Environment

| Variable | Value |
|----------|-------|
| Production URL | `https://testing-client.carlton-fx.com` |
| Backend API | `https://api-crm-client.carltonfx.com` |
| Session cookie | `client-mt5-session-token` |
| Node version | 18+ (Next.js 15 requirement) |

---

## Key File Locations

| What | Where |
|------|-------|
| Auth config | `src/config/auth.config.ts` |
| API constants | `src/constants/apiServices.ts` |
| Global styles + CSS vars | `src/app/globals.css` |
| Root layout (fonts) | `src/app/layout.tsx` |
| Auth layout | `src/app/auth/layout.tsx` |
| Dashboard layout | `src/app/root/layout.tsx` |
| Middleware (route guard) | `middleware.ts` |
| All Zustand stores | `src/store/` |
| All API modules | `src/api/` |
| Zod schemas | `src/schema/` |
| Types | `src/types/` |

---

## Authentication Gotchas

### Session Cookie Name
The cookie is named `client-mt5-session-token` (not default `next-auth.session-token`). This prevents collision with the admin app (`admin-mt5-session-token`). Always use this name when reading/clearing session cookies manually.

### OTP Gate
After login, if `token.otpAccess === false`, middleware redirects to `/auth/otp`. The OTP page only verifies the code and flips `otpAccess` to `true`. Don't add any user-accessible content behind OTP gate without checking the session flag.

### Token in Session
The backend JWT token is stored in the NextAuth session as `session.user.token`. This is the bearer token sent with all API requests. It expires based on `ACCESS_TOKEN_EXPIRE_MINUTES` in backend `.env` (currently 60 minutes).

---

## API Call Pattern

```typescript
// In src/api/someFeature.ts
import { axiosWithAuth } from "./utils"
import { Services } from "@/constants/apiServices"

export const getSomething = async (token: string) => {
  const res = await axiosWithAuth(token).get(`${Services.SOMETHING}/endpoint`)
  return res.data
}

// In a hook
import { useQueryData } from "@/hooks/useQueryData"
import { getSomething } from "@/api/someFeature"
import { useSession } from "next-auth/react"

export function useFeature() {
  const { data: session } = useSession()
  return useQueryData(
    ["feature", "list"],
    () => getSomething(session?.user?.token!)
  )
}
```

---

## State Management Rules

### Use Zustand for:
- UI state (modal open/closed, selected item)
- Theme (light/dark)
- User profile data (from session)

### Use React Query for:
- Anything fetched from the API
- Lists, details, mutations

### Don't mix them:
- Don't store API response data in Zustand
- Don't use useState for async/server data

---

## MT5 Account Logic

- MT5 accounts are stored in `mt5_accounts` table on the backend
- Migrated legacy accounts are in `mt5_accounts_legacy` (different table)
- Frontend only calls `/api/v1/mt5/*` — backend handles the routing
- `credential_id` is resolved on the backend; frontend never sends it
- Balance = 0 is valid — don't treat as "not fetched"
- `master_password` and `investor_password` can be null (Optional in Pydantic)

---

## Component Patterns

### Opening a Modal
```typescript
// Store-controlled modal
const { openModal } = useMt5UiStore()
<Button onClick={openModal}>Create Account</Button>

// The modal component reads from store
const { isOpen } = useMt5UiStore()
<Dialog open={isOpen}>...</Dialog>
```

### Success/Error Feedback
```typescript
// Toast (for quick messages)
import { toast } from "sonner"
toast.success("Account created")
toast.error("Failed: " + error.message)

// Success modal (for important completions)
const { openModal: openSuccessModal } = useModalStore()
openSuccessModal({ title: "Done!", message: "Your account is ready." })
```

### Table with URL State
```typescript
import { useQueryState } from "nuqs"

const [page, setPage] = useQueryState("page", { defaultValue: "1" })
const [status, setStatus] = useQueryState("status", { defaultValue: "" })
```

---

## IB Room Notes

- IB = Introducing Broker
- A client can be an IB if they have a referral link
- IB wallet is separate from main wallet
- Commission is earned per trade of referred clients
- Commission plan determines the rate (set by admin)
- `useIbUiStore` — controls IB-related modals

---

## Known Patterns / Conventions

### File Naming
- Pages: `page.tsx` (lowercase, as required by Next.js App Router)
- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- API modules: `camelCase.ts`
- Stores: `camelCaseStore.ts`

### Import Aliases
```typescript
"@/components/..."  → src/components/
"@/hooks/..."       → src/hooks/
"@/api/..."         → src/api/
"@/store/..."       → src/store/
"@/lib/..."         → src/lib/
"@/types/..."       → src/types/
```

### `cn()` Utility
```typescript
import { cn } from "@/lib/utils"
// Merges Tailwind classes safely (via tailwind-merge + clsx)
<div className={cn("base-class", condition && "conditional-class", className)} />
```

---

## Build Notes

- `typescript.ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true` — build won't fail on TS/ESLint errors
- Images from external domains need to be added to `next.config.ts` `remotePatterns`
- Cloudflare R2 bucket URL: `https://pub-33aa3bdc8cd54214991d18e5d443a35e.r2.dev`

---

## CoinsBuy Integration

- API base: `https://v3.api-sandbox.coinsbuy.com` (sandbox)
- Client ID: `601331105048191560`
- Used for crypto deposit payments
- State managed in `useCoinsbayUiStore` Zustand store
- Hook: `useCoinsbay.ts`

---

## Fonts

Fonts are loaded via `next/font/google` in `src/app/layout.tsx`:
```typescript
import { DM_Sans, Work_Sans, Special_Gothic_Expanded_One } from "next/font/google"
```
- **DM Sans** → `--font-sans` → default body font
- **Work Sans** → `--font-mono` → numeric/code sections  
- **Special Gothic Expanded One** → `--font-special` → display headings

---

## Date / Time

- `date-fns ^4.1.0` for all date formatting
- `react-day-picker ^9.11.1` for date picker UI
- All timestamps from API are UTC; display in local time via date-fns
- Common format: `format(new Date(timestamp), "MMM dd, yyyy")`

---

## Changelog / Major History

| Date | Change |
|------|--------|
| 2026-04 | MT5 legacy accounts migrated to `mt5_accounts_legacy` table |
| 2026-04 | MT5 bridge timeout increased to 120s |
| 2026-04 | `Optional[str]` fix for master/investor password in Pydantic |
| 2026-04 | CORS fix on MT5 accounts endpoint |
| 2026-04 | Excel user migration to production database |
