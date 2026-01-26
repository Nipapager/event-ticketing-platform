# EventSpot User Guide

## Purpose
This guide summarizes the **front-end pages**, **role-based access**, and **user capabilities** available in the EventSpot UI.

## Roles & Access Model
EventSpot uses three primary roles that affect navigation and page access:

- **ROLE_USER**: Default attendee role after registration. Users can browse events, purchase tickets, manage their profile, view tickets, and review past events. UI navigation shows attendee-centric features like “My Tickets” and “Past Events.”
- **ROLE_ORGANIZER**: Includes all ROLE_USER capabilities plus event creation and management features such as “My Events,” “Create Event,” and the Organizer Dashboard (analytics).
- **ROLE_ADMIN**: Includes all organizer/user capabilities plus administrative management features (Admin Dashboard, Event Manager, User Manager, Orders Manager). Admin-only pages validate the admin role and redirect non-admin users away.

> **Note:** The router defines all user-facing pages, while many pages also include client-side checks to redirect unauthenticated users or users without the right role.【F:frontend/event-ticketing-app/src/App.tsx†L1-L90】

## Page-by-Page Guide (Routes, Purpose, Access)
Below is every page exposed by the front-end router and what it is used for.

### Public Pages (No Login Required)
- **Home (`/`)**: Landing page with featured “Trending Events,” an about section, and calls to action for registration or organizer requests.
- **Events (`/events`)**: Browse all upcoming events with search, filters (city/category/date/price), and sorting options.
- **Event Details (`/events/:id`)**: View event details, venue map, ticket availability, and organizer info. Users can start booking if the event is upcoming; past events show reviews instead of the booking panel.
- **Login (`/login`)**: Sign-in page for registered users.
- **Register (`/register`)**: New account creation page.
- **Help (`/help`)**: Help and FAQ page covering user, organizer, and admin topics, ticketing, reviews, and support contact details.
- **Request Organizer (`/request-organizer`)**: Explains how to apply for organizer status by emailing the support address and lists required information.

### Authenticated Pages (Any Logged-in User)
- **Checkout (`/checkout`)**: Booking review and payment initiation page. Redirects to login if not authenticated and sends users to Stripe to pay.
- **My Tickets (`/my-tickets`)**: View upcoming/past ticket orders, QR codes, and order details. Requires login.
- **Past Events (`/past-events`)**: Shows past attended events and allows users to submit or update reviews. Requires login.
- **Profile (`/profile`)**: View and edit personal profile information (name, phone, address). Requires login.
- **Payment Success (`/payment-success`)**: Payment confirmation page showing order summary and next steps; uses the Stripe session ID to fetch order details.
- **Payment Cancel (`/payment-cancel`)**: Payment canceled state (used when Stripe checkout is not completed).

### Organizer Pages (ROLE_ORGANIZER + ROLE_ADMIN)
- **My Events (`/my-events`)**: Organizer event list with filtering by status (PENDING/APPROVED/REJECTED/CANCELLED), event edit links, and cancellation workflow. Requires login and organizer/admin privileges via navigation and service checks.
- **Create Event (`/create-event`)**: Organizer event creation wizard with categories, venues, ticket types, image selection, and validation. Submissions create events and ticket types, then mark them as awaiting admin approval.
- **Edit Event (`/edit-event/:id`)**: Edit event details and ticket types; disallows edits for cancelled or past events. Requires login.
- **Organizer Dashboard (`/organizer/dashboard`)**: Analytics for organizer events (tickets sold, revenue, available tickets) plus upcoming/past event breakdowns.

### Admin Pages (ROLE_ADMIN only)
- **Admin Dashboard (`/admin/dashboard`)**: Platform KPIs, charts, and metrics for users, events, orders, revenue, and organizer performance. Redirects non-admin users away.
- **Event Manager (`/admin/event-manager`)**: Approve or reject events, filter by status, and view pending approvals. Redirects non-admin users away.
- **User Manager (`/admin/user-manager`)**: Search/filter users, promote or demote organizers, and delete accounts. Redirects non-admin users away.
- **Order Manager (`/admin/orders`)**: Search/filter orders, review order status, and process refunds. Redirects non-admin users away.

## How Each Role Uses the System

### ROLE_USER (Attendee)
**Primary goals:** Discover events, buy tickets, view tickets, and review past events.

1. **Browse upcoming events**
   - Go to **Events** and use search, filters, and sorting to find an event.
2. **View event details**
   - Open an event page to see event description, venue map, ticket types, and organizer info.
3. **Purchase tickets**
   - On the event page, pick ticket type and quantity, then select **Book Now**. If not logged in, the UI sends you to login and then back to the event page.
   - On **Checkout**, confirm the order and proceed to payment (Stripe).
   - After payment, the **Payment Success** page shows your order summary and next steps.
4. **View tickets and QR codes**
   - Visit **My Tickets** to see upcoming and past orders, plus QR codes for entry (tap to enlarge).
5. **Review past events**
   - Visit **Past Events** to rate or update reviews for events you attended.
6. **Manage your profile**
   - Update name, phone, and address in **Profile**.
   
### ROLE_ORGANIZER
**Primary goals:** Create events, manage them, monitor ticket sales and revenue.

1. **Apply to become an organizer** (if you started as a ROLE_USER)
   - Use **Become an Event Organizer** page to send an application email and required details.
2. **Create a new event**
   - Go to **Create Event** and fill out event details, category, venue, date/time, image, and ticket types.
   - Submit the form to create the event and ticket types; it enters **PENDING** status pending admin approval.
3. **Manage your events**
   - **My Events** lists events with filters (ALL / PENDING / APPROVED / REJECTED / CANCELLED) and shows status badges.
   - Use **Edit Event** for upcoming events and **Cancel** to remove an event from active listings.
4. **Edit or delete ticket types**
   - **Edit Event** allows updating event details, adjusting existing ticket types, or deleting ticket types from the event.
5. **Track performance in the organizer dashboard**
   - **Organizer Dashboard** provides analytics per event (tickets sold, revenue, sell-through %, available tickets) and overall totals.
   
### ROLE_ADMIN
**Primary goals:** Maintain platform health, approve events, manage users, and handle refunds.

1. **Admin Dashboard overview**
   - View platform KPIs (users, organizers, events, orders, revenue, conversion rate), top events, and charts over a selected time period.
2. **Approve or reject events**
   - Open **Event Manager** to review events by status.
   - Use **Approve** or **Reject** actions to change event status.
3. **Manage users and roles**
   - Use **User Manager** to search users, filter by role, and **promote/demote** organizer access.
   - Admins can also delete users from this page.
4. **Handle orders and refunds**
   - Use **Order Manager** to view orders, filter by status/time range, and process refunds (invalidates tickets).

## Key Workflows (Quick Reference)

### How a user buys tickets (ROLE_USER)
1. **Find an event** in **Events** using search/filters/sorting.
2. **Choose ticket type and quantity** in **Event Details**, then click **Book Now**.
3. **Confirm order** in **Checkout** and proceed to payment (Stripe).
4. **See confirmation** in **Payment Success** and then view QR codes in **My Tickets**.

### How an organizer creates and edits events (ROLE_ORGANIZER)
1. **Create** an event in **Create Event**, including ticket types and venue/category selection.
2. **Wait for admin approval** (event remains PENDING until approved).
3. **Edit** upcoming events or ticket types in **Edit Event** (not allowed for cancelled/past events).
4. **Cancel** a future event from **My Events**, removing it from active listings.

### How an admin manages the platform (ROLE_ADMIN)
1. **Review platform KPIs** in **Admin Dashboard** for high-level performance and trends.
2. **Approve/Reject events** in **Event Manager** to control listings.
3. **Promote/Demote users** in **User Manager** to grant or remove organizer access.
4. **Refund orders** in **Order Manager** when necessary.
