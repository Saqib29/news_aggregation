import Parser from 'rss-parser';
import Article, { findOne, find } from '../models/Article';
import { extractTopics, extractEntities } from './topicExtractor';
const parser = new Parser();

class RSSService {
  async fetchAndProcessFeeds(feeds) {
    try {
      for (const feedUrl of feeds) {
        const feed = await parser.parseURL(feedUrl);
        
        for (const item of feed.items) {
          const existingArticle = await findOne({ title: item.title });
          
          if (!existingArticle) {
            const topics = await extractTopics(item.content || item.description);
            const entities = await extractEntities(item.content || item.description);
            
            const article = new Article({
              title: item.title,
              description: item.description,
              content: item.content,
              publishedDate: item.pubDate,
              sourceUrl: item.link,
              source: feed.title,
              topics,
              entities
            });
            
            await article.save();
          }
        }
      }
    } catch (error) {
      console.error('Error fetching RSS feeds:', error);
      throw error;
    }
  }

  async filterArticles({ keywords, startDate, endDate }) {
    const query = {};
    
    if (keywords) {
      query.$text = { $search: keywords };
    }
    
    if (startDate || endDate) {
      query.publishedDate = {};
      if (startDate) query.publishedDate.$gte = new Date(startDate);
      if (endDate) query.publishedDate.$lte = new Date(endDate);
    }
    
    return find(query).sort({ publishedDate: -1 });
  }
}

export default new RSSService();