# User Dashboard

A high-performance React application designed to handle and display large datasets (10,000+ users) with optimal performance. This project features a virtualized data table, advanced filtering and sorting, and a modern, dark-themed UI.

## Features

- **High-Volume Data Handling**: efficiently renders 10,000+ rows using `@tanstack/react-virtual` for windowing/virtualization.
- **Advanced State Management**: Custom `UserContext` with `useReducer` for predictable state updates and side effects.
- **Search & Filtering**: Real-time search by name/email with debouncing and role-based filtering.
- **Sorting**: Multi-column sorting (Name, Status, Role, Age) with visual indicators.
- **Modern Dark UI**: Fully responsive, dark-themed interface built with Tailwind CSS, featuring backdrop blur modals and smooth transitions.
- **Optimistic Updates**: Immediate UI feedback for user actions with automatic rollback on (simulated) API failures.
- **Type Safety**: comprehensive TypeScript definitions for robust development.

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Virtualization**: [@tanstack/react-virtual](https://tanstack.com/virtual/v3)
- **Linting**: ESLint

## Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

3.  **Build for Production**
    ```bash
    npm run build
    ```

## Project Structure

```
src/
├── components/       # UI Components (VirtualTable, UserModal, etc.)
├── context/          # Global State (UserContext)
├── hooks/            # Custom Hooks
├── types/            # TypeScript Interfaces
└── utils/            # Helper functions
```

## Key Components

- **VirtualTable**: The core component that handles the virtualized list rendering.
- **UserModal**: a reusable modal for viewing and editing details with optimistic update logic.
- **FilterBar**: Contains search input and filter dropdowns.
- **UserProvider**: Wraps the application to provide global access to user data and actions.
