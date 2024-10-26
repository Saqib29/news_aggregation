// import { NlpManager } from 'node-nlp';

import { NlpManager } from "node-nlp";

class TopicExtractor {
  constructor() {
    this.manager = new NlpManager({ languages: ['en'] });
  }

  async extractTopics(text) {
    // Simple keyword extraction based on frequency
    const words = text.toLowerCase().split(/\W+/);
    const frequencies = {};
    
    words.forEach(word => {
      if (word.length > 3) {
        frequencies[word] = (frequencies[word] || 0) + 1;
      }
    });
    
    return Object.entries(frequencies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }

  async extractEntities(text) {
    const result = await this.manager.process('en', text);
    
    return {
      people: result.entities
        .filter(e => e.entity === 'person')
        .map(e => e.utterance),
      locations: result.entities
        .filter(e => e.entity === 'location')
        .map(e => e.utterance),
      organizations: result.entities
        .filter(e => e.entity === 'organization')
        .map(e => e.utterance)
    };
  }
}

export default new TopicExtractor();