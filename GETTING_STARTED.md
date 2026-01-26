# Getting Started with EventSpot

This guide walks you through setting up **EventSpot** locally. It follows the actual project structure and reflects the real backend/frontend setup used in development.

---

## What You Need

Make sure you have the following installed:

- Java JDK 17+
- Maven 3.6+
- MySQL 8.0+
- Node.js 18+ with npm
- Git (recommended)
- Stripe CLI (required for local payment testing)

Quick check:
```bash
java -version
mvn -version
mysql --version
node -v
npm -v
```

---

## Getting the Code

Clone the repository:
```bash
git clone https://github.com/Nipapager/event-ticketing-platform.git
cd event-ticketing-platform
```

Or download the ZIP and extract it locally.

---

## Database Setup (MySQL)

Open MySQL:
```bash
mysql -u root -p
```

Create the database:
```sql
CREATE DATABASE eventticketingdb;
EXIT;
```

The application will automatically create all tables on first run using Hibernate.

---

## Environment Configuration (.env)

Navigate to the backend directory:
```bash
cd backend/eventticketingplatform
```

Create a `.env` file:

```properties
# Database
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

# JWT authentication (REQUIRED)
JWT_SECRET=your-very-long-and-secure-jwt-secret-key-minimum-256-bits

# Stripe (OPTIONAL)
# If not provided, users will NOT be able to create new purchases
# Existing orders from data.sql will still be visible
STRIPE_API_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email (OPTIONAL)
# If not provided, no emails will be sent (registration, orders, approvals)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password
```

### Important Notes
- **JWT_SECRET is mandatory** for the application to run
- **Stripe configuration is optional**
  - Without Stripe, users can only view existing orders loaded from `data.sql`
  - New purchases and checkout are disabled
- **Email configuration is optional**
  - Without email credentials, the application works normally
  - Users simply won't receive notification emails

---

## Installing Dependencies

The backend uses **spring-dotenv**, so `.env` is loaded automatically.

### Backend
```bash
cd backend/eventticketingplatform
mvn clean install -DskipTests
```

> Tests are skipped because they require a running database.

### Frontend
```bash
cd ../../frontend/event-ticketing-app
npm install
```

---

## Running the Application

You need **three terminals open at the same time**.

---

### Terminal 1: Backend
```bash
cd backend/eventticketingplatform
mvn spring-boot:run
```

Backend runs at:
**http://localhost:8080**

---

### Terminal 2: Stripe CLI (Required to make payments - You can skip this, if you don't want to try payments)

Without the Stripe CLI, all payments will stay in "pending" status forever on localhost. Here's why: Stripe can't send webhooks directly to your computer, so the CLI acts as a bridge.

**First time setup:**

Download the Stripe CLI:

**Windows:**
- Go to https://github.com/stripe/stripe-cli/releases/latest
- Download the file `stripe_X.X.X_windows_x86_64.zip`
- Extract it to a folder like `C:\stripe`
- Open Command Prompt in that folder

**Mac:**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux:**
```bash
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_X.X.X_linux_x86_64.tar.gz
tar -xvf stripe_X.X.X_linux_x86_64.tar.gz
```

**Login to Stripe (do this once):**
```bash
stripe login
```

This opens your browser to authorize the CLI. Press Enter when it asks you to.

**Start the webhook listener (do this every time you run the app):**
```bash
stripe listen --forward-to localhost:8080/api/payments/webhook
```

You'll see something like:
```
> Ready! You are using Stripe API Version [2024-XX-XX]
> Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

Copy that `whsec_xxxxxxxxxxxxx` part and put it in your `.env` file as the `STRIPE_WEBHOOK_SECRET`. If you already have a secret in there from before, you can use either one - just make sure they match.

Keep this terminal running! When you see "Ready!", payments will work properly.

---

### Terminal 3: Frontend
```bash
cd frontend/event-ticketing-app
npm run dev
```

Frontend runs at:
**http://localhost:5173**

---

## Open the Application

Visit:
**http://localhost:5173**

You should see the EventSpot homepage.

---

## Test Accounts

Preloaded accounts:

- **Admin:** admin1@eventspot.com / password123
- **Organizer:** organizer1@eventspot.com / password123
- **User:** george.p@eventspot.com / password123

### Create Your Own Account
1. Click **Register**
2. Fill in your details
3. Submit the form
4. Check your email for the welcome message
5. Log in manually

---

## Testing Payments

Make sure the **Stripe CLI is running**.

Test card:
- Card: `4242 4242 4242 4242`
- Expiry: any future date
- CVC: any 3 digits

**Without Stripe CLI:** orders remain `PENDING`  
**With Stripe CLI:** orders complete and QR codes are emailed.

---

## Common Issues

**Backend won't start**
- Check `.env` location and name
- Verify database credentials

**Frontend blank page**
- Ensure backend is running
- Check browser console

**MySQL errors**
- MySQL running?
- Database exists?

**Emails not sent**
- Verify Gmail credentials
- Use App Password for 2FA

**Payments stuck in PENDING**
- Stripe CLI running?
- Webhook secret matches?

---

## Stopping the App

Press `Ctrl+C` in each terminal:
1. Frontend
2. Stripe CLI
3. Backend

---

## Sample Data on First Run

Automatically loaded from `data.sql`:
- 100 events
- 30 venues with real GPS coordinates
- 50 users
- 10 categories
- 150 orders
- 93 reviews