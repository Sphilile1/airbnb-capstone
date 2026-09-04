# Capstone Final Audit Checklist

## Airbnb Frontend
- [x] Airbnb-style top header with red brand/favicons, Where/When/Who search and profile menu
- [x] Functional All / Homes / Experiences / Services navigation
- [x] Hero banner with CTA
- [x] Inspiration cards
- [x] Discover Experiences sections
- [x] Services section
- [x] Shop Airbnb gift-card section
- [x] Functional Future Getaways tabs and destination links
- [x] Four-column footer + copyright/social/language/currency controls
- [x] Location filter and type filters
- [x] Location result cards: image left, details right, rating/reviews/amenities/price
- [x] Details heading/subheading
- [x] One-large + four-small image gallery
- [x] Five distinct seeded images per stay; 15 distinct images across the 3 seeded stays in each destination
- [x] Details left column: accommodation, sleep, amenities, nights, reviews, host, rules/safety/cancellation
- [x] Dynamic date/guest calculator with weekly discount, fees, taxes and total
- [x] Reservation create/view/cancel flow
- [x] Login + registration flow
- [x] Responsive layouts and fallback images

## Admin Frontend
- [x] Header logo, navigation, visible user greeting and profile dropdown
- [x] Logged-out header state
- [x] Login validation/errors/redirect
- [x] Create listing with all required brief fields
- [x] Up-to-five-image upload
- [x] View listing details and dashboard stats
- [x] Update listing with prefilled values
- [x] Delete listing
- [x] Reservations view + cancellation
- [x] JWT session protection
- [x] Routing and SPA redirects
- [x] Responsive styling, loading states, errors and image fallbacks

## Backend
- [x] Controllers / models / routes / middleware structure
- [x] Accommodation full CRUD with validation and host/admin authorization
- [x] User registration/login/me with JWT
- [x] Public registration cannot self-assign admin/host roles
- [x] Reservation create/read/update/delete with validation
- [x] Server-side reservation price calculation
- [x] Authentication + role middleware
- [x] Error/status-code handling
- [x] MongoDB/Mongoose relationships and useful indexes
- [x] Multer image validation/upload
- [x] CORS configuration + baseline security headers
- [x] API documentation in README
- [x] Automated backend data/pricing tests
- [x] Environment templates and Heroku/Netlify deployment configuration

## Final automated verification
- [ ] `npm test`
- [ ] `npm run build:frontend`
- [ ] `npm run build:admin`
- [ ] Backend JS syntax check
- [ ] Visual smoke check of customer Home and admin Login

## Deployment / submission
- [ ] Replace demo secrets/passwords
- [ ] Set production environment variables
- [ ] Deploy backend to Heroku
- [ ] Deploy customer frontend
- [ ] Deploy admin frontend
- [ ] Test deployed flow end-to-end
- [ ] Push final project to GitHub
- [ ] Record demonstration video
- [ ] Submit all links
