# Hotely - Hotel Admin Dashboard

Hotely is a React + TypeScript single-page application for hotel operations. It provides a multi-section admin dashboard with booking workflows, room and housekeeping management, guest check-in/out, billing, and reporting views.

**Highlights**
- Dashboard overview with KPIs and activity summaries.
- Booking flows: reservations list, new booking form, and room availability.
- Room operations: management, housekeeping board, and inventory tracking.
- Guest operations: check-in/out and guest management.
- Finance: billing system and reporting.

**Tech Stack**
- React 18 + TypeScript
- Vite
- React Router
- Tailwind CSS
- Emotion (styling utility)
- Lucide icons

**Routes**
- `/dashboard` - Overview
- `/booking/reservations` - Reservation list
- `/booking/new` - New booking form
- `/rooms/availability` - Room availability
- `/rooms/management` - Room management
- `/rooms/housekeeping` - Housekeeping
- `/rooms/inventory` - Inventory
- `/guests/check-in-out` - Check-in/out
- `/guests/management` - Guest management
- `/finance/billing` - Billing
- `/finance/reports` - Reports

Redirects are configured for legacy paths (see `src/App.tsx`).

**Getting Started**
1. Install dependencies:
   - `npm install`
2. Start the dev server:
   - `npm run dev`
3. Open the app at the Vite URL shown in the terminal.

**Scripts**
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Lint the codebase

**Project Structure**
- `src/App.tsx` - Route definitions
- `src/index.tsx` - App entry point
- `src/index.css` - Tailwind imports
- `src/components/` - Feature modules and layout
  - `layout/` - `DashboardLayout`, `Header`, `Sidebar`
  - `dashboard/` - Overview
  - `booking/` - Booking and availability
  - `rooms/` - Room management and inventory
  - `housekeeping/` - Housekeeping
  - `guests/` - Guest operations
  - `billing/` - Billing
  - `reports/` - Reporting

**Notes**
- This project is frontend-only. It uses mock/static data inside components.
- Tailwind CSS is required for styling; do not remove the imports in `src/index.css`.

