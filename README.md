# Travel Buddy Client

The frontend application for the Sustainable Travel Planner. A modern React application optimized for performance and user experience, featuring interactive maps, booking flows, and an AI voice assistant.

## 🏗️ Architecture

The client is a Single Page Application (SPA) built with Vite and React. It uses **Zustand** for global state management and **Clerk** for authentication.

```mermaid
graph TD
    User[User] --> UI[React UI Components]

    subgraph "Frontend Layer"
        UI --> Router[React Router]
        Router --> Pages[Pages (Landing, Explore, Booking)]
        Pages --> Store[Zustand Stores]

        Store --> API[Axios / Fetch]
        Pages --> Hooks[Custom Hooks]
    end

    API --> Server[Backend API]
    API --> Maps[Google Maps API]
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)

### Installation

1. **Navigate to the client directory**

   ```bash
   cd client
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the `client` root (or `.env.local`):
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_...
   VITE_API_URL=http://localhost:3000
   VITE_GOOGLE_MAPS_API_KEY=...
   ```

### Running the Client

- **Development Server**:

  ```bash
  npm run dev
  ```

  Runs on `http://localhost:5173` by default.

- **Build for Production**:
  ```bash
  npm run build
  ```

## 🛠️ Key Features & Workflows

### 1. **User Interface**

- Built with **Tailwind CSS** and **Shadcn/UI** components (`src/components/ui`).
- Responsive design for Mobile and Desktop.

### 2. **State Management (Zustand)**

- **`useAuthStore`**: Manages user session state alongside Clerk.
- **`useTravelStore`**: Manages interaction with travel services and bookings.
- **`useUIStore`**: Manages UI states like modals or sidebars.

### 3. **Pages Overview**

- **`/` (Landing)**: Hero section and feature highlights.
- **`/explore`**: Search and filter travel services.
- **`/travel-ai`**: Interface for the AI Voice Travel Assistant.
- **`/admin`**: Dashboard for platform administrators.
- **`/booking/*`**: Dynamic route for booking specific services.

### 4. **AI Integration**

- The Voice Agent component (`VoiceVisualizer.jsx`) connects to the backend to stream audio/interaction data.

## 📂 Project Structure

```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Shadcn primitive components
│   ├── pages/               # Full page views (Routed)
│   ├── store/               # Zustand state logic
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utils (cn, formatters)
│   ├── App.jsx              # Main App Routing
│   └── main.jsx             # Entry point
├── public/                  # Static assets
└── vite.config.js           # Vite configuration
```

## 👩‍💻 Developer Notes

- **Adding Components**: Use `npx shadcn-ui@latest add [component]` if you need new UI primitives.
- **Styling**: Use Tailwind utility classes. Avoid custom CSS files unless necessary (`index.css` is for global base styles).
- **connection**: Ensure `VITE_API_URL` matches your running backend port.
