import Parser from 'rss-parser';
import Article from '../models/article.js';
import topicExtractor from './topicExtractor.js';
const parser = new Parser();

class RSSService {
  async fetchAndProcessFeeds(feeds) {
    try {
      for (const feedUrl of feeds) {
        try {
          const feed = await parser.parseURL(feedUrl);
          
          for (const item of feed.items) {
            try {
              const existingArticle = await Article.findOne({ title: item.title });
              
              if (!existingArticle) {
                const textContent = item.content || item.description || '';
                
                const topics = await topicExtractor.extractTopics(textContent);
                const entities = await topicExtractor.extractEntities(textContent);
                
                const article = new Article({
                  title: item.title || 'Untitled',
                  description: item.description || '',
                  content: item.content || '',
                  publishedDate: item.pubDate ? new Date(item.pubDate) : new Date(),
                  sourceUrl: item.link || '',
                  source: feed.title || feedUrl,
                  topics,
                  entities
                });
                
                await article.save();
                console.log(`Saved article: ${article.title}`);
              }
            } catch (itemError) {
              console.error(`Error processing feed item from ${feedUrl}:`, itemError);
              continue;
            }
          }
        } catch (feedError) {
          console.error(`Error processing feed ${feedUrl}:`, feedError);
          continue;
        }
      }
    } catch (error) {
      console.error('Error fetching RSS feeds:', error);
      throw error;
    }
  }

  async filterArticles({ keywords, startDate, endDate }) {
    try {
      const query = {};
      
      if (keywords) {
        query.$text = { $search: keywords };
      }
      
      if (startDate || endDate) {
        query.publishedDate = {};
        if (startDate) query.publishedDate.$gte = new Date(startDate);
        if (endDate) query.publishedDate.$lte = new Date(endDate);
      }
      
      return await Article.find(query)
        .sort({ publishedDate: -1 })
        .limit(100);
    } catch (error) {
      console.error('Error filtering articles:', error);
      throw error;
    }
  }
}

export default new RSSService();