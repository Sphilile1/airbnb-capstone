# Airbnb Capstone - Final Build

A full-stack Airbnb-style capstone with three applications:

- `frontend` - customer React app
- `admin` - host/admin React dashboard
- `backend` - Node.js, Express, MongoDB/Mongoose and JWT API

## Demo data

The final seed contains **34 destinations and 3 stays per destination (102 seeded stays)**. Each stay has a five-image gallery. Within each destination, the three seeded stays use 15 different gallery image URLs so the secondary photos are not repeated from one apartment to the next.

The Drakensberg scenic image is sourced from a real Drakensberg, South Africa photo on Pexels. Other seed images use remote demo photography from Unsplash/Pexels.

## Local setup

Dependencies are already present in the supplied project ZIP. If you ever need to reinstall them:

```bash
npm run install:all
```

The real local `.env` files in your working copy are intentionally separate from the public templates. For a clean setup, copy each `.env.example` to `.env` and fill in the required values.

### Backend environment

`backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

### Frontend environment

`frontend/.env` and `admin/.env`:

```env
VITE_API_URL=http://localhost:5000
```

## Run locally

Open three terminals from the project root:

```bash
npm run dev:backend
npm run dev:frontend
npm run dev:admin
```

- Customer app: `http://localhost:5173`
- Admin app: `http://localhost:5174`
- API: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

## Seed / refresh demo destinations

To **add or refresh the 102 seeded demo stays without deleting custom listings, accounts or reservations**:

```bash
npm run seed:destinations --prefix backend
```

To fully reset demo users, reservations and accommodations:

```bash
npm run seed --prefix backend
```

Demo admin after a full reset:

- Email: `admin@example.com`
- Password: `password123`

Change demo passwords/secrets before a public deployment.

## API overview

### Users
- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/me` - authenticated

### Accommodations
- `GET /api/accommodations`
- `GET /api/accommodations/:id`
- `POST /api/accommodations` - host/admin
- `PUT /api/accommodations/:id` - owner/admin
- `DELETE /api/accommodations/:id` - owner/admin

Filters supported by `GET /api/accommodations`: `location`, `type`, `guests`, `minPrice`, `maxPrice`.

### Reservations
- `POST /api/reservations`
- `GET /api/reservations/user`
- `GET /api/reservations/host` - host/admin
- `PUT /api/reservations/:id`
- `DELETE /api/reservations/:id`

## Validation / build checks

```bash
npm test
npm run build:frontend
npm run build:admin
```

The backend test suite checks gallery uniqueness, the 3-stays-per-destination seed rule and weekly-discount pricing.

## Deployment

### Backend - Heroku

The project root includes a `Procfile` and a root `start` script for Heroku.

Set these Heroku Config Vars:

- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL` - deployed customer frontend URL
- `ADMIN_URL` - deployed admin URL
- optional `SEED_ADMIN_PASSWORD`
- optional `SEED_USER_PASSWORD`

Deploy the **project root** to Heroku. Do not commit `.env` files or real secrets to GitHub.

After production MongoDB is configured, run the safe seed once if you want all demo destinations:

```bash
heroku run npm run seed:destinations --prefix backend
```

### Customer frontend - Netlify

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL=https://YOUR-HEROKU-APP.herokuapp.com`

`frontend/public/_redirects` is included so React routes work when refreshed.

### Admin frontend - Netlify

- Base directory: `admin`
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL=https://YOUR-HEROKU-APP.herokuapp.com`

`admin/public/_redirects` is included for SPA routing.

## Submission

Before submitting:

1. Test customer search -> listing -> calculator -> login -> reserve -> cancel.
2. Test admin login -> create -> update -> delete -> reservations.
3. Test mobile layouts.
4. Confirm both deployed frontends call the Heroku API.
5. Push the final project to GitHub.
6. Record the required demonstration video.
7. Submit the GitHub and deployed links.
