### Tako Gallery - Design Specification and Implementation Plan

## Overview

The Tako Gallery is a web application that allows users to generate data visualization cards using the Tako Knowledge Search API, save them to a collection, and share these collections publicly. Each collection is associated with a unique Tako API key and a user-chosen username that serves as the URL endpoint for viewing the collection.

## System Architecture

```mermaid
Tako Gallery Architecture.download-icon {
            cursor: pointer;
            transform-origin: center;
        }
        .download-icon .arrow-part {
            transition: transform 0.35s cubic-bezier(0.35, 0.2, 0.14, 0.95);
             transform-origin: center;
        }
        button:has(.download-icon):hover .download-icon .arrow-part, button:has(.download-icon):focus-visible .download-icon .arrow-part {
          transform: translateY(-1.5px);
        }
        #mermaid-diagram-rhd{font-family:var(--font-geist-sans);font-size:12px;fill:#000000;}#mermaid-diagram-rhd .error-icon{fill:#552222;}#mermaid-diagram-rhd .error-text{fill:#552222;stroke:#552222;}#mermaid-diagram-rhd .edge-thickness-normal{stroke-width:1px;}#mermaid-diagram-rhd .edge-thickness-thick{stroke-width:3.5px;}#mermaid-diagram-rhd .edge-pattern-solid{stroke-dasharray:0;}#mermaid-diagram-rhd .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-diagram-rhd .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-diagram-rhd .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-diagram-rhd .marker{fill:#666;stroke:#666;}#mermaid-diagram-rhd .marker.cross{stroke:#666;}#mermaid-diagram-rhd svg{font-family:var(--font-geist-sans);font-size:12px;}#mermaid-diagram-rhd p{margin:0;}#mermaid-diagram-rhd .label{font-family:var(--font-geist-sans);color:#000000;}#mermaid-diagram-rhd .cluster-label text{fill:#333;}#mermaid-diagram-rhd .cluster-label span{color:#333;}#mermaid-diagram-rhd .cluster-label span p{background-color:transparent;}#mermaid-diagram-rhd .label text,#mermaid-diagram-rhd span{fill:#000000;color:#000000;}#mermaid-diagram-rhd .node rect,#mermaid-diagram-rhd .node circle,#mermaid-diagram-rhd .node ellipse,#mermaid-diagram-rhd .node polygon,#mermaid-diagram-rhd .node path{fill:#eee;stroke:#999;stroke-width:1px;}#mermaid-diagram-rhd .rough-node .label text,#mermaid-diagram-rhd .node .label text{text-anchor:middle;}#mermaid-diagram-rhd .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-diagram-rhd .node .label{text-align:center;}#mermaid-diagram-rhd .node.clickable{cursor:pointer;}#mermaid-diagram-rhd .arrowheadPath{fill:#333333;}#mermaid-diagram-rhd .edgePath .path{stroke:#666;stroke-width:2.0px;}#mermaid-diagram-rhd .flowchart-link{stroke:#666;fill:none;}#mermaid-diagram-rhd .edgeLabel{background-color:white;text-align:center;}#mermaid-diagram-rhd .edgeLabel p{background-color:white;}#mermaid-diagram-rhd .edgeLabel rect{opacity:0.5;background-color:white;fill:white;}#mermaid-diagram-rhd .labelBkg{background-color:rgba(255, 255, 255, 0.5);}#mermaid-diagram-rhd .cluster rect{fill:hsl(0, 0%, 98.9215686275%);stroke:#707070;stroke-width:1px;}#mermaid-diagram-rhd .cluster text{fill:#333;}#mermaid-diagram-rhd .cluster span{color:#333;}#mermaid-diagram-rhd div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:var(--font-geist-sans);font-size:12px;background:hsl(-160, 0%, 93.3333333333%);border:1px solid #707070;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-diagram-rhd .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#000000;}#mermaid-diagram-rhd .flowchart-link{stroke:hsl(var(--gray-400));stroke-width:1px;}#mermaid-diagram-rhd .marker,#mermaid-diagram-rhd marker,#mermaid-diagram-rhd marker *{fill:hsl(var(--gray-400))!important;stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rhd .label,#mermaid-diagram-rhd text,#mermaid-diagram-rhd text>tspan{fill:hsl(var(--black))!important;color:hsl(var(--black))!important;}#mermaid-diagram-rhd .background,#mermaid-diagram-rhd rect.relationshipLabelBox{fill:hsl(var(--white))!important;}#mermaid-diagram-rhd .entityBox,#mermaid-diagram-rhd .attributeBoxEven{fill:hsl(var(--gray-150))!important;}#mermaid-diagram-rhd .attributeBoxOdd{fill:hsl(var(--white))!important;}#mermaid-diagram-rhd .label-container,#mermaid-diagram-rhd rect.actor{fill:hsl(var(--white))!important;stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rhd line{stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rhd :root{--mermaid-font-family:var(--font-geist-sans);}Client BrowserNext.js FrontendAPI RoutesTako APIMongoDB AtlasPublic Collection View
```

## Data Model

### MongoDB Collections

1. **Users Collection**

```json
{
  "_id": "ObjectId",
  "apiKeyHash": "String (hashed API key)",
  "username": "String (unique)",
  "createdAt": "Date"
}
```


2. **Cards Collection**

```json
{
  "_id": "ObjectId",
  "apiKeyHash": "String (reference to Users collection)",
  "cardId": "String (Tako card ID)",
  "title": "String",
  "description": "String",
  "webpageUrl": "String",
  "imageUrl": "String",
  "embedUrl": "String",
  "sources": "Array",
  "methodologies": "Array",
  "sourceIndexes": "Array",
  "query": "String (original query text)",
  "createdAt": "Date"
}
```




## Core Functionality

### 1. API Key Management

- Hash API keys before storing in the database
- Associate collections with hashed API keys
- Verify API keys when making requests to Tako API


### 2. Query Processing

- Accept user queries and API keys
- Forward queries to Tako Knowledge Search API
- Process and store responses in MongoDB


### 3. Collection Management

- Create new collections for first-time API key users
- Allow users to choose unique usernames for collections
- Generate public URLs for collections based on usernames


### 4. Card Management

- Display cards in a minimized/gallery view
- Provide expanded view with full details
- Allow deletion of cards with API key verification


## User Interface Components

1. **Search Interface**

1. API key input field
2. Query input field
3. Submit button



2. **Username Selection**

1. Username input field
2. Availability check
3. Confirmation button



3. **Gallery View**

1. Grid of minimized cards
2. Pagination controls
3. Filter/sort options



4. **Card Detail View**

1. Expanded card with Tako visualization
2. Toggle for grounding information
3. Delete option (requires API key)



5. **Collection Management**

1. Collection URL display
2. Copy link button





## API Endpoints

1. **`/api/search`**

1. Method: POST
2. Purpose: Submit a query to Tako API
3. Inputs: API key, query string
4. Returns: Tako card data, collection info



2. **`/api/username`**

1. Method: POST
2. Purpose: Set/update username for an API key
3. Inputs: API key, desired username
4. Returns: Success/failure, collection URL



3. **`/api/cards`**

1. Method: GET
2. Purpose: Retrieve cards for a collection
3. Inputs: Username (from URL)
4. Returns: Array of cards



4. **`/api/cards/:id`**

1. Method: DELETE
2. Purpose: Delete a specific card
3. Inputs: Card ID, API key
4. Returns: Success/failure





## Pages

1. **Home Page (`/`)**

1. Search interface
2. Brief explanation of the service
3. Examples of collections



2. **Collection Page (`/:username`)**

1. Gallery view of all cards for a username
2. Collection information
3. Search within collection



3. **Card Detail Page (`/:username/:cardId`)**

1. Expanded view of a specific card
2. Grounding information
3. Related cards





## Implementation Plan

### Phase 1: Setup and Basic Infrastructure

1. **Project Initialization**

1. Create Next.js project
2. Set up MongoDB connection
3. Configure Vercel deployment



2. **Database Setup**

1. Create MongoDB collections
2. Set up indexes for efficient queries
3. Implement database connection utilities



3. **API Integration**

1. Create Tako API client
2. Implement API key hashing functionality
3. Test API connectivity





### Phase 2: Core Functionality

1. **Search Implementation**

1. Create search form component
2. Implement API endpoint for Tako queries
3. Store search results in database



2. **User Management**

1. Implement username selection flow
2. Create API endpoint for username management
3. Associate API keys with usernames



3. **Card Storage**

1. Implement card saving functionality
2. Create card retrieval endpoints
3. Implement card deletion with API key verification





### Phase 3: UI Development

1. **Gallery View**

1. Create responsive card grid
2. Implement minimized card component
3. Add pagination and filtering



2. **Card Detail View**

1. Create expandable card component
2. Implement iframe embedding for Tako cards
3. Add grounding information toggle



3. **Collection Management**

1. Create collection page
2. Implement shareable URLs
3. Add collection metadata display





### Phase 4: Refinement and Deployment

1. **Error Handling**

1. Implement comprehensive error handling
2. Add user-friendly error messages
3. Create fallbacks for API failures



2. **Performance Optimization**

1. Implement caching strategies
2. Optimize database queries
3. Add loading states



3. **Deployment**

1. Configure Vercel environment variables
2. Set up MongoDB Atlas connection
3. Deploy and test the application





## Security Considerations

1. **API Key Protection**

1. Never store raw API keys
2. Use secure hashing algorithm (bcrypt)
3. Implement rate limiting for API endpoints



2. **Data Validation**

1. Validate all user inputs
2. Sanitize data before storage
3. Implement request size limits



3. **Error Handling**

1. Avoid exposing sensitive information in errors
2. Log errors securely
3. Implement graceful failure modes





## Technical Stack

1. **Frontend**

1. Next.js (App Router)
2. React
3. Tailwind CSS for styling



2. **Backend**

1. Next.js API Routes
2. MongoDB Atlas for database
3. Mongoose for ODM



3. **Infrastructure**

1. Vercel for hosting
2. MongoDB Atlas for database hosting



4. **Utilities**

1. bcrypt for API key hashing
2. axios for API requests
3. react-query for data fetching





## Implementation Details

### API Key Handling

```javascript
// Pseudocode for API key handling
import bcrypt from 'bcrypt';

// Hash API key before storing
async function hashApiKey(apiKey) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(apiKey, salt);
}

// Compare provided API key with stored hash
async function verifyApiKey(providedKey, storedHash) {
  return bcrypt.compare(providedKey, storedHash);
}
```

### Tako API Integration

```javascript
// Pseudocode for Tako API integration
import axios from 'axios';

async function searchTako(apiKey, query) {
  try {
    const response = await axios.post(
      'https://trytako.com/api/v1/knowledge_search',
      {
        inputs: { text: query },
        source_indexes: ["tako"]
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    // Handle errors appropriately
    console.error('Error querying Tako API:', error);
    throw error;
  }
}
```

### Database Operations

```javascript
// Pseudocode for database operations
import mongoose from 'mongoose';

// Save a new card
async function saveCard(apiKeyHash, cardData, query) {
  const card = new Card({
    apiKeyHash,
    cardId: cardData.card_id,
    title: cardData.title,
    description: cardData.description,
    webpageUrl: cardData.webpage_url,
    imageUrl: cardData.image_url,
    embedUrl: cardData.embed_url,
    sources: cardData.sources,
    methodologies: cardData.methodologies,
    sourceIndexes: cardData.source_indexes,
    query,
    createdAt: new Date()
  });
  
  return card.save();
}

// Get cards for a collection
async function getCardsByUsername(username) {
  const user = await User.findOne({ username });
  if (!user) return null;
  
  return Card.find({ apiKeyHash: user.apiKeyHash }).sort({ createdAt: -1 });
}
```

## Conclusion

This design specification and implementation plan provides a comprehensive roadmap for building the Tako Gallery application. The application will allow users to generate and save Tako visualization cards, organize them into collections, and share these collections publicly.

The plan minimizes complexity by leveraging existing services (Tako API, MongoDB Atlas, Vercel) and focusing on the core functionality of query processing, card storage, and collection management. The stateless nature of the application, combined with the use of API key hashing for minimal authentication, ensures a secure yet simple user experience.