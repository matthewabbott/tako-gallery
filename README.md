# Tako Gallery

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://tako-gallery-ten.vercel.app/)

Tako Gallery is a web application that allows users to generate data visualization cards using the Tako Knowledge Search API, save them to a collection, and share these collections publicly. Collections are associated with the Tako API key used to generate the data visualizations within. When a user creates a collection, they get to choose a username, which also serves as the URL endpoint for viewing the collection.

## Live Demo

The project is deployed and accessible at [https://tako-gallery-ten.vercel.app/](https://tako-gallery-ten.vercel.app/)

Powered by [Vercel](https://vercel.com).

## Features

- **Data Visualization Generation**: Create data visualizations using natural language queries through the Tako Knowledge Search API
- **Collection Management**: Save visualizations to your personal collection with your Tako API key
- **Custom Usernames**: Choose a unique username for your collection URL
- **Card Management**: View, search, and delete cards in your collection
- **Responsive Design**: Fully responsive interface that works on desktop and (should) work on mobile devices as well

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- MongoDB database (local or Atlas)
- Tako API key (get one at [trytako.com](https://trytako.com))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/matthewabbott/tako-gallery.git
   cd tako-gallery
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Generating a Visualization

1. On the home page, enter your Tako API key and a natural language query
2. Click "Generate Visualization" to create a data visualization
3. The visualization will be saved to your collection automatically

### Managing Your Collection

1. After generating your first visualization, you'll be taken directly to your collection page
2. If you're a new user, you'll see a prompt to choose a username for your collection
3. Your collection will be available at `/collections/your-username`
4. You can view, search, and delete cards in your collection
5. Share your collection URL with others to showcase your visualizations

### Creating New Cards

1. From your collection page, click the "New Card" button
2. Enter your Tako API key and a natural language query
3. Click "Generate Card" to create a new visualization and add it to your collection

### Updating Your Username

1. From your collection page, click the "Change Username" button
2. Enter your Tako API key and desired new username
3. Click "Update Username" to change your collection URL

## Configuration

### Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `NEXT_PUBLIC_APP_URL`: Public URL of the application (used for generating collection links)

## API Documentation

Tako Gallery provides several API endpoints for interacting with the application (if you felt like engaging with the applet *not* through the webpage proper):

### `/api/search`

- **Method**: POST
- **Purpose**: Submit a query to Tako API
- **Inputs**: API key, query string
- **Returns**: Tako card data, collection info

### `/api/username`

- **Method**: POST
- **Purpose**: Set/update username for an API key
- **Inputs**: API key, desired username
- **Returns**: Success/failure, collection URL

### `/api/cards`

- **Method**: GET
- **Purpose**: Retrieve cards for a collection
- **Inputs**: Username (from URL)
- **Returns**: Array of cards

### `/api/cards/:id`

- **Method**: DELETE
- **Purpose**: Delete a specific card
- **Inputs**: Card ID, API key
- **Returns**: Success/failure

### `/api/collections`

- **Method**: GET
- **Purpose**: Retrieve a list of public collections
- **Returns**: Array of collections with metadata

## Technologies

- **Frontend**:
  - Next.js 14+ (App Router)
  - React
  - TypeScript
  - Tailwind CSS

- **Backend**:
  - Next.js API Routes
  - MongoDB with Mongoose
  - bcrypt for API key hashing

- **APIs**:
  - Tako Knowledge Search API

- **Deployment**:
  - Vercel

- **Development**:
  - Vibe coded with Vercel v0 and Claude Sonnet 3.7

## Security Considerations

- API keys SHA256 hashed before storing in the database
- User inputs are validated and sanitized
- Error handling to avoid exposing sensitive information
## Acknowledgments

- [Tako](https://trytako.com) for providing the Knowledge Search API
- [Next.js](https://nextjs.org) for the React framework
- [Tailwind CSS](https://tailwindcss.com) for the styling
- [MongoDB](https://mongodb.com) for the database
- [Vercel](https://vercel.com) for hosting
