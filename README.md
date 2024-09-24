

---

# **WeddingWise - Event Management App**

**Frontend**: React.js, Bootstrap, CSS  

**Backend**: Node.js, Express.js, MongoDB  

## **Table of Contents**
- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Known Issues](#known-issues)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

## **Introduction**
**WeddingWise** is an event management platform that allows users to browse and book vendors for their events. Users can manage event and vendor bookings through a cart system, review their selections, and confirm their bookings. The app features a modern UI with user authentication, dynamic cart functionality, and email notifications upon booking confirmation.

## **Features**
- **User Authentication**: Secure user login and registration.
- **Event and Vendor Browsing**: Explore a variety of vendors and events with detailed information and images.
- **Dynamic Cart**: Add vendors and events to the cart for review, editing, and confirmation.
- **Booking Confirmation**: Confirm bookings with automatic email notifications including the booking details.
- **User Account Management**: View, edit, and manage bookings from the user account page.

## **Tech Stack**
- **Frontend**: React.js, Bootstrap, CSS
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Deployment**: Frontend on Netlify, Backend on Render
- **Database**: MongoDB Atlas

## **Installation**

### **Backend Setup**
1. Clone the repository:
   ```bash
   git clone <backend-repo-url>
   ```
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with the following:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/weddingwise
   JWT_SECRET=<your-secret-key>
   ```
5. Start the server:
   ```bash
   npm start
   ```
6. The backend server will be running at `https://weddingwisebooking.onrender.com`.

### **Frontend Setup**
1. Clone the frontend repository:
   ```bash
   git clone <frontend-repo-url>
   ```
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. In the `src` directory, create a `config.js` file and add the following:
   ```javascript
   export const API_BASE_URL = 'https://weddingwisebooking.onrender.com';
   ```
5. Start the development server:
   ```bash
   npm start
   ```
6. The frontend will run at `http://localhost:3000` or it can be deployed via Netlify.

## **API Endpoints**

### **Authentication**
- **POST** `/api/users/register` - Register a new user
- **POST** `/api/users/login` - User login

### **Events**
- **GET** `/api/events` - Get all events
- **GET** `/api/events/:id` - Get a specific event

### **Vendors**
- **GET** `/api/vendors` - Get all vendors
- **GET** `/api/vendors/:id` - Get a specific vendor

### **Bookings**
- **POST** `/api/bookings` - Confirm booking
- **GET** `/api/bookings/:userId` - Get all bookings for a user

## **Project Structure**

### **Frontend**
```bash
src/
├── components/
│   ├── Events.js
│   ├── Vendors.js
│   ├── Cart.js
│   ├── UserAccount.js
│   └── ...
├── pages/
│   ├── EventDetails.js
│   ├── VendorDetails.js
│   └── ...
├── AppContext.js
└── index.js
```

### **Backend**
```bash
backend/
├── controllers/
│   ├── eventController.js
│   ├── vendorController.js
│   ├── bookingController.js
│   └── ...
├── models/
│   ├── Event.js
│   ├── Vendor.js
│   ├── Booking.js
│   └── User.js
├── routes/
│   ├── eventRoutes.js
│   ├── vendorRoutes.js
│   ├── bookingRoutes.js
│   └── userRoutes.js
└── server.js
```


## **Contributing**
If you'd like to contribute, please fork the repository, make your changes, and submit a pull request. Ensure your code follows the project's guidelines for cleanliness and documentation.

## **License**
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

