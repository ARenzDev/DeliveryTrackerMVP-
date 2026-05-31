# Real-Time Order & Delivery Tracker

This project is a small functional application (MVP) for managing and tracking "Delivery Orders" in real-time. It uses **NestJS** for the backend, **React Native (Expo)** for the mobile frontend, and **MongoDB** for data persistence.

## Architecture & Technologies
- **Backend:** NestJS, TypeScript, Mongoose (MongoDB), Socket.io (WebSockets).
- **Frontend Mobile:** React Native (Expo), TypeScript, Axios, socket.io-client.
- **Database:** MongoDB
- **Infrastructure:** Docker, Docker Compose

## Quick Start (Local Development)

### 1. Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- Expo Go app on your phone or iOS/Android Simulator

### 2. Running with Docker Compose
To run the Backend API, MongoDB, and Redis simultaneously:
```bash
docker-compose up -d
```
The Backend API will be available at `http://localhost:3000`.

### 3. Starting the Mobile App
Open a new terminal and navigate to the `mobile` directory:
```bash
cd mobile
npm install
npx expo start
```
Scan the QR code with Expo Go (Android) or the Camera app (iOS) to launch the app on your physical device, or press `i` / `a` to open in a simulator.

> **Note:** If running on a physical device, make sure the `API_URL` in `mobile/src/services/api.ts` and `socket.ts` points to your machine's local IP address instead of `localhost`.

### 4. Running Tests
**Backend E2E Tests:**
```bash
cd backend
npm run test:e2e
```

**Mobile UI Integration Tests:**
```bash
cd mobile
npm test
```

## Scaling & CI/CD Strategy (DevOps)

### CI/CD Pipeline
A robust CI/CD pipeline (using GitHub Actions or GitLab CI) for this project would look like this:
1. **Linting & Type Checking:** Run ESLint and TypeScript compilation.
2. **Testing:** Run unit and E2E tests (`npm run test:e2e` for backend, `npm test` for mobile).
3. **Build:** Build the Docker image for the backend (`docker build -t orders-api .`).
4. **Publish:** Push the image to a container registry (e.g., AWS ECR or Docker Hub).
5. **Deploy:** Trigger a deployment to a staging environment (e.g., AWS ECS or EKS).

### Scaling in the Cloud (AWS / GCP)
If the application needs to handle a massive volume of real-time events, the current architecture can be scaled as follows:
- **Stateless Backend:** The NestJS API can be horizontally scaled behind a Load Balancer. Since WebSockets are stateful, we must configure sticky sessions or, preferably, use **Redis** as a Pub/Sub adapter for Socket.io. This ensures that an event emitted by instance A is received by connected clients on instance B.
- **Kafka for Heavy Messaging:** Instead of direct REST calls for critical operations, we can introduce **Apache Kafka**. When an order is created, it is published to a Kafka topic. A consumer microservice then processes it, saves it to MongoDB, and triggers the WebSocket notification. This decouples ingestion from processing, allowing the system to absorb massive traffic spikes without dropping orders.
- **Microservices Communication:** If the system is split into multiple microservices (e.g., `OrdersService`, `NotificationsService`, `UsersService`), we would use **gRPC** for low-latency, strongly-typed internal communication instead of HTTP REST.

