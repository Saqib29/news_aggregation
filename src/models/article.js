import { Schema, model } from 'mongoose';

const articleSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  content: String,
  publishedDate: Date,
  sourceUrl: String,
  source: String,
  topics: [String],
  entities: {
    people: [String],
    locations: [String],
    organizations: [String]
  },
  createdAt: { type: Date, default: Date.now }
});

articleSchema.index({ title: 'text', description: 'text' });
export default model('Article', articleSchema);