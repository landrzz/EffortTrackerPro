# Mortgage Activity Tracking Dashboard

A comprehensive activity tracking dashboard for loan officers to monitor their prospecting activities, refinance opportunities, and overall progress.

## Features

- **Activity Tracking**: Record and track daily prospecting activities
- **Streak Counter**: Track consecutive days of prospecting activities
- **Refinance Opportunities**: View and filter potential refinance candidates
- **Progress Analytics**: Visualize performance through metrics and charts
- **Calendar Integration**: Monitor activity patterns and maintain consistency

## Key Components

- **Record Activity Modal**: Quickly log prospecting activities without page navigation
- **Streak Tracking**: Monitor and maintain daily prospecting streaks
- **Activity Log**: Detailed history of all logged prospecting activities
- **Refinance Opportunities**: Database of existing clients who could benefit from refinancing
- **Financial Journeys**: Step-by-step guides through financial improvement paths

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 16.8.0 or later
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/Growmortgage/Tracker.git
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn
   ```

3. Run the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js App Router files
│   ├── activity-log/       # Activity log page
│   ├── refi-opportunities/ # Refinance opportunities page
│   ├── journeys/          # Financial journeys page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/             # React components
│   ├── layout/            # Layout components
│   ├── features/          # Feature-specific components
│   └── shared/            # Shared/reusable components
├── context/               # Context providers
└── styles/                # Global styles
    └── globals.css        # Tailwind and global CSS
```

## Customization

You can customize the dashboard by:

1. Modifying the color scheme in `tailwind.config.js`
2. Adding new feature components in the `components/features` directory
3. Extending the layout components for different views
4. Updating the mock data with real data from your backend

## License

MIT

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Lorem Picsum](https://picsum.photos/) for placeholder images # Tracker
