# Miles Capital — Frontend Design System

> Reference doc for design patterns, tokens, components, and conventions used across the frontend (`/frontend/src`).
> Update this file whenever design tokens, shared components, or layout patterns change.

---

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing & Sizing](#spacing--sizing)
5. [Border & Radius](#border--radius)
6. [Theming (Dark / Light)](#theming-dark--light)
7. [Animation System](#animation-system)
8. [Component Library](#component-library)
9. [Key Shared Components](#key-shared-components)
10. [Form System](#form-system)
11. [Layout & Navigation](#layout--navigation)
12. [Responsive Patterns](#responsive-patterns)
13. [Key Constants](#key-constants)
14. [Folder Structure](#folder-structure)

---

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| Framework | Next.js 15 (App Router) | `^15` |
| UI Components | shadcn/ui (New York style) | — |
| UI Components | HeroUI | `^2.8.5` |
| Styling | Tailwind CSS | `^3` |
| Animation | Framer Motion | `^12.3.1` |
| Animation (JSON) | Lottie (`@lottiefiles/dotlottie-react`) | `^0.18.2` |
| Animation (spinners) | ldrs | `^1.0.2` |
| Forms | React Hook Form + Zod | — |
| Data Fetching | TanStack React Query | — |
| Tables | TanStack React Table | — |
| State | Zustand | — |
| Toasts | Sonner | — |
| Charts | Recharts | — |
| Icons | Lucide React | `^0.545.0` |
| Icons | React Icons (`fa6`, `md`, `ri`, etc.) | `^5.4.0` |
| HTTP | Axios | — |
| Dates | date-fns | — |
| Country flags | react-world-flags | `^1.6.0` |
| Haptics | web-haptics | `^0.0.6` |
| Page progress | nextjs-toploader | `^3.9.17` |
| Command palette | kbar | — |

---

## Color Palette

All colors are CSS custom properties defined in `src/app/globals.css`.

### Brand Color
```
Primary (accent): #d4af37   (gold — identical in light and dark), hover #d7b546
```
Palette is a 1:1 copy of the reference portal `my.milescapitals.com` (`theme.css`). Dark theme is the default and the design target.

### Full Token Table

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `--primary` | `#d4af37` | `#d4af37` | Buttons, links, active states, focus rings |
| `--primary-hover` | `#d7b546` | `#d7b546` | Button hover |
| `--primary-foreground` | `#000000` | `#000000` | Text on gold |
| `--background` | `#ffffff` | `#111222` | Page background (auth card uses the same) |
| `--foreground` | `#343434` | `#ffffff` | Primary text (`text-main`) |
| `--card` | `#f5f5f5` | `#19192f` | Card surface |
| `--field` / `--input` / `--muted` / `--secondary` / `--accent` | `#e6e6e6` | `#282943` | Input container bg, subtle surfaces |
| `--muted-foreground` | `#808080` | `#6c6c81` | Labels, captions (`text-secondary`) |
| `--border` | `#cccccc` | `#2e2f57` | Card border, dividers |
| `--disabled` | `#d6d6d6` | `#1c1d30` | Disabled surfaces |
| `--destructive` | `#bf3838` | `#bf3838` | Errors (`negative`) |
| `--positive` | `#34a322` | `#34a322` | Success |
| `--warning` | `#e69d00` | `#e69d00` | Pending / medium |
| `--demo` | `#319ee1` | `#319ee1` | Demo-account blue |
| `--chart-1..2` | `#52b17c`, `#ffa655` | same | Charts |
| `--sidebar` | `#f5f5f5` | `#19192f` | Sidebar background |
| `--radius` | `4px` | `4px` | Fields, buttons (auth card uses 8px) |

Tailwind utilities exposed for the extra tokens: `bg-field`, `text-positive`, `text-warning`, `bg-primary-hover`, `bg-disabled`, `text-demo`.

### Opacity Utilities (Tailwind)

```
text-foreground/60    secondary text
text-foreground/50    tertiary / captions
text-foreground/80    slightly muted
bg-foreground/5       subtle row fill / hover
bg-primary/10         tinted primary highlight
ring-ring/50          focus ring
border-foreground/10  subtle dashed divider
bg-blue-600/10        info alert background
border-blue-500/20    info alert border
```

---

## Typography

### Fonts

| Variable | Font | Usage |
|---|---|---|
| `var(--font-sans)` / `--font-rubik` | **Rubik** (Google, 300–700, loaded via `next/font`) | Everything — body 15px/24px, weight 400 |

Reference type scale (auth): card title 22px/32px weight 500, hero title 64px/72px weight 500, carousel title 24px/32px weight 500, labels 15px muted, footer links 13px, "Forgot password?" 12px, version tag 12px, buttons 13.33px.

### Size Scale

| Class | Size | Usage |
|---|---|---|
| `text-xs` | 0.75rem | Captions, helper text, badges, secondary table content |
| `text-sm` | 0.875rem | Table rows, form labels, card subtext |
| `text-base` | 1rem | Body text, form inputs |
| `text-lg` | 1.125rem | Sub-headings |
| `text-xl` | 1.25rem | `CardTitle` |
| `text-2xl` | 1.5rem | Page headings |

### Weight

| Class | Weight | Usage |
|---|---|---|
| `font-normal` | 400 | Regular body text |
| `font-medium` | 500 | Labels, table headers |
| `font-semibold` | 600 | Buttons, section titles |
| `font-bold` | 700 | Primary headings |

---

## Spacing & Sizing

### Padding / Gap Conventions

| Context | Classes |
|---|---|
| Card content | `md:p-4 p-3` |
| Card content (form-heavy) | `md:p-6 p-4` |
| Between form fields | `gap-4` or `mt-3` / `mt-4` |
| Between row items | `gap-2` |
| Between card sections | `gap-4` or `gap-6` |
| Button internal padding | `px-4 py-2` |
| Section bottom margin | `mb-14` (history list) |

### Standard Heights

| Element | Height |
|---|---|
| Standard button | `h-9` (36px) |
| Large button | `h-10` (40px) |
| Input field | `h-11` (44px) |
| Icon button (small) | `h-8 w-8` |
| Icon button (standard) | `h-9 w-9` |
| Skeleton loader row | `h-10` |
| History card (page section) | `min-h-[75vh] max-h-[75vh]` |

---

## Border & Radius

### CSS Tokens

| Token | Computed Value | Usage |
|---|---|---|
| `--radius-sm` | ≈ 0.25rem | Small inline elements |
| `--radius-md` | ≈ 0.45rem | Standard inputs |
| `--radius-lg` | 0.65rem (base) | Cards, modals |
| `--radius-xl` | ≈ 0.85rem | Large panels |

### Tailwind Usage by Component

| Component | Class |
|---|---|
| Input fields | `rounded-md` |
| Badges | `rounded-full` |
| Buttons (primary CTAs) | `rounded-full` or `rounded-2xl` |
| Cards | `rounded-lg` or `rounded-2xl` |
| MT5 account card | `rounded-2xl` |
| Modals / Dialogs | `rounded-lg` |
| Skeleton rows | `rounded` |
| Info/alert banners | `rounded-lg` |

### Divider Pattern
```tsx
// Dashed divider in card headers
<CardHeader className="flex flex-row border-b border-foreground/10 border-dashed justify-between items-center">
```

---

## Theming (Dark / Light)

- **Provider**: `next-themes` — class strategy (`.dark` on `<html>`)
- **Store**: `useUiStore` (Zustand) tracks theme preference
- **Toggle**: Header → user nav area
- All components use semantic CSS tokens (`bg-card`, `text-foreground`) — never raw hex colors
- Scrollbars globally hidden: `::-webkit-scrollbar { display: none }`

### Grid Background Classes (auth / landing pages)
```css
.gridAnim          /* Light mode animated dot-grid */
.dark .gridAnim    /* Dark mode animated dot-grid */
.gridWhiteAnim     /* White variant */
```

---

## Animation System

### Variants — `src/constants/framer-motion.ts`

```typescript
// Entrance for individual items (spring, slides up 20px)
item_variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
}

// Container with stagger (wraps item_variants children)
container_variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
}

// Small slide-up (buttons / inline elements)
button_variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
}

// Small slide-down
button_variants_opposite = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
}
```

### Standard Page Pattern
```tsx
<motion.div
  className="grid md:grid-cols-3 gap-4"
  variants={container_variants}
  initial="hidden"
  animate="visible"
>
  <motion.div className="md:col-span-2" variants={item_variants}>
    {/* form card */}
  </motion.div>
  <motion.div className="md:col-span-1" variants={item_variants}>
    {/* history card */}
  </motion.div>
</motion.div>
```

### AnimatePresence (button text swap)
Used in `AnimatedButton` — text slides out upward, loading text slides in from below:
- Transition: `duration: 0.2`, `y: ±20`

### Special Animations

| Component | Effect |
|---|---|
| `currencyRain.tsx` | 25 currency symbols falling, randomised speed (10–30s) / rotation / blur |
| `successModal.tsx` | Success modal pop-in |
| `tradingChart.tsx` | Animated SVG chart for hero sections |
| `mt5AccCard.tsx` | Hover glow gradient cycling (3s loop, linear, 45°) |

---

## Component Library

### shadcn/ui (57 components — `src/components/ui/`)

All locally owned — edit directly, no re-running shadcn CLI needed.

**Layout**: `card`, `separator`, `resizable`, `scroll-area`, `sidebar`, `sheet`
**Forms**: `button`, `input`, `select`, `checkbox`, `radio-group`, `switch`, `textarea`, `form`, `label`, `input-otp`, `calendar`, `slider`
**Overlay**: `dialog`, `alert-dialog`, `drawer`, `modal`, `popover`, `tooltip`, `hover-card`, `dropdown-menu`
**Navigation**: `breadcrumb`, `navigation-menu`, `tabs`, `pagination`
**Feedback**: `sonner`, `alert`, `badge`, `progress`, `skeleton`
**Data**: `table`, `chart`, `accordion`

### Badge Variants (`badge.tsx`)
```
default | secondary | destructive | outline | success | warning | info
```

### HeroUI (`@heroui/react v2.8.5`)

| Component | Usage |
|---|---|
| `Button` | Primary action buttons in forms and transfer pages |
| `Spinner` | Loading state inside cards / modals |

Configured via `heroui()` plugin in `tailwind.config.js`.

---

## Key Shared Components

### `AnimatedButton` — `src/components/global/animatedButton/`

Primary CTA button with loading animation and haptic feedback.

```tsx
<AnimatedButton
  text="Transfer"
  isLoading={isPending}
  disabled={disabled}
  size="md"           // "sm" | "md" | "lg"
  type="submit"
  className="w-min"
  onClick={() => {}}
  icon={<FaArrowRight />}       // optional start icon
  loadingText="Processing"      // optional, default "Loading"
/>
```

- Built on HeroUI `Button`
- `AnimatePresence` swaps text ↔ loading text (`y: ±20`, `duration: 0.2`)
- Triggers `web-haptics` `defaultPatterns.success` on click
- Style: `rounded-2xl`, `font-semibold`, white text on primary green

---

### `Modal` — `src/components/ui/modal.tsx`

Responsive modal: **Dialog on desktop, Drawer (bottom-sheet) on mobile.**

```tsx
<Modal
  title="Transfer Info of #123"
  description="Details of the transfer"
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  height={20}         // optional: drawer height in vh
>
  {/* children */}
</Modal>
```

Internally uses `useIsMobile()` to switch between `<Dialog>` and `<Drawer>`.

---

### `FormGeneratorV2` — `src/components/global/form-generator/v2/`

Single polymorphic component for all form field types. Always used inside a `<FormField>` render prop.

```tsx
<FormGeneratorV2
  inputType="input"         // "input" | "select" | "selectv2" | "textarea"
                            // "checkbox" | "date" | "switch" | "upload"
  type="number"             // HTML input type (for inputType="input")
  label="Amount (USD)"
  placeholder="Enter amount"
  Icon={FaDollarSign}       // left icon
  field={field}             // from react-hook-form render prop
  errors={errors}
  max={maxAmount}
  indicatorText={`max: $${maxAmount}`}  // hint shown in input
  disabled={false}
  activeDefault={false}     // auto-select first option (selectv2/select)
  isFetching={false}        // loading shimmer on selectv2
  className={{
    input: "w-full bg-muted-foreground/10 dark:bg-muted dark:border-muted-foreground/10 border-muted-foreground/20",
    main: "w-full",
  }}
/>
```

**`selectv2`** options shape:
```ts
{
  id: string;
  label: string;
  value: string;
  iconImage?: string;    // left icon image URL
  amount?: number;       // shown as secondary value
  badgeLabel?: string;   // right badge (e.g. "live", "demo", "Available")
  disabled?: boolean;
}
```

**Responsive behaviour of `selectv2`**:
- Desktop → `Popover` + `Command` (searchable)
- Mobile → `Drawer` (bottom sheet)

---

### `TooltipReuse` — `src/components/ui/tooltipReuse.tsx`

Thin wrapper for `<Tooltip>`.

```tsx
<TooltipReuse content="Copy to clipboard">
  <Button size="icon"><FaCopy /></Button>
</TooltipReuse>
```

---

## Form System

### Standard Hook + Form Pattern

```tsx
// Hook (src/hooks/useMyFeature.ts)
const { form, onFormSubmit, errors, isPending } = useMyFeature();

// Component (src/components/forms/myFeatureForm.tsx)
return (
  <Form {...form}>
    <form onSubmit={onFormSubmit}>
      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormGeneratorV2
            inputType="input"
            type="number"
            label="Amount"
            Icon={FaDollarSign}
            field={field}
            errors={errors}
            placeholder="Enter amount"
            className={{ input: "w-full bg-muted-foreground/10 ...", main: "w-full" }}
          />
        )}
      />
      <div className="mt-6 flex justify-end">
        <AnimatedButton
          size="md"
          type="submit"
          className="w-min"
          isLoading={isPending}
          text="Submit"
        />
      </div>
    </form>
  </Form>
);
```

### Hook Internals
Each form hook:
1. Uses `useZodFormV2(schema, onSubmit, defaultValues)` — typed wrapper around react-hook-form + zod
2. Uses `useMutationData(queryKey, mutationFn, invalidateKey, onSuccess)` — mutation + cache invalidation
3. Returns `{ form, onFormSubmit, errors, isPending, ... feature-specific state }`

### Schema location
```
src/schema/
├── funds/
│   ├── deposite.schema.ts
│   ├── transfer.schema.ts
│   ├── mt5ToWallet.ts
│   └── mt5ToMt5Schema.ts
├── mt5/
│   ├── mt5.schema.ts
│   └── levrage.schema.ts
└── auth/
    └── ...
```

---

## Layout & Navigation

### Auth Layout (`/auth/layout.tsx`)
```
┌──────────────────────┬────────────────────────┐
│   Logo + Auth Form   │   Decorative Background │
│   (always visible)   │   (hidden on mobile)    │
└──────────────────────┴────────────────────────┘
```
- Left: scrollable, white/dark, contains logo + form
- Right: `gridAnim` animated grid, hidden below `md`

### Dashboard Layout (`/root/layout.tsx`)
```
┌─────────────────────────────────────────┐
│  DashProvider (React Query + session)   │
│  DashboardWall (auth guard)             │
│  ┌──────────┬──────────────────────┐   │
│  │ Sidebar  │  <main>              │   │
│  │ (green)  │  Suspense wrapped    │   │
│  └──────────┴──────────────────────┘   │
└─────────────────────────────────────────┘
```
- Sidebar: `bg-sidebar` = brand green; collapsible (Sheet on mobile)
- Navigation items defined in `src/constants/navItems.ts`

### Standard Page Grid
```tsx
<motion.div
  className="grid md:grid-cols-3 gap-4"
  variants={container_variants}
  initial="hidden"
  animate="visible"
>
  <motion.div className="md:col-span-2" variants={item_variants}>
    {/* Form card (2/3 width) */}
  </motion.div>
  <motion.div className="md:col-span-1 min-h-[75vh] max-h-[75vh] overflow-hidden" variants={item_variants}>
    {/* History card (1/3 width, fixed height + scroll) */}
  </motion.div>
</motion.div>
```

### Standard Card Structure
```tsx
<Card className="h-full w-full">
  <CardHeader className="flex flex-row border-b border-foreground/10 border-dashed justify-between items-center">
    <CardTitle>Section Title</CardTitle>
    {/* optional action button */}
  </CardHeader>
  <CardContent className="flex flex-col gap-4 md:p-4 p-3 h-full">
    {/* content */}
  </CardContent>
</Card>
```

### History Card Pattern (reused across funds, MT5, transfers)
```tsx
// Loading
{isLoading && Array.from({ length: 10 }).map((_, i) => (
  <Skeleton key={i} className="h-10 bg-foreground/5 w-full" />
))}

// Empty
{data.length === 0 && !isLoading && (
  <div className="flex flex-col h-3/4 justify-center items-center gap-2">
    <img src="/svgs/nothing.svg" className="h-56 grayscale opacity-50" />
    <p className="text-foreground/50 text-sm">No history found</p>
  </div>
)}

// Rows
{data.map(item => (
  <div key={item.id} className="flex flex-col bg-foreground/5 rounded-lg md:p-4 py-4 px-1 w-full gap-2">
    {/* row content */}
  </div>
))}
```

---

## Responsive Patterns

| Pattern | Mobile (`< md`) | Desktop (`≥ md`) |
|---|---|---|
| Modal | `Drawer` bottom sheet | `Dialog` centered |
| `selectv2` dropdown | `Drawer` | `Popover` + `Command` search |
| Page layout | Single column | 2–3 column grid |
| Sidebar | Hidden, Sheet trigger | Persistent |
| Card padding | `p-3` | `md:p-4` or `md:p-6` |
| CTA button | `w-full` | `w-min` |
| MT5 card details | Compact (`py-3`) | Full (`md:py-5`) |
| Reset Password button | Icon only | Text "Reset Password" |

### Detecting Mobile
```ts
import { useIsMobile } from "@/hooks/use-mobile";
const isMobile = useIsMobile(); // true if viewport < 768px
```

---

## Key Constants

### `src/constants/mt5.const.ts`
```ts
CENT_MULTIPLIER = 100   // 1 USD = 100 cents in MT5 cent accounts
```

Used to:
- Convert cent account MT5 balance for display: `balance / CENT_MULTIPLIER`
- Convert user-entered USD to cents for deposit: `amount * CENT_MULTIPLIER`

### `src/constants/curency.ts`
```ts
statusBadge = {
  completed: "success",
  pending: "warning",
  rejected: "destructive",
  failed: "destructive",
  approved: "success",
  // ...
}
```
Used with `<Badge variant={statusBadge[item.status]} />` across all history tables.

Also exports: `currencies`, `USDCurrencies`, `fromCurrencies` — option arrays for selects.

### `src/constants/framer-motion.ts`
Exports: `item_variants`, `container_variants`, `button_variants`, `button_variants_opposite`

### `src/constants/navItems.ts`
Sidebar navigation items and routes.

---

## Folder Structure

```
frontend/src/
├── app/                         Next.js App Router
│   ├── globals.css              CSS vars, base styles, dark mode, grid animations
│   ├── layout.tsx               Root layout (fonts, providers)
│   ├── auth/                    Login, register, forgot-password pages
│   └── root/                    Protected dashboard pages
│       ├── dashboard/
│       ├── funds/               Deposit, transfers (wallet↔MT5, MT5↔MT5)
│       ├── mt5/                 MT5 account management
│       ├── transactions/        Transaction history
│       └── ...
│
├── components/
│   ├── ui/                      57 shadcn/ui components (locally owned, edit freely)
│   ├── global/                  App-wide shared components
│   │   ├── animatedButton/      AnimatedButton (loading + haptics)
│   │   ├── form-generator/v2/   FormGeneratorV2 (all input types)
│   │   ├── table/               Data table variants
│   │   └── kycVerifyModal/      KYC flow
│   ├── layout/                  Navigation shell
│   │   ├── app-sidebar/
│   │   ├── header/
│   │   └── breadCrumb/
│   ├── page-sections/           Feature page sections (one folder per feature)
│   │   ├── dashboard/
│   │   ├── funds/               Transfer forms, history cards
│   │   ├── mt5/                 Account cards, lists
│   │   └── transactions/
│   ├── forms/                   Form components (one file per feature)
│   ├── animation/               Special Framer Motion effects
│   │   ├── currencyRain.tsx
│   │   ├── successModal.tsx
│   │   └── tradingChart.tsx
│   └── providers/               ReactQuery, Theme, Session providers
│
├── hooks/                       Custom hooks (one per feature/API)
│   ├── useMt5.ts                MT5 account management
│   ├── useMt5ToMt5.ts           MT5→MT5 transfer
│   ├── useMt5ToWallet.ts        MT5→Wallet transfer
│   ├── useTransfer.ts           Wallet→MT5 transfer
│   ├── useDeposit.ts            Wallet deposit (fiat)
│   ├── useWithdraw.ts           Wallet withdrawal
│   ├── use-mobile.ts            Viewport detection
│   └── ...
│
├── api/                         Axios API functions (one file per domain)
├── schema/                      Zod schemas (src/schema/funds/, mt5/, auth/)
├── constants/                   Design tokens and app-level constants
│   ├── framer-motion.ts
│   ├── curency.ts
│   ├── mt5.const.ts
│   └── navItems.ts
├── store/                       Zustand stores (ui, modal, mt5ui)
├── types/                       TypeScript types and API response types
├── lib/                         Utilities (cn helper, etc.)
└── utils/                       Axios instance, formatters, helpers
```

---

## Notifications & Feedback

| Type | Library/Pattern | Usage |
|---|---|---|
| Toast | `sonner` (`toast.success()`, `toast.error()`) | API success/error responses |
| Success modal | `useModalStore` (Zustand) + `successModal.tsx` | Post-action confirmation |
| Loading (skeleton) | `<Skeleton className="h-10 bg-foreground/5 w-full" />` | List loading states |
| Loading (spinner) | HeroUI `<Spinner color="primary" />` | Modal / inline loading |
| Page progress | `nextjs-toploader` | Route navigation bar |
| Haptic feedback | `web-haptics` | Mobile vibration on button clicks |
| Empty state | `/svgs/nothing.svg` + caption | Zero-data history views |


---

## Auth Pages (Miles Capital reference clone)

Every `/auth/*` page renders inside `components/auth/AuthShell.tsx`: dark-first theme wrapper (`.dark` class toggled locally, saved under `localStorage["auth-theme"]`), 80px header (`AuthHeader`: 240×64 logo, sun/moon toggle, GB flag + "EN"; landing page also shows "Create Account" + "Log In"), centered content, 48px footer with the package version (`AuthFooter`).

Primitives in `src/components/auth/`:

| Component | Spec |
|---|---|
| `AuthCard` | 480px max, padding 40px (24px mobile), 1px `--border`, 8px radius, bg = page bg, column gap 16px, optional `after` slot (Back link) |
| `AuthField` | label 15px muted + 8px gap, 56px container `bg-field` 4px radius, 15px text, password eye toggle, error 13px destructive |
| `AuthSelect` | shadcn Select styled to the 56px field, flag support |
| `AuthPhone` | dial-code select (122px) + number input; writes `"+44 123…"` to the form |
| `AuthCheckbox` | 24px box, gold when checked |
| `AuthButton` | gold, black text, 56px (`lg`) / 40px (`md`), 4px radius, disabled = 30% text opacity, `href` renders a Link |
| `PasswordRules` | 5-rule bullet list, turns `text-positive` when met |
| `AuthText` | `AuthTitle` (22px/500), `AuthSubtitle` (14px muted), `AuthFooterLine` ("Don't have an account? Sign up") |
| `BackLink` | "← Back" 15px muted, shown under the card |
| `FeatureCarousel` | 420px landing carousel, 280px artwork + title + caption, arrows at 35%, dots, 5s autoplay (framer-motion) |
| `InlineSvg` | fetches `/public/miles/slide-N.svg` and inlines it so the artwork's `var(--text-main)` etc. follow the theme |

Assets: `public/miles/logo-dark.svg`, `logo-light.svg`, `logo-short.svg`, `slide-0..3.svg` (copied from the reference site).


## App Shell (Miles Capital reference clone, phase 2A)

- **Sidebar** (`components/layout/app-sidebar`): 272px (`SIDEBAR_WIDTH = 17rem` in `ui/sidebar.tsx`), same bg as the page (`--sidebar` = `--background`), no right border. Logo 240×64 in an 80px header. Rows are 48px, padding 12px 24px 12px 32px, 16px icon + 16px gap, 15px text. Inactive = `text-muted-foreground`, active = `text-foreground` + 3px gold bar on the left edge (`ActiveBar`). Group rows expand inline; sub-rows are indented to 64px. Footer: hairline divider, "Leave feedback", "Collapse/Expand". Collapsed mode shows the short logo and icon-only rows with tooltips; groups become right-side dropdowns. Nav items come from `constants/navItems.ts` (`badge: "New"` renders a red 10px chip).
- **Header** (`components/layout/header`): 80px, padding 0 40px, no border. Left: page title 24px/500 from `constants/pageTitles.ts` (`getPageTitle`); dashboard shows "Welcome, {first name}". Right: theme toggle (32px icon button), GB flag + "EN", bell with red "9+" pill, helpdesk notes icon, then the avatar.
- **Avatar / account menu** (`components/layout/user-nav`): 42px circle, `bg-field`, 1px gold border, initials. Menu is 288px, page-bg fill, 1px border, 4px radius: email header, Profile Info, Verification "Level: n/1", Security, divider, Logout. Mobile uses a bottom drawer with the same rows.
- **Page container** (`providers/page-container.tsx`): scroll area `calc(100dvh - 80px)`, padding 24px 40px (16px on mobile).

### Shared primitives added in 2A
| Component | File | Spec |
|---|---|---|
| `PillTabs` | `ui/pill-tabs.tsx` | 32px pills, 32px radius, active = gold border + `bg-primary/10` + white text |
| `StatusDot` | `ui/status-dot.tsx` | 8px dot (warning / positive / destructive by status) + label |
| `TagChip` | `ui/tag-chip.tsx` | 10px field-navy chip; `tone="positive"` for Live, `tone="light"` for the 15px "MT5" chip |

### Dashboard (`app/root/dashboard`)
Verification banner (`verification-badge.tsx`: 1px border, ring progress, gold "Verify Now" 40px, hidden when approved) → two-column grid 1.5fr/1fr: `Portfolio.tsx` (pills All/Trading Accounts/Wallet, dashed "Balance", 32px amount + currency, gold Deposit, full-width navy Transfer) and `lastTransactions.tsx` (icon with direction arrow, label + date, amount colored by direction, `StatusDot`, "All" link) → `TradingAccounts.tsx` (352×178 `bg-card` cards in a horizontal scroller with arrows, "+ Create New"). Section headings are h3 18px/500. `DashCards`, `totalBalence` and the chart components are no longer used on this page.


## Phase 2B — primitives and inner pages

Shared primitives now carry the reference look everywhere:

| Primitive | Reference spec |
|---|---|
| `ui/input.tsx` | 56px, `bg-field`, 4px radius, 15px text, gold border on focus |
| `ui/select.tsx` | trigger = same 56px field, white chevron; content `bg-card`, 1px border, 4px radius; items 15px, `bg-field` on focus |
| `ui/button.tsx` | 4px radius; `default` gold/black (hover `primary-hover`), `outline`/`secondary` field-navy/white, `ghost` grey text, `link` gold text; sizes 40px / 56px (`lg`) / 32px (`sm`) |
| `global/animatedButton` | HeroUI button restyled to the same gold 4px button |
| `ui/card.tsx` | `bg-card`, 4px radius, 16px padding, title 18px/500 |
| `ui/tabs.tsx` | underline tabs: 48px, 15px, grey inactive, white + 2px gold underline active, hairline under the list |
| `ui/table.tsx` | 48px header with 12px grey labels, 61px rows, hairline dividers, no hover fill |
| `ui/badge.tsx` | 10px chip, 4px radius; `default` grey on field, `warning`/`success`/`destructive` tinted text on 20% tints, `gold` |
| `ui/label.tsx` / `ui/form.tsx` | labels 15px grey, error 13px `--destructive` |
| `global/data-table/*` | 48px search + Columns picker, reference header/rows, footer with 40px page buttons + "Rows N" |
| `global/date-picker` | 48px field-style trigger |

Page-level:
- **Wallets** (`app/root/wallets`): "Estimated Total" + 32px amount with eye toggle; toolbar (184px search, 212px sort select, layout toggle); pills All / Favorites / Fiat / Crypto + "Hide zero balances"; two-column `WalletCard` (icon, name, Fiat/Crypto + #id chips, 18px balance, Base Value / On Hold). Favorites persist in `localStorage["wallet-favorites"]`.
- **MT5** (`app/root/mt5`, `page-sections/mt5`): "+ Add Account" / "Last Updated" row, pills All / Live / Demo, 248px search, sort select, two-column `Mt5AccCard` (icon, login + copy, Live/Demo + leverage + #login chips, 18px balance, Equity line, navy Deposit). Settings icon opens the details modal (rows with copy / reset / leverage edit, Deposit + Trade actions). Empty state `mt5ConnectComp`.
- **Funds** (`page-sections/funds`): `fundsLayout` = underline `FundTabs` (Deposit / Withdraw / Transfer / MT5 to Wallet / Internal Transfer) then content; form cards are transparent with an 18px h3 title and a grey "Note!" line; histories render through `HistoryList` (heading + gold "See More", rows of icon + direction badge, label + method • date, signed amount + `StatusDot`, info button opens the existing modal).
- **Transactions** (`app/root/transactions`): underline tabs All / Deposits / Withdrawals / Transfer / MT5 to Wallet / Internal Transfer (All is default); lists use the restyled server-side `DataTable`; status cells use `StatusDot`.


## Phase 2C — Profile, Verification, Helpdesk, IB Room, Feedback, Notifications

- **Profile Info** (`page-sections/profile/profileDetailedCard.tsx`): two-column grid (content / 288px). Sections "Profile info", "Account", "Other", "Sign out" with an 18px title on a 48px hairline row; rows are a 200px grey 12px label + 15px white value, 40px tall, hairline below; ID/email have a copy icon. Right column = square `bg-field` block with the user's initials at 64px.
- **Verification** (`app/root/verification/page.tsx`): 56px avatar circle + "Your level" / "N of 1" + 4px gold progress bar + gold "Upgrade" (40px); underline tabs "Level 0 / LEVEL 1" with Current / Completed chips; "Verification Level N" 15px/500 + features table (12px grey headers, green check square / red cross); "KYC Requirements for Level 1:" bullets; "Document Verification" table with `StatusDot` and a gold "View" link; document modal uses 48px label/value rows. Upgrade page: 18px title + Back link, form only.
- **Helpdesk** (`page-sections/support/*`): underline tabs All / Awaiting support / Awaiting you + gold "+ New Ticket"; tickets are 61px rows (unread dot, subject + #id chip, preview, status chip + relative time, chevron). Thread = bordered panel (`calc(100dvh - 220px)`), 64px header with subject / Ticket #id / status chip, client bubbles gold-on-black, support bubbles field-navy, 4px radius, message form in a hairline footer. Empty state = reference empty block.
- **IB Room** (`app/root/ib-room`, `page-sections/ib/*`): underline tabs Overview / Clients / Commissions / Transactions (only when approved); apply / pending states are reference empty blocks; `planBadge` = "Plan" label + 56px field box with the plan name and approval date; `IbBalance` = "Wallet" card (icon, USD, 24px balance, Total Rewards / Total Balance / On Hold / Withdrawn, navy Transfer); `totalClientCount` = two stats in a card; `refralLinkSection` = "Partner Link" card with 48px copy fields; `sumeryCard` = icon square + 12px label + 18px value.
- **Feedback** (`page-sections/feedback/index.tsx`): 480px bordered dialog on the page background, "How was your experience?" 18px, emoji rating kept, comment textarea in the field style, gold submit.
- **Notifications** (`page-sections/notifications/notificationContainer.tsx`): underline tabs New (red count pill) / Read / All + gold "Mark all as read"; rows = unread dot, title, grey body, date, group chip, hairline dividers.


## Icons (reference sprite)

All UI icons are drawn from the reference portal's icon sprite. `public/miles/icons.svg` is a trimmed copy (89 symbols) of `images-collection.flexdns.tech/.../icons-sprite-4.8.0.svg`; add more symbols there when needed (ids are `icon-reg--ui-icon--<name>-16`). Use `components/ui/icon.tsx`: `<Icon name="dashboard-16" size={16} className="text-muted-foreground" />` — it fills with `currentColor`. Sidebar mapping lives in `NAV_ICON` inside `layout/app-sidebar/index.tsx` (dashboard, wallet, mt5, finance, history-backward, support, partnership); header uses sun/moon, notification, document; select chevron = `dropdown-16`; checkbox tick = `check-16`; empty states = `no-data-16`; favorites = `favorite-outline-16` / `favorite-filled-16`. Lucide is only kept for the loading spinner.

Buttons follow the reference interaction: `cursor: pointer` on every enabled button (global rule), `not-allowed` when disabled; primary hover = `brightness(1.1)` + 1px gold inset outline over 150ms; navy (secondary) hover = 1px `primary/40` outline; disabled primary keeps the gold fill with 30% black text, exactly like the reference's disabled "Log In" / "Continue".
