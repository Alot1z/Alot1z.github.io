# Security Policy

## Supported Versions

We release security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow responsible disclosure:

### How to Report

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead:

1. **Email**: Send details to [security@example.com](mailto:security@example.com)
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
3. **Response Time**: We aim to respond within 48 hours

### What to Expect

1. **Acknowledgment**: We'll confirm receipt within 48 hours
2. **Investigation**: We'll investigate and validate the issue
3. **Fix Development**: We'll develop and test a fix
4. **Disclosure**: We'll coordinate public disclosure
5. **Credit**: We'll credit you in release notes (if desired)

## Security Architecture

### Client-Side Only

This application runs entirely in your browser:
- No backend server
- No data transmission to our servers
- All processing happens locally
- API keys stored in browser only

### API Key Encryption

- **Algorithm**: AES-GCM 256-bit
- **Technology**: Web Crypto API (native browser)
- **Storage**: localStorage (encrypted)
- **Lifetime**: Until you clear browser data

### Data Storage

- **API Keys**: Encrypted in localStorage
- **Analysis Cache**: Unencrypted in IndexedDB (public repo data)
- **Preferences**: Unencrypted in localStorage

### HTTPS Enforcement

- All external API calls use HTTPS
- Content Security Policy enforced
- No mixed content allowed

## Threat Model

### In Scope

1. **API Key Leakage**:
   - Keys exposed in logs
   - Keys transmitted insecurely
   - Keys stored in plain text

2. **Cross-Site Scripting (XSS)**:
   - Malicious code injection
   - DOM-based XSS
   - Stored XSS

3. **Data Exfiltration**:
   - Unauthorized data access
   - API key theft
   - Cache manipulation

4. **Man-in-the-Middle**:
   - Network interception
   - API call tampering
   - Certificate issues

### Out of Scope

1. **Physical Access**:
   - Unlocked device access
   - Keylogger attacks
   - Screen capture

2. **Browser Vulnerabilities**:
   - Zero-day browser bugs
   - Extension malware
   - Browser configuration

3. **LLM Provider Security**:
   - Provider API breaches
   - Provider data handling
   - Provider infrastructure

## Security Best Practices

### For Users

1. **Device Security**:
   - Use device encryption
   - Strong passwords
   - Lock when unattended
   - Keep OS updated

2. **Browser Security**:
   - Use updated browsers
   - Review installed extensions
   - Clear data regularly
   - Use incognito for sensitive operations

3. **API Key Management**:
   - Rotate keys regularly
   - Use separate keys per application
   - Monitor usage in provider dashboard
   - Revoke unused keys

4. **Network Security**:
   - Avoid public Wi-Fi
   - Use VPN for sensitive operations
   - Verify HTTPS connections
   - Monitor network traffic

### For Developers

1. **Code Reviews**:
   - Review all PRs for security issues
   - Check for credential leaks
   - Validate input handling
   - Test error cases

2. **Dependency Management**:
   - Keep dependencies updated
   - Audit npm packages
   - Remove unused dependencies
   - Use lock files

3. **Testing**:
   - Test encryption/decryption
   - Verify HTTPS enforcement
   - Check CSP headers
   - Audit local storage

4. **Deployment**:
   - Use HTTPS for hosting
   - Configure security headers
   - Enable CSP
   - Test in production environment

## Known Security Considerations

### Browser Local Storage

**Risk**: Data in localStorage can be accessed by:
- JavaScript running in same origin
- Browser extensions with permissions
- Physical access to unlocked device

**Mitigation**:
- API keys are encrypted
- Use Web Crypto API (native)
- Clear data when done
- Use local LLMs for maximum privacy

### Third-Party API Calls

**Risk**: API calls expose:
- Repository metadata (public)
- Analysis prompts
- API keys in headers

**Mitigation**:
- All calls use HTTPS
- Keys in Authorization header (secure)
- Only public repo data
- You control which providers to use

### Dependency Vulnerabilities

**Risk**: npm packages may have vulnerabilities

**Mitigation**:
- Regular security audits
- Automated Dependabot updates
- Minimal dependencies
- Trusted packages only

## Security Headers

Application enforces:

```
Content-Security-Policy: default-src 'self'; ...
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Incident Response

If a security incident occurs:

1. **Immediate**:
   - Assess scope and impact
   - Contain the issue
   - Notify affected users

2. **Short Term**:
   - Develop and test fix
   - Deploy patch
   - Monitor for exploitation

3. **Long Term**:
   - Conduct post-mortem
   - Update documentation
   - Improve processes
   - Implement preventive measures

## Security Audits

We welcome security audits:
- Code is fully open source
- All crypto operations use standard libraries
- No obfuscation or hidden features

To conduct an audit:
1. Review source code on GitHub
2. Test locally or in production
3. Report findings responsibly

## Cryptography

### Encryption Implementation

- **Library**: Web Crypto API (browser native)
- **No Custom Crypto**: We don't implement our own cryptography
- **Standards**: Following W3C Web Crypto API specification
- **Audited**: Browser crypto implementations are audited

### Key Generation

```javascript
// AES-GCM 256-bit key generation
const key = await window.crypto.subtle.generateKey(
  { name: 'AES-GCM', length: 256 },
  true,
  ['encrypt', 'decrypt']
);
```

### Encryption Process

```javascript
// Encrypt API key
1. Generate random IV (96 bits)
2. Encrypt with AES-GCM
3. Combine IV + encrypted data
4. Base64 encode for storage
```

## Updates and Patches

### Security Updates

- Critical: Released immediately
- High: Within 7 days
- Medium: Next minor version
- Low: Next major version

### How to Stay Updated

1. **Watch GitHub Repository**:
   - Enable notifications
   - Check releases page

2. **Update Regularly**:
   ```bash
   git pull origin main
   pnpm install
   pnpm build
   ```

3. **Review Changelogs**:
   - Security fixes are clearly marked
   - Migration guides provided

## Responsible Disclosure

We believe in coordinated disclosure:

1. **Report Privately**: Give us time to fix
2. **Reasonable Time**: 90 days before public disclosure
3. **Coordinated Release**: We'll work with you on timing
4. **Credit**: You'll be credited (if desired)

### Hall of Fame

We'll recognize security researchers who help improve security:
- Name/pseudonym (with permission)
- Brief description of issue
- Recognition in release notes

(No entries yet)

## Contact

### Security Team

- **Email**: [security@example.com](mailto:security@example.com)
- **PGP Key**: Available on request
- **Response Time**: 48 hours

### General Security Questions

- Open an issue on [GitHub](https://github.com/yourusername/github-stars-explorer/issues) (for non-sensitive questions)
- Review [Privacy Policy](docs/PRIVACY.md)
- Check [Documentation](docs/)

## Acknowledgments

We thank:
- Browser vendors for Web Crypto API
- Security researchers for responsible disclosure
- Open source community for security tools
- Users for reporting issues

---

**Last Updated**: November 11, 2025

**Version**: 1.0

**Next Review**: February 11, 2026
