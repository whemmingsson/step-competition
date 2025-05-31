# Step Competition

A web application for tracking and competing in step challenges with friends, teams, and colleagues.

![Step Competition Banner](public/resources/desktop.jpg)

## Overview

Step Competition is a modern web application that allows users to record their daily steps, compete with others, view leaderboards, and track their progress over time. Perfect for workplace wellness programs, fitness groups, or friendly challenges among friends.

## Features

- **User Authentication**: Secure login and account management
- **Step Recording**: Log your daily steps with date selection
- **User Profiles**: Customize your display name for leaderboards
- **Competition Management**: Join different step competitions
- **Team Support**: Compete individually or as part of a team
- **Leaderboards**: See who's leading the pack with real-time rankings
- **Step History**: Track your progress with a detailed history view
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **UI Components**: ShadcCN UI (built on Tailwind CSS)
- **Backend**: Supabase (PostgreSQL database with RESTful API)
- **Authentication**: Supabase Auth
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router v6
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js 16+ and npm
- Supabase account (free tier available)

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/step-competition.git
   cd step-competition
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create a .env.local file in the project root:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Database Setup

1. Create a new Supabase project
2. Set up the following tables:
   - `Steps`: For storing step records
   - `Users_Meta`: For storing user display names
   - `Competitions`: For competition data

### Create database types

Run the following script:

```bash
  pnpm run supatypes
```

### Running the Application

In development mode:

```bash
pnpm run dev
```

Building for production:

```bash
pnpm run build
pnpm run preview # to preview the build locally
```

## Authentication

This app uses Supabase Authentication. Users can sign up and log in with email/password or various OAuth providers (if configured). The app maintains session state using React Context.

## API Services

The app includes several service classes for interacting with the backend:

- `StepService`: Recording steps, fetching step history, and leaderboards
- `UserService`: Managing user profiles and display names
- `CompetitionService`: Fetching and managing competitions

## Deployment

The app can be deployed to any static hosting service:

1. Build the app: `pnpm run build`
2. Deploy the contents of the dist folder

Popular hosting options include:

- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

For questions or support, please open an issue on the GitHub repository.
