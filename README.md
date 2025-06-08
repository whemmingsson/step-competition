# Step Competition

A web application for tracking and competing in step challenges with friends, teams, and colleagues.

## Overview

Step Competition is a modern web application that allows users to record their daily steps, compete with others, view leaderboards, and track their progress over time. Perfect for workplace wellness programs, fitness groups, or friendly challenges among friends.

## Features

- **User Authentication**: Secure login and account management
- **Step Recording**: Log your daily steps with date selection
- **User Profiles**: Customize your display name and upload profile images
- **Profile Images**: Upload and resize images for user profiles
- **Competition Management**: Join different step competitions
- **Team Support**: Create teams or join existing ones to compete as a group
- **Leaderboards**: See who's leading the pack with real-time rankings
- **Step History**: Track your progress with both table and chart views
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Performance Optimization**: Efficient caching mechanism to reduce API calls

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **UI Components**: ShadcCN UI (built on Tailwind CSS)
- **Backend**: Supabase (PostgreSQL database with RESTful API)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage for profile images
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Caching**: Custom cache service for optimized performance

## Prerequisites

- Node.js 16+ and npm/pnpm
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

3. Create a .env file in the project root:

```
VITE_BASE_PATH=/your-base-path/ # Set this if deploying to a subdirectory
VITE_CONTACT_EMAIL=support@example.com
```

4. Create a .env.local file in the project root:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

1. Create a new Supabase project
2. Set up the following tables:
   - `Steps`: For storing step records
   - `Users_Meta`: For storing user display names and profile image URLs
   - `Competitions`: For competition data
   - `Teams`: For team management
   - `Users_Teams`: For team membership

### Storage Setup

1. Create a 'profile-images' bucket in your Supabase storage
2. Configure appropriate permissions:
   - Allow authenticated users to upload files
   - Make the bucket public for reading profile images

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
- `UserService`: Managing user profiles, display names, and profile images
- `TeamService`: Creating, joining, and managing teams
- `CompetitionService`: Fetching and managing competitions
- `CacheService`: Optimizing performance by reducing API calls

## Performance Optimization

The app includes several optimizations:

- **Data Caching**: Reduces API calls by caching frequently accessed data
- **Image Resizing**: Optimizes image uploads by resizing before storage

## Deployment

The app can be deployed to any static hosting service:

1. Build the app: `pnpm run build`
2. Deploy the contents of the dist folder

When deploying to a subdirectory:

1. Set the `VITE_BASE_PATH` environment variable to your subdirectory path
2. Configure your router's basename to match this path

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

For questions or support, please open an issue on the GitHub repository or contact us at the email address in your environment configuration.
