# DevFlow

React + TypeScript project built with Vite, Tailwind CSS, Zustand, and React Query.

## Setup

1. Copy `.env.example` to `.env` and add your [Firebase config](#firebase) values.
2. Enable **Google** sign-in in [Firebase Console](https://console.firebase.google.com) → Authentication → Sign-in method.
3. Run:

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` – Start dev server
- `npm run build` – Build for production
- `npm run preview` – Preview production build
- `npm run lint` – Run ESLint

## Tech Stack

- **Vite** – Build tool
- **React 18** + **TypeScript**
- **Tailwind CSS** – Styling
- **Zustand** – State management (see `src/store/`)
- **TanStack React Query** – Server state & caching (see `src/lib/queryClient.ts`)
- **Firebase** – Auth (Google sign-in); see `src/lib/firebase.ts` and `src/context/AuthContext.tsx`
- **React Router** – Routing; protected routes require sign-in

## Firebase

Create a Firebase project, add a Web app, and set these in `.env` (see `.env.example`):

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Enable **Google** under Authentication → Sign-in method. Only logged-in users can access Dashboard, Projects, Notes, etc.; others are redirected to `/login`.

## Project Structure

```
src/
├── components/        # Shared UI (e.g. ProtectedRoute)
├── context/          # React context (AuthContext)
├── features/         # Feature-based modules
│   ├── auth/         # Login page
│   ├── dashboard/, projects/, notes/, snippets/, analytics/, settings/
│   └── ai/
├── layouts/          # App layout (SidebarLayout)
├── lib/               # Shared utilities & config (firebase, queryClient)
├── store/            # Zustand stores
│   └── appStore.ts
├── App.tsx
├── main.tsx
└── index.css
```

- **Features**: Each feature has an `index.ts` (public API) and its own components.
- **Store**: Use `useAppStore()` and add new stores under `src/store/`.
- **React Query**: App is wrapped in `QueryClientProvider`; use `useQuery` / `useMutation` in components. Shared client in `@/lib/queryClient`.

## Path alias

Use `@/` for `src/`, e.g. `import { queryClient } from '@/lib/queryClient'`.
"# DevFlow" 
