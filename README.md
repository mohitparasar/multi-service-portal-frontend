# MSP Frontend — Tailwind + Context API

Production-oriented frontend starter aligned with the Multi-Service Portal backend.

## Provider service integration

The provider dashboard now connects to the provider-service routes through the
API Gateway. It includes profile create/read/update, skills and pricing CRUD
with live service categories, service-address CRUD, multipart document upload
and management, and public provider search.

Start the backend in this order: Eureka Server, Auth Service, User Service,
Provider Service, Booking Service, Notification Service, and API Gateway.

## Main flow

- Public landing page: navbar, hero, services, about and contact.
- Provider search is available only inside the CUSTOMER protected area.
- Registration fields: email, password, confirm password and role (CUSTOMER/PROVIDER).
- Login redirects CUSTOMER, PROVIDER and ADMIN to their own dashboards.
- Customer creates a booking through `POST /api/bookings`.
- Customer dashboard reads `GET /api/bookings/customer`.
- Provider dashboard reads `GET /api/bookings/provider` and can update status.
- API failures render a safe retry panel instead of breaking the page.

## Important backend security change

The current API Gateway whitelist allows `/api/providers/search` publicly. The frontend hides it behind login, but real security must also remove that path from the gateway public whitelist.

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

Windows CMD:

```bat
copy .env.example .env
npm run dev
```

## Gateway

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Expected auth login response

```json
{
  "accessToken": "...",
  "userId": 1,
  "email": "user@example.com",
  "role": "CUSTOMER"
}
```

The refresh-token cookie is sent using Axios `withCredentials: true`.

## Current MSP flow

- Provider discovery at `/providers` is public.
- Login is required only when a visitor chooses **Book now**.
- The selected provider is preserved through login and restored on the booking form.
- Customer bookings are loaded from `/api/bookings/customer`.
- Provider bookings are loaded from `/api/bookings/provider`.
- Dashboard sidebars include **Return to website** and logout navigation.
- API failures show retryable, user-friendly service messages instead of breaking the page.

## Backend expectations

Keep `GET /api/providers/search` public in the API Gateway. Booking, customer, provider, and admin endpoints should remain JWT protected. The frontend calls the gateway configured by `VITE_API_BASE_URL` and sends refresh cookies with `withCredentials: true`.
