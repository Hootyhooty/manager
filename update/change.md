# Tour Manager — Review & Update Checklist

This file tracks the implementation status for the `update/change` requirements:
MongoDB integration + models, wiring current app features, and a public published-tour page with reviews.

## Review findings (2026-03-24)

### 1) High: creator account can be overwritten by username re-registration
- File: `backend/src/controllers/authController.js`
- Current behavior: `POST /api/auth/register` updates an existing creator by `username` with a new password/email/profile without verifying current ownership.
- Impact: anyone who knows an existing username can reset that creator's password and profile data.
- Suggested fix:
  - For existing usernames, return `409 Username already exists` (no overwrite), OR
  - Require authenticated owner + current password check before allowing profile/password updates.

### 2) High: publish endpoint is effectively unauthenticated
- Files: `backend/src/routes/tourRoutes.js`, `backend/src/controllers/tourController.js`
- Current behavior: `POST /api/tours` accepts `creatorName` from request body and publishes immediately, with no server-side auth/session/token validation.
- Impact: any caller can create published tours and impersonate creators by sending arbitrary `creatorName`.
- Suggested fix:
  - Add auth middleware and derive creator identity from verified token/session (not request body).
  - Reject publish requests from unauthenticated users (`401/403`).

### 3) Medium: creator identity mismatch causes duplicate creator records
- Files: `backend/src/controllers/authController.js`, `frontend/src/context/AuthContext.jsx`, `frontend/src/pages/TourCreate.jsx`, `backend/src/controllers/tourController.js`
- Current behavior:
  - Login response returns only display `name`.
  - Frontend stores only `user.name`.
  - Publish sends `creatorName: user.name`, but backend looks up creator by `username`.
- Impact: a registered user with `username != "firstName surname"` can generate a second creator record during publish.
- Suggested fix:
  - Return both `id/username/name` from login.
  - Store `username` in auth context and publish with a stable `creatorId` or `username`.

### 4) Medium: API error responses leak internal error details
- File: `backend/src/server.js`
- Current behavior: global error handler returns `{ details: err.message }` to clients.
- Impact: internal diagnostics may leak implementation/database details.
- Suggested fix:
  - Return generic error payload in production (e.g. `{ error: 'Server error' }`) and keep detailed logs server-side only.

## Backend status (`backend/`)

### Implemented: project structure + routing/controllers split
The backend now follows the `update/change` structure:
- `backend/src/controllers/`: request logic
- `backend/src/routes/`: API route wiring
- `backend/src/models/`: category-separated Mongoose models
- `backend/src/utils/`: helpers (async handler, date/money/tour mapping)
- `backend/src/data/`: wizard meta options (`meta`)
- `backend/src/scripts/`: folder exists (currently no active scripts)

`backend/src/server.js` is now clean: it mounts route files under `/api` and starts the Mongo connection.

### Implemented: MongoDB + Mongoose models
New model files (category-separated):
- `creator.js`
- `tourItineraryItem.js`
- `tour.js`
- `customer.js`
- `guide.js`
- `booking.js`
- `transaction.js`
- `review.js`

Publish model behavior:
- Tours are stored with `status: 'Draft' | 'Published'` and `publishedAt`.
- The creator presses **Publish** in `TourCreate`, which creates a `Published` tour.

### Implemented: “published tours only”
The main list endpoint filters to published tours:
- `GET /api/tours` returns only tours where `status === 'Published'`.
- `GET /api/dashboard`, `GET /api/bookings`, `GET /api/customers`, and `GET /api/guides`
  also derive data only from published tours.

### Implemented: public tour page data + reviews
New public endpoints:
- `GET /api/tours/:tourId` (only if tour is published)
- `GET /api/tours/:tourId/reviews`
- `POST /api/tours/:tourId/reviews` (rating 1-5, required `author`, creates a `reviews` document)

### API endpoints currently used by the frontend
- `GET /api/health`
- `POST /api/auth/login` (demo creator login by username; validates password only if the creator was registered)
- `POST /api/auth/register` (creator registration)
- `GET /api/meta` (wizard options)
- `GET /api/dashboard`
- `GET /api/tours`
- `POST /api/tours` (publish at the end of `TourCreate`)
- `GET /api/tours/:tourId` (public tour details)
- `GET /api/tours/:tourId/reviews` and `POST /api/tours/:tourId/reviews`
- `GET /api/bookings`
- `GET /api/customers`
- `GET /api/guides`

## Frontend status (`frontend/`)

### Implemented: routes + published tour page
Routing includes a new public page:
- `/tours/:tourId` → `PublicTour`

Publishing behavior:
- `frontend/src/pages/TourCreate.jsx` posts `creatorName` and redirects to `/tours/${id}`.

### Implemented: review section on published tour page
`PublicTour` shows:
- tour details pulled from `GET /api/tours/:tourId`
- reviews list from `GET /api/tours/:tourId/reviews`
- review submission (author, rating, text) via `POST /api/tours/:tourId/reviews`

### Implemented: Creator register popup
Login now includes a “Register new account” popup for creators:
- collects `username`, `password`, `email`, `name`, `surname`, `phoneNumber`
- optional `address` selected using `MapModal` (reverse geocoding)
- closes the popup after successful registration

### UI text cleanup
The previous “example/wireframe placeholder text” was removed from the main pages.
Empty-state messaging now shows real “no data yet” messages instead.

## Gaps / still pending

1. `transactions` collection is modeled, but no endpoints/controllers are wired yet.
   - `Payments` and `Reports` pages remain placeholders.
2. Separate login for non-creators/customers is not implemented yet.
   - For now, the “review author” input is editable and we prefill it from the logged-in creator name (if available).
3. Tour publishing saves the collected form fields, but:
   - “Save draft”, image upload, QR/poster generation are still UI placeholders.
4. No seed data is created by default.
   - With an empty DB, `/api/*` tables will show empty lists until you insert creators/tours/bookings/reviews/customers/guides.
5. Bookings drive traveler counts:
   - If there are no `bookings` documents, the tours table traveler counts will effectively be “0/max” and availability may look “Open”.

## How to run (local)

1. Backend
   - create `backend/.env` (based on `backend/.env.example`)
   - run from `backend/`: `npm install` then `npm start`
2. Frontend
   - run from `frontend/`: `npm install` then `npm run dev`

The frontend proxies `/api/*` to the backend via Vite.

## Questions (to finish the spec)

1. For `transactions`: do you want endpoints like `GET /api/transactions`, `POST /api/transactions`, and/or Stripe webhook wiring next?
2. For “separate login for users (non-creators)”: should the review author be derived from that user account, or still allow free-text author for now?

