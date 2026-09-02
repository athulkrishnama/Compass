# Compass

Compass is a comprehensive travel and accommodation platform built with a robust backend and a modern frontend, offering functionalities for booking hotels, cabs, and managing travel-related services.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)![Vite](https://img.shields.io/badge/Vite-64F5FF?style=for-the-badge&logo=vite&logoColor=64F5FF)![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)![Redis](https://img.shields.io/badge/Redis-DA3C3C?style=for-the-badge&logo=redis&logoColor=white)



## Table of Contents

- [About The Project](#about-the-project-%F0%9F%9A%80)
- [Features](#features-%F0%9F%8C%9F)
- [Tech Stack](#tech-stack-%F0%9F%92%BB)
- [Project Structure](#project-structure-%F0%9F%93%81)
- [Installation](#installation-install)
- [Usage](#usage-%F0%9F%92%A1)
- [Contributing](#contributing-%F0%9F%A4%9D)
- [License](#license-%E2%9A%96%EF%B8%8F)
- [Contact](#contact-%F0%9F%93%9E)



## About The Project

Compass is a full-stack travel booking platform that combines hotel reservations and real-time cab booking into a single application. Customers can search and book hotels, reserve rooms, request nearby cabs, track drivers in real time, and manage their bookings. Hotel owners can manage hotels and rooms, while drivers can receive ride requests and update their live locations.

The cab booking system uses Redis geospatial data to identify nearby drivers and dispatches ride requests sequentially. If a driver rejects a request or does not respond within the configured timeout, BullMQ delayed jobs trigger the next driver-matching attempt. Socket.IO enables real-time driver location, ride-status, and notification updates.

The hotel booking workflow manages temporary room locks during payment and uses MongoDB transactions to maintain consistency when creating bookings and recording payments. The application also includes authentication with JWT access and refresh tokens, role-based authorization, reviews, analytics, and Stripe payment integration with webhooks.

The backend follows Clean Architecture and Dependency Injection, with MongoDB aggregation pipelines, geospatial indexes, pagination, and validation. The application is Dockerized and deployed on AWS EC2 with S3, Nginx, and GitHub Actions-based CI/CD for automated deployment.



## Features

- **User Authentication**: Secure sign-up, login, and password reset functionalities using JWT for token management. Supports Google OAuth for streamlined authentication.
- **Role-Based Access Control**: Different user roles (Traveler, Hotel, Cab, Admin) with distinct permissions and dashboards.
- **Hotel Management**: Allows hotel owners to list properties, manage room variants, update details, and view bookings. Includes features like dynamic pricing based on occupancy and availability checks.
- **Cab Services**: Enables cab owners to manage their vehicles and availability. Integrates with Mapbox for real-time location tracking, route calculation, and fare estimation.
- **Booking System**: Facilitates hotel bookings with features for checking in/out, cancellation policies, and managing reservations.
- **Real-time Updates**: Utilizes Socket.IO for real-time notifications and location updates for cab services.
- **Internationalization (i18n)**: Supports multiple languages for a global user base.
- **Payment Integration**: Integrates with Stripe for secure online payments and manages wallet balances and transactions.
- **Reporting & Analytics**: Provides dashboards for admin, hotel, and cab users with various metrics and downloadable reports (PDF).
- **File Uploads & Storage**: Implements secure file uploads to AWS S3 for profile images, vehicle details, and property photos.
- **Cron Jobs**: For background tasks like cleaning up stale driver locations.
- **Dockerization**: Includes Docker configurations for easy deployment.



## Tech Stack



### Backend

- **Language**: TypeScript
- **Frameworks**: Node.js, Express, Tsyringe (DI Container)
- **Database**: MongoDB (with Mongoose)
- **Cache**: Redis (@redis/client, ioredis)
- **Real-time**: Socket.IO
- **Payment**: Stripe
- **Mapping**: Mapbox
- **File Storage**: AWS S3 (@aws-sdk/client-s3)
- **Queueing**: BullMQ
- **Validation**: Zod
- **Logging**: Pino
- **Authentication**: JWT, bcrypt, Google OAuth



### Frontend
- **Framework**: React
- **Build Tool**: Vite
- **State Management**: Redux Toolkit, Redux Persist
- **Routing**: TanStack Router
- **UI Components**: Radix UI, Lucide React, Tailwind CSS, clsx, tailwind-merge
- **Form Handling**: React Hook Form, Zod Resolver
- **API Calls**: Axios
- **Styling**: Tailwind CSS, CSS Modules
- **Internationalization**: i18next
- **Animations**: GSAP, Framer Motion
- **Notifications**: Sonner
- **PWA**: Vite PWA



## Project Structure

```
compass/
├── backend/
│   ├── dist/
│   ├── logs/
│   ├── src/
│   │   ├── application/
│   │   │   ├── constants/
│   │   │   ├── mappers/
│   │   │   ├── useCases/
│   │   │   └── interfaces/
│   │   ├── config/
│   │   ├── domain/
│   │   │   ├── constants/
│   │   │   ├── enums/
│   │   │   └── types/
│   │   ├── infrastructure/
│   │   │   ├── DI/
│   │   │   ├── repository/
│   │   │   ├── services/
│   │   │   └── worker/
│   │   ├── presentation/
│   │   │   ├── controllers/
│   │   │   ├── cron-service.ts
│   │   │   ├── middlewares/
│   │   │   ├── routes/
│   │   │   ├── utils/
│   │   │   └── validationSchemas/
│   │   ├── locales/
│   │   ├── index.ts
│   │   └── server.ts
│   ├── Dockerfile
│   ├── docker-compose.yaml
│   ├── eslint.config.mjs
│   ├── .env.sample
│   ├── .dockerignore
│   ├── .prettierrc
│   ├── package.json
│   ├── pnpm-workspace.yaml
│   ├── tsconfig.json
│   └── prometheus.yml
├── frontend/
│   ├── public/
│   │   └── logo.png
│   ├── src/
│   │   ├── assets/
│   │   ├── axios/
│   │   ├── components/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── enums/
│   │   ├── hooks/
│   │   ├── index.css
│   │   ├── lib/
│   │   ├── main.tsx
│   │   ├── queryOptions/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── utils/
│   ├── .env.sample
│   ├── .prettierrc.json
│   ├── components.json
│   ├── favicon.ico
│   ├── index.html
│   ├── package.json
│   ├── pnpm-workspace.yaml
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── vercel.json
│   └── vite.config.ts
└── README.md
```



## Installation



### Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm (project uses pnpm)
- MongoDB
- Redis
- AWS Account (for S3 storage)
- Mapbox API Key
- Stripe Account



### Backend Setup

1. **Clone the repository**

   git clone <https://github.com/athulkrishnama/Compass.git>

   cd Compass

2. **Configure environment variables**

   Create a `.env` file inside the `backend` directory using `.env.sample` as a reference:

   cp backend/.env.sample backend/.env

   Configure the following environment variables:

   - `PORT`
   - `MONGODB_URI`
   - `REDIS_URL`
   - `EMAIL`
   - `EMAIL_PASSWORD`
   - `ACCESS_TOKEN_SECRET`
   - `REFRESH_TOKEN_SECRET`
   - `ACCESS_TOKEN_EXPIRATION_TIME`
   - `REFRESH_TOKEN_EXPIRATION_TIME`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `S3_BUCKET_NAME`
   - `S3_ACCESS_KEY`
   - `S3_REGION`
   - `S3_SECRET_ACCESS_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `MAPBOX_ACCESS_TOKEN`
   - `ORIGIN_URL`
   - `SOCKET_UI_ORIGIN`
   - `SOCKET_ADMIN_USERNAME`
   - `SOCKET_ADMIN_PASSWORD`

3. **Start the backend**

   Make sure Docker and Docker Compose are installed, then run:

   docker compose up --build

   To run the services in the background:

   docker compose up --build -d

   Docker Compose will build and start the backend along with the required services.



### Frontend Setup
1. **Navigate to the frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `frontend/` directory based on `.env.sample` and fill in the necessary variables:
   - `VITE_BASEURL`
   - `VITE_GOOGLE_CLIENT_ID`
   - `VITE_MAPBOX_ACCESS_TOKEN`
   - `VITE_STRIPE_PUBLIC_KEY`
   - `VITE_SOCKET_URL`

4. **Start the development server:**
   ```bash
   pnpm dev
   ```

5. **Build for production:**
   ```bash
   pnpm build
   ```



## Usage

Compass provides a multifaceted platform catering to different user roles:



### Traveler

- **Search and Book Hotels**: Browse destinations, filter hotels by price, availability, and amenities, and book rooms.
- **Book Cabs**: Request rides, track driver location in real-time, and get fare estimates.
- **Manage Bookings**: View upcoming, ongoing, and completed bookings for both hotels and cabs.
- **Profile Management**: Update personal details, including profile picture and verification documents.



### Hotel Owner

- **Manage Property**: Add and manage hotel details, room variants, amenities, and policies.
- **View Bookings**: Monitor all bookings, check-ins, and check-outs for their property.
- **Dashboard**: Get insights into hotel performance, occupancy rates, revenue, and recent bookings.
- **Reports**: Generate and download hotel booking reports.



### Cab Owner/Driver

- **Manage Vehicle**: Update vehicle details, registration, and images.
- **Go Online/Offline**: Control availability for ride requests.
- **Accept/Reject Rides**: Respond to incoming ride requests.
- **Real-time Tracking**: View rider location and receive real-time updates during the trip.
- **View Trip History**: Access past trip details and earnings.
- **Dashboard**: Monitor key metrics like total earnings, completed trips, and ratings.
- **Reports**: Generate and download cab trip reports.



### Admin

- **User Management**: View, manage, and approve/reject user verification requests.
- **System Monitoring**: Access dashboards for overall platform statistics, including hotels, cabs, bookings, and revenue.
- **Reports**: Generate comprehensive reports across different services (hotels, cabs).



## How to use

1. **Run the backend server** (as described in Installation).
2. **Run the frontend development server** (as described in Installation).
3. **Access the application** in your browser, typically at `http://localhost:5173`.
4. **Sign up or log in** with your respective role (Traveler, Hotel, Cab).
5. **Explore the features** based on your role:
   - Travelers can search for hotels and book cabs.
   - Hotel owners can manage their listings and bookings.
   - Cab owners can manage their vehicles and accept rides.



## Contact 📞

Project Maintainer - Athul Krishna M A - [athulkrishnama24@gmail.com]

Project Link: <https://github.com/athulkrishnama/Compass>



## Important Links 🔗

- Live Demo - [Compass](https://compass.athulkrishnama.online/)