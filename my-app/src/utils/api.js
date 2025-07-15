import logger from './logger';

class UrlShortenerAPI {
  constructor() {
    this.urlMap = new Map();
    this.statsMap = new Map();
  }

  async shortenUrl(longUrl, validityMinutes = 30, customShortcode = '') {
    logger.info('Attempting to shorten URL', { longUrl, validityMinutes, customShortcode });
    
    // Validate URL
    if (!this.isValidUrl(longUrl)) {
      const error = 'Invalid URL format';
      logger.error(error, { longUrl });
      throw new Error(error);
    }

    // Generate or validate shortcode
    let shortcode = customShortcode;
    if (!shortcode) {
      shortcode = this.generateShortcode();
    } else if (!this.isValidShortcode(shortcode)) {
      const error = 'Invalid shortcode format';
      logger.error(error, { shortcode });
      throw new Error(error);
    } else if (this.urlMap.has(shortcode)) {
      const error = 'Shortcode already exists';
      logger.error(error, { shortcode });
      throw new Error(error);
    }

    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + validityMinutes);

    const urlData = {
      longUrl,
      shortcode,
      createdAt: new Date(),
      expiry,
      clicks: 0,
      clickData: []
    };

    this.urlMap.set(shortcode, urlData);
    this.statsMap.set(shortcode, []);

    logger.info('URL shortened successfully', { shortcode, urlData });
    return {
      shortUrl: `http://localhost:3000/${shortcode}`,
      ...urlData
    };
  }

  async getUrlStats(shortcode) {
    logger.info('Fetching URL stats', { shortcode });
    
    if (!this.urlMap.has(shortcode)) {
      const error = 'Shortcode not found';
      logger.error(error, { shortcode });
      throw new Error(error);
    }

    const urlData = this.urlMap.get(shortcode);
    const stats = this.statsMap.get(shortcode) || [];

    return {
      ...urlData,
      clickData: stats
    };
  }

  async getAllUrls() {
    logger.info('Fetching all URLs');
    return Array.from(this.urlMap.values());
  }

  async redirect(shortcode, source = 'direct') {
    logger.info('Processing redirect', { shortcode, source });
    
    if (!this.urlMap.has(shortcode)) {
      const error = 'Shortcode not found';
      logger.error(error, { shortcode });
      throw new Error(error);
    }

    const urlData = this.urlMap.get(shortcode);
    
    // Check if URL is expired
    if (new Date() > urlData.expiry) {
      const error = 'URL has expired';
      logger.error(error, { shortcode, expiry: urlData.expiry });
      throw new Error(error);
    }

    // Update stats
    urlData.clicks += 1;
    const clickInfo = {
      timestamp: new Date(),
      source,
      location: this.getMockLocation()
    };
    
    this.statsMap.get(shortcode).push(clickInfo);
    logger.info('Redirect processed', { shortcode, clickInfo });

    return urlData.longUrl;
  }

  // Helper methods
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  isValidShortcode(shortcode) {
    return /^[a-zA-Z0-9_-]{4,20}$/.test(shortcode);
  }

  generateShortcode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  getMockLocation() {
    const locations = ['United States', 'India', 'United Kingdom', 'Germany', 'Canada', 'Australia'];
    return locations[Math.floor(Math.random() * locations.length)];
  }
}

const api = new UrlShortenerAPI();
export default api;