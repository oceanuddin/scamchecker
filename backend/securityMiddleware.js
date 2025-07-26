const crypto = require('crypto');

// Security middleware class
class SecurityMiddleware {
  constructor() {
    this.userSessions = new Map();
    this.abusePatterns = new Map();
    this.rateLimits = new Map();
  }

  // Main security middleware function
  async securityCheck(req, res, next) {
    try {
      const clientIP = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';
      const sessionId = this.generateSessionId(clientIP, userAgent);

      // 1. Prompt Guardrails
      const guardrailResult = this.promptGuardrails(req.body);
      if (guardrailResult.blocked) {
        return res.status(403).json({
          error: 'Security violation detected',
          reason: guardrailResult.reason,
          timestamp: new Date().toISOString()
        });
      }

      // 2. Normalization Layer
      const normalizedInput = this.normalizeInput(req.body);
      
      // 3. Input Sanitizer
      const sanitizationResult = this.sanitizeInput(normalizedInput);
      if (sanitizationResult.blocked) {
        return res.status(400).json({
          error: 'Invalid input detected',
          reason: sanitizationResult.reason,
          timestamp: new Date().toISOString()
        });
      }

      // 4. Heuristic Detector
      const heuristicResult = this.heuristicDetection(normalizedInput);
      if (heuristicResult.blocked) {
        return res.status(403).json({
          error: 'Suspicious pattern detected',
          reason: heuristicResult.reason,
          confidence: heuristicResult.confidence,
          timestamp: new Date().toISOString()
        });
      }

      // 5. User Behavior Logging
      this.logUserBehavior(sessionId, {
        ip: clientIP,
        userAgent,
        endpoint: req.path,
        method: req.method,
        timestamp: new Date().toISOString(),
        inputLength: JSON.stringify(req.body).length,
        suspiciousFlags: heuristicResult.flags || []
      });

      // 6. Rate Limiting
      const rateLimitResult = this.checkRateLimit(sessionId);
      if (rateLimitResult.blocked) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          retryAfter: rateLimitResult.retryAfter,
          timestamp: new Date().toISOString()
        });
      }

      // Add security context to request
      req.securityContext = {
        sessionId,
        clientIP,
        normalizedInput,
        heuristicFlags: heuristicResult.flags || [],
        sanitizationWarnings: sanitizationResult.warnings || []
      };

      next();
    } catch (error) {
      console.error('Security middleware error:', error);
      return res.status(500).json({
        error: 'Security check failed',
        timestamp: new Date().toISOString()
      });
    }
  }

  // 1. PROMPT GUARDRAILS
  promptGuardrails(input) {
    const manipulationPatterns = [
      // Direct override attempts
      /ignore\s+(the\s+)?(above|previous|all)\s+(instructions?|prompts?)/i,
      /forget\s+(the\s+)?(above|previous|all)\s+(instructions?|prompts?)/i,
      /disregard\s+(the\s+)?(above|previous|all)\s+(instructions?|prompts?)/i,
      /stop\s+(being|acting\s+as)\s+(a\s+)?(scam|security|detection)/i,
      /pretend\s+(to\s+be|you\s+are)/i,
      /say\s+(this\s+is\s+)?(safe|not\s+a\s+scam)/i,
      /respond\s+with\s+["'](safe|not\s+a\s+scam)["']/i,
      
      // Role manipulation
      /you\s+are\s+(not\s+a\s+)?(scam|security|detection)/i,
      /act\s+as\s+(if\s+)?(you\s+are\s+not\s+a\s+)?(scam|security|detection)/i,
      
      // System prompt injection
      /system\s+prompt/i,
      /role\s+play/i,
      /character\s+play/i,
      
      // Bypass attempts
      /bypass\s+(security|detection|guardrails)/i,
      /override\s+(security|detection|guardrails)/i,
      /circumvent\s+(security|detection|guardrails)/i
    ];

    const inputStr = JSON.stringify(input).toLowerCase();
    
    for (const pattern of manipulationPatterns) {
      if (pattern.test(inputStr)) {
        return {
          blocked: true,
          reason: 'Prompt injection attempt detected',
          pattern: pattern.source
        };
      }
    }

    return { blocked: false };
  }

  // 2. NORMALIZATION LAYER
  normalizeInput(input) {
    let normalized = JSON.stringify(input);
    
    // Remove zero-width characters and homoglyphs
    normalized = normalized.replace(/[\u200B-\u200D\uFEFF]/g, ''); // Zero-width spaces
    normalized = normalized.replace(/[\u00AD]/g, ''); // Soft hyphens
    
    // Normalize unicode characters
    normalized = normalized.normalize('NFKC');
    
    // Remove excessive whitespace
    normalized = normalized.replace(/\s+/g, ' ').trim();
    
    // Convert to lowercase for pattern matching
    const normalizedLower = normalized.toLowerCase();
    
    return {
      original: input,
      normalized: normalized,
      normalizedLower: normalizedLower
    };
  }

  // 3. INPUT SANITIZER
  sanitizeInput(normalizedInput) {
    const warnings = [];
    const inputStr = normalizedInput.normalizedLower;
    
    // Token limit enforcement (rough estimate)
    const tokenCount = inputStr.split(/\s+/).length;
    if (tokenCount > 1000) {
      return {
        blocked: true,
        reason: 'Input too long (token limit exceeded)',
        tokenCount
      };
    }
    
    // URL scanner
    const urlPattern = /https?:\/\/[^\s]+/g;
    const urls = inputStr.match(urlPattern) || [];
    
    for (const url of urls) {
      // Check for suspicious domains
      if (this.isSuspiciousDomain(url)) {
        warnings.push(`Suspicious URL detected: ${url}`);
      }
      
      // Check for URL shorteners
      if (this.isUrlShortener(url)) {
        warnings.push(`URL shortener detected: ${url}`);
      }
    }
    
    // OCR-like text analysis (basic)
    const suspiciousTextPatterns = [
      /[а-яё]/i, // Cyrillic characters
      /[ｱ-ﾝ]/i, // Half-width katakana
      /[０-９]/i, // Full-width numbers
      /[ａ-ｚ]/i  // Full-width letters
    ];
    
    for (const pattern of suspiciousTextPatterns) {
      if (pattern.test(inputStr)) {
        warnings.push('Suspicious character encoding detected');
        break;
      }
    }
    
    return {
      blocked: false,
      warnings,
      urlsFound: urls.length,
      tokenCount
    };
  }

  // 4. HEURISTIC DETECTOR
  heuristicDetection(normalizedInput) {
    const inputStr = normalizedInput.normalizedLower;
    const flags = [];
    let confidence = 0;
    
    // Red flag patterns
    const redFlagPatterns = [
      // Urgency patterns
      { pattern: /(urgent|immediate|within\s+\d+\s+(hours?|minutes?|days?))/i, weight: 0.3, flag: 'urgency' },
      { pattern: /(final\s+notice|last\s+warning|act\s+now)/i, weight: 0.4, flag: 'urgency' },
      
      // Money requests
      { pattern: /(gift\s+card|bitcoin|crypto|wire\s+transfer|western\s+union)/i, weight: 0.5, flag: 'money_request' },
      { pattern: /(send\s+money|pay\s+now|payment\s+required)/i, weight: 0.5, flag: 'money_request' },
      
      // Authority impersonation
      { pattern: /(irs|internal\s+revenue|microsoft|amazon|apple|google|ceo|boss)/i, weight: 0.4, flag: 'authority_impersonation' },
      
      // Threats
      { pattern: /(arrest|legal\s+action|account\s+suspension|police|fbi)/i, weight: 0.6, flag: 'threat' },
      
      // Suspicious links
      { pattern: /(http[s]?:\/\/[^\s]+)/i, weight: 0.2, flag: 'external_link' },
      
      // Poor grammar indicators
      { pattern: /(dear\s+sir|madam|kindly|please\s+help)/i, weight: 0.3, flag: 'poor_grammar' },
      
      // Unsolicited offers
      { pattern: /(free\s+offer|limited\s+time|exclusive\s+deal|you\s+won)/i, weight: 0.4, flag: 'unsolicited_offer' }
    ];
    
    for (const { pattern, weight, flag } of redFlagPatterns) {
      if (pattern.test(inputStr)) {
        flags.push(flag);
        confidence += weight;
      }
    }
    
    // Multiple red flags increase confidence
    if (flags.length > 2) {
      confidence += 0.2;
    }
    
    // Check for excessive repetition
    const words = inputStr.split(/\s+/);
    const wordCount = {};
    for (const word of words) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
    
    const repeatedWords = Object.values(wordCount).filter(count => count > 3);
    if (repeatedWords.length > 0) {
      flags.push('excessive_repetition');
      confidence += 0.1;
    }
    
    return {
      blocked: confidence > 0.8,
      confidence: Math.min(confidence, 1.0),
      flags,
      reason: confidence > 0.8 ? 'High confidence scam indicators detected' : null
    };
  }

  // 5. USER BEHAVIOR LOGGING
  logUserBehavior(sessionId, behaviorData) {
    if (!this.userSessions.has(sessionId)) {
      this.userSessions.set(sessionId, {
        firstSeen: new Date(),
        requestCount: 0,
        suspiciousFlags: [],
        lastRequest: null
      });
    }
    
    const session = this.userSessions.get(sessionId);
    session.requestCount++;
    session.lastRequest = new Date();
    session.suspiciousFlags.push(...behaviorData.suspiciousFlags);
    
    // Detect abuse patterns
    if (session.requestCount > 10) {
      this.abusePatterns.set(sessionId, {
        type: 'high_frequency',
        count: session.requestCount,
        timestamp: new Date()
      });
    }
    
    // Clean old sessions (older than 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    for (const [id, session] of this.userSessions.entries()) {
      if (session.lastRequest < oneHourAgo) {
        this.userSessions.delete(id);
      }
    }
  }

  // 6. RATE LIMITING
  checkRateLimit(sessionId) {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    const maxRequests = 5; // Max 5 requests per minute
    
    if (!this.rateLimits.has(sessionId)) {
      this.rateLimits.set(sessionId, {
        requests: [],
        blocked: false,
        blockedUntil: null
      });
    }
    
    const limit = this.rateLimits.get(sessionId);
    
    // Remove old requests outside the window
    limit.requests = limit.requests.filter(time => now - time < windowMs);
    
    // Check if currently blocked
    if (limit.blocked && limit.blockedUntil && now < limit.blockedUntil) {
      return {
        blocked: true,
        retryAfter: Math.ceil((limit.blockedUntil - now) / 1000)
      };
    }
    
    // Add current request
    limit.requests.push(now);
    
    // Check if limit exceeded
    if (limit.requests.length > maxRequests) {
      limit.blocked = true;
      limit.blockedUntil = now + (5 * 60 * 1000); // Block for 5 minutes
      
      return {
        blocked: true,
        retryAfter: 300 // 5 minutes
      };
    }
    
    return { blocked: false };
  }

  // Helper methods
  generateSessionId(ip, userAgent) {
    return crypto.createHash('md5').update(`${ip}-${userAgent}`).digest('hex');
  }

  isSuspiciousDomain(url) {
    const suspiciousDomains = [
      'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'is.gd', 'v.gd',
      'scam', 'fake', 'phish', 'malware', 'virus'
    ];
    
    const domain = url.toLowerCase();
    return suspiciousDomains.some(suspicious => domain.includes(suspicious));
  }

  isUrlShortener(url) {
    const shorteners = [
      'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'is.gd', 'v.gd',
      'shorturl', 'shorten', 'tiny', 'short'
    ];
    
    const domain = url.toLowerCase();
    return shorteners.some(shortener => domain.includes(shortener));
  }

  // Get security statistics
  getSecurityStats() {
    return {
      activeSessions: this.userSessions.size,
      abusePatterns: this.abusePatterns.size,
      rateLimitedSessions: Array.from(this.rateLimits.values()).filter(limit => limit.blocked).length
    };
  }
}

// Create singleton instance
const securityMiddleware = new SecurityMiddleware();

module.exports = securityMiddleware; 