# Tour Manager — Review & Update Checklist

This file tracks the implementation status for the `update/change` requirements:
MongoDB integration + models, wiring current app features, and a public published-tour page with reviews.

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

