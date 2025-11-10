# Contributing to Universal LLM-Powered GitHub Stars Explorer

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Focus on what is best for the community
- Show empathy towards others
- Accept constructive criticism gracefully

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title**: Brief description of the issue
- **Steps to reproduce**: Detailed steps to reproduce the behavior
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Screenshots**: If applicable
- **Environment**:
  - Browser and version
  - Operating system
  - Application version

**Example**:
```markdown
**Bug**: API key validation fails for Anthropic

**Steps**:
1. Open provider selector
2. Select Anthropic
3. Enter valid API key
4. Click validate

**Expected**: Validation succeeds
**Actual**: Shows "Validation failed" error

**Environment**: Chrome 120, macOS 14.1, App v1.0.0
```

### Suggesting Features

Feature suggestions are welcome! Please include:

- **Clear description**: What feature you'd like to see
- **Use case**: Why this feature would be useful
- **Possible implementation**: How it could work (optional)
- **Alternatives**: Other solutions you've considered

### Adding New LLM Providers

We welcome new provider integrations! To add a provider:

1. **Research the Provider**:
   - API documentation
   - Authentication method
   - Available models
   - Pricing structure
   - Rate limits

2. **Implement Integration**:
   ```typescript
   // In providers-config.ts
   export const PROVIDER_CONFIGS = {
     // ... existing providers
     newProvider: {
       id: 'new-provider',
       name: 'New Provider',
       description: 'Description of provider',
       website: 'https://provider.com',
       apiEndpoint: 'https://api.provider.com/v1',
       requiresAuth: true,
       supportsStreaming: true,
       authType: 'bearer',
       defaultModel: 'model-name',
       models: [...]
     }
   }
   ```

3. **Add API Client**:
   ```typescript
   // In llm-api-universal.ts
   async function analyzeWithNewProvider(
     repository: RepositoryWithScore,
     config: AnalysisConfig,
     callbacks: StreamingCallback
   ): Promise<void> {
     // Implementation
   }
   ```

4. **Update Router**:
   ```typescript
   case 'new-provider':
     return analyzeWithNewProvider(repository, config, callbacks);
   ```

5. **Add Documentation**:
   - Update docs/API.md with provider details
   - Include setup instructions
   - Document pricing and rate limits

6. **Test Thoroughly**:
   - API key validation
   - Streaming (if supported)
   - Error handling
   - Cost calculation

### Pull Request Process

1. **Fork the Repository**:
   ```bash
   git clone https://github.com/yourusername/github-stars-explorer.git
   cd github-stars-explorer
   ```

2. **Create a Branch**:
   ```bash
   git checkout -b feature/my-new-feature
   # or
   git checkout -b fix/bug-description
   ```

3. **Make Changes**:
   - Write clear, documented code
   - Follow existing code style
   - Add tests if applicable
   - Update documentation

4. **Test Your Changes**:
   ```bash
   pnpm install
   pnpm dev  # Test locally
   pnpm build  # Ensure it builds
   ```

5. **Commit Changes**:
   ```bash
   git add .
   git commit -m "feat: add support for New Provider"
   # or
   git commit -m "fix: resolve API key validation issue"
   ```

   **Commit Message Format**:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

6. **Push to GitHub**:
   ```bash
   git push origin feature/my-new-feature
   ```

7. **Open Pull Request**:
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Provide clear description
   - Link related issues

### Pull Request Guidelines

**Title**: Clear and descriptive
```
Good: "Add support for Google Gemini Pro"
Bad: "Update files"
```

**Description**: Include:
- What changes were made
- Why they were necessary
- How to test them
- Screenshots (if UI changes)
- Breaking changes (if any)

**Example**:
```markdown
## Description
Adds support for Google Gemini Pro API integration

## Changes
- Added Gemini provider configuration
- Implemented API client with streaming
- Updated documentation
- Added cost calculation

## Testing
1. Configure Gemini API key
2. Select Gemini Pro model
3. Analyze a repository
4. Verify streaming works
5. Check cost calculation

## Screenshots
[Add if applicable]

## Breaking Changes
None
```

## Development Setup

### Prerequisites

- Node.js 18+ and pnpm
- Git
- Code editor (VS Code recommended)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/github-stars-explorer.git
cd github-stars-explorer

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Project Structure

```
github-stars-explorer/
├── src/
│   ├── components/       # React components
│   │   ├── ProviderSelector.tsx
│   │   ├── AnalysisPanel.tsx
│   │   └── ...
│   ├── lib/              # Utilities and APIs
│   │   ├── providers-config.ts
│   │   ├── llm-api-universal.ts
│   │   ├── encryption.ts
│   │   └── ...
│   ├── contexts/         # React contexts
│   └── App.tsx           # Main application
├── public/               # Static assets
├── docs/                 # Documentation
│   ├── API.md
│   ├── PRIVACY.md
│   └── ...
├── .github/              # GitHub workflows
└── package.json
```

### Code Style

We use:
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting (if configured)
- React best practices

**Guidelines**:
- Use TypeScript types (avoid `any`)
- Write clear variable names
- Add JSDoc comments for complex functions
- Keep functions small and focused
- Use React hooks appropriately

### Testing

Currently, we don't have automated tests. Contributions to add testing are welcome!

**Manual Testing Checklist**:
- [ ] Test in Chrome, Firefox, Safari
- [ ] Test on mobile devices
- [ ] Test dark/light themes
- [ ] Test with different providers
- [ ] Test error scenarios
- [ ] Test with slow network
- [ ] Test offline functionality

## Documentation

### Updating Documentation

When making changes, update relevant documentation:

- **README.md**: Main project documentation
- **docs/API.md**: Provider integration details
- **docs/PRIVACY.md**: Privacy-related changes
- **SECURITY.md**: Security-related changes
- **Code comments**: Inline documentation

### Writing Style

- Be clear and concise
- Use examples
- Include code snippets
- Add screenshots for UI changes
- Keep it up to date

## Community

### Where to Get Help

- **GitHub Issues**: Ask questions, report bugs
- **GitHub Discussions**: General discussions, ideas
- **Pull Requests**: Code review and feedback

### Recognition

Contributors will be recognized in:
- Release notes
- Contributors list
- Special mentions for significant contributions

## Release Process

Releases are managed by project maintainers:

1. Version bump (semantic versioning)
2. Update CHANGELOG.md
3. Create GitHub release
4. Deploy to GitHub Pages

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

If you have questions about contributing:
- Open an issue with the "question" label
- Start a discussion on GitHub Discussions
- Review existing issues and pull requests

## Thank You!

Every contribution, no matter how small, is valuable. Thank you for helping make this project better!

---

**Happy Contributing!** 🎉
