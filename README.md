# Stripy Shop

An e-commerce website for Stripy nasal strips, built with Next.js, Tailwind CSS, and Drizzle ORM.

## Features

- Responsive design for all devices
- Multi-language support (English and Serbian)
- Shopping cart with local storage persistence
- Order form with validation
- Promo code system with database tracking
- Admin dashboard for promo code statistics

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:

\`\`\`bash
git clone https://github.com/yourusername/stripy-shop.git
cd stripy-shop
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - React components
- `lib/` - Utility functions, context providers, and database logic
- `public/` - Static assets

## Database

The project uses Drizzle ORM with SQLite for development. In a production environment, you would want to replace this with a more robust database solution.

## Email Integration

The project is set up to integrate with your preferred email provider. You can add your email sending logic in the `sendOrderInquiry` function in `lib/actions.ts`.

## Admin Dashboard

Access the admin dashboard at `/admin`. The default password is `stripy123` (for demonstration purposes only).

## License

This project is licensed under the MIT License.

