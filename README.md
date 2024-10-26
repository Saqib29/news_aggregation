# News Aggregator

A robust news aggregator service that fetches articles from RSS feeds, extracts topics using OpenAI, and provides filtering capabilities.

## Features

- RSS Feed management and automatic fetching
- Article storage with MongoDB
- Topic extraction
- Article filtering by keywords and date
- Scheduled feed processing
- Docker support

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and apply these value to the kyes or create .env file and put the values
```bash
PORT=3000
MONGODB_URI=mongodb://admin:password123@mongodb:27017/news_aggregator?authSource=admin
RSS_FETCH_INTERVAL="*/5 * * * *"
```
3. Run with Docker:
   ```bash
   sudo docker compose up --build
   ```
>>> Data will be visible after a while when first fetch will be completed.

## API Endpoints

Fetch articles with optional filtering:
Query Parameters:

 - `keywords`: Search terms in title and description
 - `startDate`: Filter articles published after this date
 - `endDate`: Filter articles published before this date

##### Example:
```bash
GET /articles?keywords=technology&startDate=2024-01-01&endDate=2024-12-31
```

## Architecture:

- Express.js
- MongoDB for
- Docker for application and db run

### Article Schema:
- title.
- description.
- content.
- url
- publishDate
- source
- topics
- entities: (people, locations, organizations)


### Future Improvements:
1. Create a web interface for viewing articles
2. Implement user authentication and favorites


