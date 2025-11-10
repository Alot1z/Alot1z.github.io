# GitHub Stars Explorer

A modern, responsive web application for exploring and organizing GitHub starred repositories with intelligent categorization and quality scoring.

![GitHub Stars Explorer](public/icon-512.png)

## 🚀 Features

- **Smart Repository Discovery**: Enter any GitHub username or URL to explore their starred repositories
- **Intelligent Categorization**: Automatic classification into categories like AI/ML, Web Development, Security, DevOps, etc.
- **Quality Scoring Algorithm**: 1-10 quality score based on stars, forks, activity, and maintenance
- **Advanced Filtering**: Search by name, description, topics, language, category, and quality score
- **Beautiful Statistics Dashboard**: Visual analytics of your starred repositories
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Mobile Responsive**: Optimized for desktop, tablet, and mobile devices
- **PWA Support**: Install as a native app with offline capabilities
- **No Authentication Required**: Works with public GitHub data

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **API**: GitHub REST API (no authentication required)
- **Deployment**: GitHub Pages with automatic CI/CD

## 📋 Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

## 🔧 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/github-stars-explorer.git
cd github-stars-explorer
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Start Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build for Production
```bash
pnpm build
```

### 5. Preview Production Build
```bash
pnpm preview
```

## 🚀 Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages via GitHub Actions.

### Setup Instructions

1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "GitHub Actions" as the source

2. **Push to Main Branch**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Automatic Deployment**:
   - The GitHub Actions workflow will automatically build and deploy
   - Visit `https://your-username.github.io/github-stars-explorer`

### Manual Deployment

If you prefer manual deployment:

```bash
# Build the project
pnpm build

# Deploy the dist folder to GitHub Pages
# Upload the contents of the 'dist' folder to your gh-pages branch
```

## 📖 Usage

1. **Enter a GitHub username** or paste a full GitHub URL in the search box
2. **Explore repositories** organized by category with quality scores
3. **Use filters** to find specific repositories by language, category, or quality
4. **View statistics** to understand your starred repository patterns
5. **Toggle dark/light theme** using the theme switcher in the header

### Example Searches
- Username: `octocat`
- Full URL: `https://github.com/torvalds?tab=stars`
- Username with @: `@microsoft`

## 🎨 Design System

The application uses a custom design system with:
- **Color Palette**: Modern indigo-based colors with semantic color system
- **Typography**: Inter font with proper type scale for readability
- **Spacing**: 8-point grid system for consistent spacing
- **Components**: Reusable components following accessibility standards

## 🔍 API Integration

The application uses the public GitHub API:
- No authentication required for public repositories
- Rate limit: 60 requests per hour for unauthenticated users
- Caches responses to minimize API calls

### GitHub API Endpoints Used
- `GET /users/{username}` - User information
- `GET /users/{username}/starred` - Starred repositories

## 📱 PWA Features

- **Installable**: Can be installed as a native app
- **Offline Support**: Basic offline functionality with service worker
- **App Icons**: Custom app icons for different platforms
- **Manifest**: Configured for native app behavior

## 🧪 Testing

```bash
# Run tests (if configured)
pnpm test

# Run linting
pnpm lint

# Type checking
pnpm type-check
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- GitHub API for providing access to repository data
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icon set
- React and Vite teams for the excellent development experience

## 🐛 Known Issues

- Large repositories (1000+ starred repos) may take time to load
- GitHub API rate limits apply for unauthenticated requests
- Some repository topics may not be available for older repositories

## 🔮 Future Enhancements

- [ ] User authentication for higher API rate limits
- [ ] Export functionality for filtered results
- [ ] Advanced analytics and insights
- [ ] Collaborative features for team repositories
- [ ] Integration with other version control platforms
- [ ] Custom category creation and management

---

**Built with ❤️ for developers who love organizing their GitHub stars**
