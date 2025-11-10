# Privacy Architecture Whitepaper

## Executive Summary

The Universal GitHub Stars Explorer is built with a **privacy-first architecture** that ensures 100% client-side operation with zero server-side data collection. All sensitive data (API keys, analysis history) remains encrypted in your browser and never leaves your device.

## Core Privacy Principles

### 1. No Server-Side Data Collection

**Zero Data Transmission to Our Servers**:
- Application runs entirely in your browser
- No backend server processes your data
- No logs or analytics collected
- No user tracking or fingerprinting
- No cookies (except essential local storage)

### 2. Direct API Communication

```
┌─────────────────┐
│  Your Browser   │
│   (Client)      │
└────────┬────────┘
         │
         ├───────► GitHub API (Public data only)
         │
         ├───────► OpenAI API (Direct, encrypted)
         │
         ├───────► Anthropic API (Direct, encrypted)
         │
         ├───────► [Any LLM Provider] (Direct, encrypted)
         │
         └───────► Local LLM (No network)

        NO INTERMEDIARY SERVERS
        NO PROXY OR RELAY
```

All API calls go directly from your browser to the provider's API endpoint. We never see or store your API keys or analysis content.

### 3. Local Data Storage Only

All data is stored exclusively in your browser's local storage:

**What We Store Locally**:
- Encrypted API keys (Web Crypto API, AES-GCM 256-bit)
- Analysis cache (IndexedDB, unencrypted but local-only)
- User preferences (theme, filters)
- Repository cache (temporary, can be cleared)

**What We Never Store**:
- Your GitHub credentials
- Plain-text API keys
- Personal information
- Usage analytics
- Browsing history

## Security Implementation

### API Key Encryption

**Technology**: Web Crypto API (browser native)

**Algorithm**: AES-GCM with 256-bit keys

**Process**:
```javascript
// Encryption
1. Generate random 256-bit key using Web Crypto API
2. Create random 96-bit IV (Initialization Vector)
3. Encrypt API key with AES-GCM
4. Store encrypted key + IV in localStorage
5. Original key is immediately discarded

// Decryption
1. Retrieve encrypted key + IV from localStorage
2. Decrypt using Web Crypto API
3. Use decrypted key for API call
4. Key exists only in memory during request
```

**Key Points**:
- Keys never transmitted in plain text
- Encryption happens entirely in browser
- No key escrow or recovery mechanism
- If you lose browser data, keys cannot be recovered

### Analysis Cache Security

**Storage**: IndexedDB (browser database)

**Data Stored**:
- Repository analysis results
- Timestamp of analysis
- Provider and model used
- Token count and cost

**Security**:
- Data never leaves your device
- Can be cleared at any time
- Indexed by repository name
- No personal identifiers

**Why Not Encrypted?**:
- Analysis content is not sensitive (public repos)
- Improves performance
- Can be easily inspected and deleted
- You control the data

### HTTPS Enforcement

**All API Calls Use HTTPS**:
- End-to-end encryption in transit
- Certificate validation
- Protection against man-in-the-middle attacks

### Content Security Policy

Application enforces strict CSP:
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
connect-src 'self' https://api.github.com https://*.openai.com https://*.anthropic.com [...];
```

## Data Flow Diagrams

### Repository Browsing Flow

```
User Input (GitHub username)
        ↓
Browser validates input
        ↓
Direct API call to GitHub (HTTPS)
        ↓
Process data in browser (JavaScript)
        ↓
Display in UI
        ↓
Cache in browser (optional)
        
NO SERVER INVOLVEMENT
```

### LLM Analysis Flow

```
User clicks "Analyze"
        ↓
Check for API key in localStorage
        ↓
Decrypt API key (Web Crypto API)
        ↓
Prepare prompt in browser
        ↓
Direct HTTPS call to LLM provider
        ↓
Stream response to browser
        ↓
Save to IndexedDB (local cache)
        ↓
Display results
        
API KEY NEVER TRANSMITTED TO OUR SERVERS
```

### Local LLM Flow

```
User selects Ollama/LM Studio
        ↓
Check local server availability
        ↓
Direct call to localhost:11434 or localhost:1234
        ↓
No internet communication
        ↓
Completely private
        
100% OFFLINE OPERATION
```

## Privacy by Design

### 1. Data Minimization

We only collect what's absolutely necessary:
- GitHub username (you provide, not stored)
- Repository metadata (from GitHub's public API)
- Analysis results (cached locally for your convenience)

### 2. Purpose Limitation

Data is used only for stated purpose:
- Repository browsing
- AI analysis
- Filtering and search
- User preferences

### 3. Storage Limitation

Data retention is under your control:
- Clear cache anytime
- Delete API keys anytime
- No automatic uploads or syncs

### 4. Transparency

Complete transparency through:
- Open source code
- This documentation
- No hidden features
- No telemetry

### 5. User Control

You have complete control:
- Choose which LLM providers to use
- Manage your own API keys
- Clear all data instantly
- Use local LLMs for complete privacy

## Third-Party Services

### Services We Use

1. **GitHub API**:
   - Purpose: Fetch public repository data
   - Data Shared: Username only
   - Privacy Policy: [github.com/privacy](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement)

2. **LLM Provider APIs** (Your Choice):
   - Purpose: Generate repository analysis
   - Data Shared: Repository metadata + prompt
   - Authentication: Your own API key (direct)
   - Privacy: Each provider's policy applies

### Services We Don't Use

- Analytics (Google Analytics, etc.)
- Advertising networks
- Social media tracking pixels
- Error tracking services (Sentry, etc.)
- CDNs for user data
- Authentication services

## Compliance

### GDPR Compliance

As we don't collect personal data:
- No data processing agreements needed
- No data subject requests (we have no data)
- No data breaches possible (no central storage)
- Right to be forgotten: Clear browser data

### CCPA Compliance

No personal information collected or sold:
- We don't sell personal information
- We don't share personal information
- We don't retain personal information
- Complete user privacy by default

### Security Best Practices

Following OWASP guidelines:
- Secure credential storage (Web Crypto API)
- HTTPS everywhere
- Content Security Policy
- Input validation
- No SQL injection risk (no server database)
- No XSS vulnerabilities (React escaping)

## Comparison with Alternatives

### Traditional SaaS Approach

```
❌ User → Server → LLM Provider
   - Server sees all data
   - Server stores API keys
   - Server logs requests
   - Privacy depends on provider trust
```

### Our Approach

```
✅ User → LLM Provider (Direct)
   - No intermediary
   - Keys stay in browser
   - Zero logging
   - Maximum privacy
```

## Risks and Limitations

### Browser Security

Your data is as secure as your browser:
- Keep browser updated
- Use reputable browser (Chrome, Firefox, Safari, Edge)
- Enable browser security features
- Be cautious with browser extensions

### API Key Security

API keys are encrypted but:
- Physical access to unlocked device can expose keys
- Browser vulnerabilities could potentially expose keys
- Use strong device passwords
- Lock device when away

### Network Security

API calls traverse internet:
- Use trusted networks
- Avoid public Wi-Fi for sensitive operations
- Consider VPN for additional security
- HTTPS provides encryption in transit

### Local LLM Privacy

Local LLMs provide maximum privacy:
- No internet communication
- No API keys needed
- Complete control
- But: Requires local hardware

## Recommendations

### For Maximum Privacy

1. **Use Local LLMs**:
   - Ollama, LM Studio, or LocalAI
   - No API keys needed
   - No network communication
   - Complete control

2. **Use Dedicated Browser Profile**:
   - Separate profile for this application
   - Isolate from other browsing
   - Easier to manage data

3. **Regular Cleanup**:
   - Clear cache periodically
   - Rotate API keys regularly
   - Review stored data

4. **Strong Device Security**:
   - Use device encryption
   - Strong passwords
   - Lock when unattended

### For Organizations

1. **Self-Host**:
   - Deploy on your own domain
   - Use LocalAI or similar
   - Complete control over infrastructure

2. **API Key Management**:
   - Use organization API keys
   - Monitor usage
   - Implement rate limiting

3. **Network Security**:
   - VPN for remote workers
   - Firewall rules
   - Security audits

## Audit and Verification

### How to Verify Privacy Claims

1. **Inspect Network Traffic**:
   ```bash
   # Use browser DevTools → Network tab
   # All requests should be to:
   # - api.github.com
   # - Your selected LLM provider
   # - localhost (for local LLMs)
   ```

2. **Review Source Code**:
   ```bash
   # All code is open source
   git clone https://github.com/yourusername/github-stars-explorer
   # Review lib/llm-api-universal.ts
   # Review lib/encryption.ts
   ```

3. **Check Local Storage**:
   ```javascript
   // Browser Console → Application → Local Storage
   // API keys are encrypted (random string)
   // IndexedDB contains only analysis cache
   ```

## Updates and Changes

This privacy architecture is fundamental to the project. Any changes that affect privacy will:

1. Be prominently announced
2. Update this document
3. Require user acknowledgment
4. Respect existing users' choices

## Contact

For privacy concerns or questions:
- Open an issue on [GitHub](https://github.com/yourusername/github-stars-explorer/issues)
- Email: [privacy@example.com](mailto:privacy@example.com)
- Review our [Security Policy](../SECURITY.md)

---

**Last Updated**: November 11, 2025

**Version**: 1.0

**Status**: Active and enforced
