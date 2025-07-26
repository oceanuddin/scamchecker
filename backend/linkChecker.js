const axios = require('axios');
const cheerio = require('cheerio');

class LinkChecker {
  constructor() {
    this.suspiciousDomains = new Set([
      'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'is.gd', 'v.gd', 't.ly',
      'rb.gy', 'cutt.ly', 'shorturl.at', 'tiny.cc', 'short.to', 'ow.ly'
    ]);
  }

  // Extract URLs from text
  extractUrls(text) {
    // Match http(s)://, www., or bare domains (with TLD)
    const urlRegex = /((https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[\w\-\/?#=&%\.]*)?)/g;
    // Remove trailing punctuation from matches
    return (text.match(urlRegex) || []).map(url => url.replace(/[.,!?;:]+$/, ''));
  }

  // Check if URL is suspicious
  isSuspiciousUrl(url) {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();
      
      // Check for URL shorteners
      if (this.suspiciousDomains.has(domain)) {
        return { suspicious: true, reason: 'URL shortener detected' };
      }
      
      // Check for suspicious patterns
      const suspiciousPatterns = [
        /bitcoin/i, /crypto/i, /wallet/i, /verify/i, /secure/i,
        /login/i, /account/i, /bank/i, /paypal/i, /amazon/i,
        /microsoft/i, /apple/i, /google/i, /facebook/i
      ];
      
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(url)) {
          return { suspicious: true, reason: 'Contains suspicious keywords' };
        }
      }
      
      return { suspicious: false, reason: 'No obvious red flags' };
    } catch (error) {
      return { suspicious: true, reason: 'Invalid URL format' };
    }
  }

  // Check if URL is accessible and get basic info
  async checkUrl(url) {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const $ = cheerio.load(response.data);
      const title = $('title').text().trim();
      const description = $('meta[name="description"]').attr('content') || '';
      
      return {
        accessible: true,
        title: title,
        description: description,
        statusCode: response.status
      };
    } catch (error) {
      return {
        accessible: false,
        error: error.message,
        statusCode: error.response?.status || 'unknown'
      };
    }
  }

  // Search Reddit for scam reports
  async searchReddit(query) {
    try {
      // Search Reddit API for scam reports
      const searchUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&restrict_sr=on&sort=relevance&t=all`;
      
      const response = await axios.get(searchUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const posts = response.data.data?.children || [];
      const scamReports = posts
        .filter(post => {
          const title = post.data.title.toLowerCase();
          const subreddit = post.data.subreddit.toLowerCase();
          return title.includes('scam') || title.includes('fake') || 
                 subreddit.includes('scams') || subreddit.includes('phishing');
        })
        .slice(0, 5) // Limit to 5 most relevant
        .map(post => ({
          title: post.data.title,
          url: `https://reddit.com${post.data.permalink}`,
          subreddit: post.data.subreddit,
          score: post.data.score,
          created: new Date(post.data.created_utc * 1000).toISOString()
        }));

      return {
        found: scamReports.length > 0,
        reports: scamReports,
        totalFound: scamReports.length
      };
    } catch (error) {
      console.error('Reddit search error:', error.message);
      return {
        found: false,
        reports: [],
        error: 'Unable to search Reddit at this time'
      };
    }
  }

  // Comprehensive link analysis
  async analyzeLinks(text) {
    const urls = this.extractUrls(text);
    const results = [];

    for (const url of urls) {
      const suspiciousCheck = this.isSuspiciousUrl(url);
      const urlCheck = await this.checkUrl(url);
      
      // Search Reddit for this specific URL or domain
      const domain = new URL(url).hostname;
      const redditResults = await this.searchReddit(`${domain} scam`);
      
      results.push({
        url: url,
        suspicious: suspiciousCheck.suspicious,
        reason: suspiciousCheck.reason,
        accessible: urlCheck.accessible,
        title: urlCheck.title,
        description: urlCheck.description,
        redditReports: redditResults.reports,
        redditFound: redditResults.found
      });
    }

    return {
      totalUrls: urls.length,
      suspiciousUrls: results.filter(r => r.suspicious).length,
      accessibleUrls: results.filter(r => r.accessible).length,
      redditReportsFound: results.reduce((sum, r) => sum + r.redditReports.length, 0),
      details: results
    };
  }
}

module.exports = new LinkChecker(); 