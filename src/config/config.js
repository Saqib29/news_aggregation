require('dotenv').config();

export const mongodb = {
    uri: process.env.MONGODB_URI
};
export const port = process.env.PORT || 3000;
export const rssSources = [
    'http://rss.cnn.com/rss/cnn_topstories.rss',
    'http://feeds.bbci.co.uk/news/rss.xml',
    'http://feeds.reuters.com/reuters/topNews'
];
export const fetchInterval = process.env.RSS_FETCH_INTERVAL;