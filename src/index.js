import express, { json } from 'express';
import { connect } from 'mongoose';
import { schedule } from 'node-cron';
import { mongodb, fetchInterval, rssSources, port } from './config/config.js';
import RSSService from './services/rssService.js';

const app = express();
app.use(json());

// Connect to MongoDB
connect(mongodb.uri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    family: 4
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/articles', async (req, res) => {
  try {
    const { keywords, startDate, endDate } = req.query;
    const articles = await RSSService.filterArticles({ keywords, startDate, endDate });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Schedule RSS feed fetching
schedule(fetchInterval, async () => {
  console.log('Fetching RSS feeds...');
  try {
    await RSSService.fetchAndProcessFeeds(rssSources);
    console.log('RSS feeds fetched and processed successfully');
  } catch (error) {
    console.error('Error in scheduled RSS fetch:', error);
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
