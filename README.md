# EventSpot

A full-stack event ticketing and management platform built with Spring Boot and React.  
This project was developed as part of the Coding Factory program at OPA and demonstrates a complete event lifecycle, from creation and approval to ticket sales, QR code validation, reviews, and analytics.

---

## What It Does

EventSpot is designed for three types of users:

**Regular Users** can browse events, filter by city, category, date and price, purchase tickets (when payments are enabled), view their orders, and leave reviews after attending events.

**Event Organizers** can create and manage events, define multiple ticket types with custom pricing, add venues using interactive maps, track ticket sales in real time, and view analytics dashboards.

**Administrators** oversee the entire platform: approving or rejecting events, managing users and roles, processing refunds, and monitoring platform-wide statistics.

The platform focuses on the Greek market, with realistic venues, euro pricing, and sample data representing real Greek locations and events.

---

## Key Features

### For Everyone
- Browse events without an account
- Advanced search and filters (city, category, date, price)
- Detailed event pages with interactive maps
- Organizer profiles and event ratings

### For Users
- Secure ticket purchasing via Stripe (when enabled)
- Order history and ticket management
- Reviews for attended events

### For Organizers
- Event creation with multiple ticket types
- Venue management with map-based location picker
- Real-time sales and revenue tracking
- Analytics dashboards (sales trends, capacity usage)
- Event editing and cancellation management

### For Admins
- Event approval and moderation workflow
- User and role management
- Order management and refund processing
- Platform-wide analytics and oversight

---

## Tech Stack

### Backend
- Java 17 with Spring Boot 3.x
- Spring Security with JWT authentication
- Spring Data JPA & Hibernate
- MySQL 8
- Stripe API (optional)
- Spring Mail / JavaMail (optional)
- Swagger / OpenAPI documentation

### Frontend
- React 18+ with TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts (analytics)
- Leaflet (OpenStreetMap)

### External Services
- Stripe (payments – optional)
- Stripe CLI (webhooks in local development)
- Nominatim API (geocoding)
- Gmail SMTP (optional)
- Unsplash (event images)

---

## Getting Started

### Prerequisites
- Java JDK 17+
- Maven 3.6+
- MySQL 8+
- Node.js 18+

> Stripe CLI is required **only if you want to enable payments locally**.

### Quick Setup

For full step-by-step instructions, see:
- [GETTING_STARTED.md](GETTING_STARTED.md)

---

## Optional Integrations (Stripe & Email)

This project is designed to run **even without external services configured**.

Both **Stripe payments** and **Email notifications** are optional and controlled via environment variables.

### Email (Optional)

If email configuration is **not provided**:

- The application starts normally
- Users will **not receive email notifications**
- Features affected:
  - No QR codes sent by email
  - No order confirmation emails
  - No review reminder emails

All email-related logic is safely disabled when mail credentials are missing.

### Stripe (Optional)

If Stripe credentials are **not provided**:

- The application starts normally
- Users **cannot proceed with new purchases**
- Users **can still view existing orders** that were preloaded via `data.sql`
- Event browsing, filtering, dashboards, and reviews remain fully functional

This allows the project to be explored and evaluated **without creating a Stripe account**.


---

## Test Accounts

The application includes pre-loaded sample data:

- **Admin:** admin1@eventspot.com / password123
- **Organizer:** organizer1@eventspot.com / password123
- **User:** george.p@eventspot.com / password123

For Stripe testing (if enabled), use:
- **4242 4242 4242 4242** (any future expiry, any CVC)

---

## Sample Data

The platform automatically loads realistic sample data from `data.sql`:

| Resource | Count | Details |
|--------|-------|--------|
| Events | 100 | Past and upcoming events |
| Venues | 30 | Real Greek locations |
| Users | 50 | Users, organizers, admins |
| Categories | 10 | Concerts, sports, conferences, festivals |
| Orders | 150 | Completed orders |
| Reviews | 93 | Reviews for past events |

---

## Project Structure

The project follows a clear separation between backend (Spring Boot) and frontend (React), with a feature-oriented package structure.

### Backend (`backend/eventticketingplatform`)

```
backend/eventticketingplatform/
├── .mvn/wrapper/
├── mvnw
├── mvnw.cmd
├── pom.xml
└── src/
    ├── main/
    │   ├── java/com/nipapager/eventticketingplatform/
    │   │   ├── category/
    │   │   ├── config/
    │   │   ├── enums/
    │   │   ├── event/
    │   │   ├── exception/
    │   │   ├── notification/
    │   │   ├── order/
    │   │   ├── payment/
    │   │   ├── qrcode/service/
    │   │   ├── response/
    │   │   ├── review/
    │   │   ├── role/
    │   │   ├── security/
    │   │   ├── user/
    │   │   ├── venue/
    │   │   └── EventTicketingPlatformApplication.java
    │   └── resources/
    │       ├── application.properties
    │       └── data.sql
    └── test/
```

### Frontend (`frontend/event-ticketing-app`)

```
frontend/event-ticketing-app/
├── public/
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── types/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## API Overview

### Public Endpoints
- `GET /api/events`
- `GET /api/events/{id}`
- `GET /api/categories`
- `GET /api/venues`
- `POST /api/auth/register`
- `POST /api/auth/login`

### User Endpoints
- `GET /api/orders/my-orders`
- `POST /api/payments/create-checkout`

### Organizer Endpoints
- `POST /api/events`
- `PUT /api/events/{id}`
- `GET /api/events/my-events`
- `POST /api/venues`

### Admin Endpoints
- `PUT /api/events/{id}/approve`
- `PUT /api/events/{id}/reject`
- `GET /api/admin/users`
- `POST /api/admin/orders/{id}/refund`

Swagger UI available at:  
`http://localhost:8080/swagger-ui.html`

---

## Payments (Local Development)

Stripe payments are **optional**.

If Stripe credentials are configured, the full payment flow is enabled.  
If not, payment-related endpoints are disabled and the application runs in read-only mode for orders.

When Stripe **is enabled**, payments work locally only if the Stripe CLI is running.

Typical flow:
1. `stripe login`
2. `stripe listen --forward-to localhost:8080/api/payments/webhook`
3. Copy webhook secret into your environment variables

---

## User Guide

Detailed information about:

- Each page of the application
- User flows and navigation
- Role-based capabilities (User, Organizer, Admin)
- What actions are available per user type

can be found in:

➡️ **[USER_GUIDE.md](USER_GUIDE.md)**

This guide is recommended for anyone who wants a deeper understanding of how the platform works from a user perspective.

---

## What This Project Demonstrates

- Layered architecture (controller / service / repository)
- Domain-driven entity modeling
- REST API with full CRUD
- JWT authentication & role-based authorization
- React + TypeScript frontend
- Optional payment & email integrations
- Interactive maps and analytics dashboards
- Admin approval workflow

---

## Contact

- **Email:** nipapager@gmail.com
- **GitHub:** https://github.com/Nipapager/event-ticketing-platform
