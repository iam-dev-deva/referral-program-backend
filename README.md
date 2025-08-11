````markdown
# Referral Program Backend

---

## Setup Instructions

### Prerequisites
- Node.js (v19+ recommended)
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository and navigate to the backend folder:
   ```bash
   git clone https://github.com/iam-dev-deva/referral-program-backend.git
   cd referral-program-backend
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the backend root with the following variables:

   ```
   PORT=5000
   MONGO_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret_key>
   NODE_ENV=development
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   The API server will start at `http://localhost:5000`.

5. API documentation is available at:

   ```
   http://localhost:5000/api-docs
   ```

---

## Known Issues / Limitations

* **CORS Configuration:**
  Backend CORS is currently configured for specific frontend origins (`http://localhost:5173` and `https://referral-program2.netlify.app`). Add additional origins as needed.

* **JWT Token Storage:**
  JWT tokens are stored in HttpOnly cookies for enhanced security, which means the frontend cannot access tokens directly.

* **Referral Reward Threshold:**
  Users can redeem rewards only if they have at least 50 referral points.

* **Email Verification:**
  The registration process does not include email verification, allowing potential fake or invalid email signups.

* **Role-Based Access Control:**
  The API does not currently support differentiated roles (e.g., admin vs user).

* **Logging:**
  Basic logging implemented using Winston.

---