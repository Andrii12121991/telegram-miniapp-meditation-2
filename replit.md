# Meditation Breathing App

## Overview

This is a web-based meditation breathing application built with React and TypeScript that helps users practice mindful breathing techniques. The app provides three different breathing patterns (Simple, 4-7-8, and Box breathing) with visual animations and customizable session durations. Users can track their breathing sessions through an intuitive interface with animated breathing circles and guided instructions.

The application features a clean, modern design using Tailwind CSS and shadcn/ui components, with support for both desktop and mobile devices. It includes session management with play/pause functionality, progress tracking, and completion notifications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component patterns
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks for local component state, with custom session state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with CSS custom properties for theming and responsive design
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Server**: Express.js with TypeScript for REST API endpoints
- **Session Management**: Express sessions with PostgreSQL session storage using connect-pg-simple
- **Development**: Hot module replacement and error overlay via Vite integration
- **Production**: Compiled server bundle using esbuild for optimal performance

### Data Storage Solutions
- **Database**: PostgreSQL configured via Neon Database serverless driver
- **ORM**: Drizzle ORM for type-safe database queries and migrations
- **Schema Management**: Centralized schema definition in shared directory with automatic type generation
- **Session Storage**: PostgreSQL-backed session store for user session persistence

### Authentication and Authorization
- **User Schema**: Basic user model with username/password fields and UUID primary keys
- **Storage Interface**: Abstract storage interface allowing for easy testing with in-memory storage
- **Session Management**: Express sessions configured for secure cookie-based authentication

### External Dependencies
- **Database**: Neon Database (PostgreSQL serverless) for data persistence
- **UI Framework**: Radix UI primitives for accessible component foundations
- **State Management**: TanStack React Query for server state management and caching
- **Development Tools**: Replit-specific plugins for development environment integration
- **Animations**: CSS animations for breathing visualizations with customizable timing patterns

The application follows a monorepo structure with shared types and utilities, enabling type safety across the full stack. The meditation functionality is implemented entirely on the frontend with local state management, while the backend provides user management capabilities and session persistence.