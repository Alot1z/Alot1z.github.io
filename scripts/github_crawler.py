#!/usr/bin/env python3
"""
GitHub Repository Crawler for Alot1z's Starred Repositories

This script crawls all starred repositories from https://github.com/Alot1z?tab=repositories
and generates comprehensive documentation for the wiki system.

Author: Generated for Alot1z GitHub Repository Wiki System
License: MIT License
"""

import json
import time
import requests
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any
import re
from urllib.parse import urljoin, urlparse

class GitHubRepoCrawler:
    def __init__(self, username: str, data_dir: str):
        self.username = username
        self.data_dir = Path(data_dir)
        self.session = requests.Session()
        self.repositories = []
        self.rate_limit_delay = 1.0
        
    def crawl_repositories(self) -> List[Dict[str, Any]]:
        """Crawl all repositories from user's starred repositories page"""
        print(f"🚀 Starting to crawl repositories for {self.username}...")
        
        page = 1
        repositories = []
        
        while True:
            print(f"📄 Crawling page {page}...")
            
            # Construct URL for current page
            url = f"https://github.com/{self.username}?page={page}&tab=repositories"
            
            try:
                response = self.session.get(url, timeout=30)
                response.raise_for_status()
                
                # Parse repositories from page
                page_repos = self._parse_repositories_page(response.text)
                
                if not page_repos:
                    break
                    
                repositories.extend(page_repos)
                page += 1
                
                # Rate limiting
                time.sleep(self.rate_limit_delay)
                
            except requests.exceptions.RequestException as e:
                print(f"❌ Error crawling page {page}: {e}")
                break
        
        self.repositories = repositories
        print(f"✅ Successfully crawled {len(repositories)} repositories")
        return repositories
    
    def _parse_repositories_page(self, html_content: str) -> List[Dict[str, Any]]:
        """Parse repositories from GitHub HTML page"""
        repositories = []
        
        # Regex pattern to extract repository information
        repo_pattern = r'<a[^>]*href="([^"]*)"[^>]*>([^<]*)</a>'
        
        # Extract basic repository information using regex
        repo_links = re.findall(r'<a[^>]*href="(/[^"]*)"[^>]*>([^<]*)</a>', html_content)
        
        # More detailed extraction
        detailed_pattern = r'<a[^>]*href="(/[^"]*)"[^>]*>([^<]*)</a>\s*<[^<]*>([^<]*)</[^<]*>\s*(<[^>]*>([^<]*)</[^>]*>)'
        
        # Extract structured information
        repo_blocks = re.findall(
            r'<li[^>]*data-testid="repo-list-item"[^>]*>.*?<a[^>]*href="(/[^"]*)"[^>]*>([^<]*)</a>.*?'
            r'<p[^>]*>(.*?)</p>.*?'
            r'<span[^>]*item-prop="main-language"[^>]*>([^<]*)</span>.*?'
            r'<span[^>]*item-prop="license"[^>]*>([^<]*)</span>',
            html_content,
            re.DOTALL
        )
        
        for block in repo_blocks:
            repo = self._extract_repository_info(block)
            if repo:
                repositories.append(repo)
        
        return repositories
    
    def _extract_repository_info(self, repo_block: str) -> Dict[str, Any]:
        """Extract detailed repository information from HTML block"""
        repo = {}
        
        # Extract URL and name
        url_match = re.search(r'href="([^"]*)"', repo_block)
        name_match = re.search(r'>([^<]*)</a>', repo_block)
        
        if url_match and name_match:
            repo['url'] = f"https://github.com{url_match.group(1)}"
            repo['name'] = name_match.group(1).strip()
            
            # Extract description
            desc_match = re.search(r'<p[^>]*>(.*?)</p>', repo_block)
            if desc_match:
                repo['description'] = desc_match.group(1).strip()
            else:
                repo['description'] = ""
            
            # Extract language
            lang_match = re.search(r'item-prop="main-language"[^>]*>([^<]*)</span>', repo_block)
            if lang_match:
                repo['language'] = lang_match.group(1).strip()
            else:
                repo['language'] = "Unknown"
            
            # Extract license
            license_match = re.search(r'item-prop="license"[^>]*>([^<]*)</span>', repo_block)
            if license_match:
                repo['license'] = license_match.group(1).strip()
            else:
                repo['license'] = "Unknown"
            
            # Extract update date
            date_match = re.search(r'>([^<]*)</[^>]*>([^<]*)</[^>]*>', repo_block)
            if date_match:
                repo['last_updated'] = date_match.group(2).strip()
            else:
                repo['last_updated'] = "Unknown"
            
            # Extract stars
            stars_match = re.search(r'star.*?"([^"]*)"[^>]*>"([^<]*)</a>', repo_block)
            if stars_match:
                try:
                    repo['stars'] = int(stars_match.group(2).strip())
                except ValueError:
                    repo['stars'] = 0
            else:
                repo['stars'] = 0
            
            # Extract tags from description and name
            repo['tags'] = self._generate_tags(repo)
            repo['purpose'] = self._determine_purpose(repo)
            repo['quality_score'] = self._calculate_quality_score(repo)
            
            return repo
        
        return {}
    
    def _generate_tags(self, repo: Dict[str, Any]) -> List[str]:
        """Generate tags based on repository content"""
        tags = []
        
        # Add language tag
        if repo.get('language') != 'Unknown':
            tags.append(repo['language'].lower())
        
        # Add tags from description
        description = repo.get('description', '').lower()
        if 'mcp' in description:
            tags.append('mcp')
        if 'ai' in description or 'llm' in description:
            tags.append('ai')
        if 'automation' in description:
            tags.append('automation')
        if 'security' in description:
            tags.append('security')
        if 'web' in description:
            tags.append('web')
        if 'game' in description:
            tags.append('game-development')
        if 'mobile' in description or 'ios' in description:
            tags.append('mobile')
        if 'reverse' in description:
            tags.append('reverse-engineering')
        if 'static analysis' in description:
            tags.append('static-analysis')
        
        # Add tags from name
        name = repo.get('name', '').lower()
        if 'mcp' in name:
            tags.append('mcp')
        
        return list(set(tags))
    
    def _determine_purpose(self, repo: Dict[str, Any]) -> str:
        """Determine the primary purpose of the repository"""
        description = repo.get('description', '').lower()
        name = repo.get('name', '').lower()
        
        if 'mcp' in name or 'mcp' in description:
            return "MCP Integration"
        elif 'ai' in description or 'llm' in description:
            return "AI/ML Development"
        elif 'web' in description:
            return "Web Development"
        elif 'game' in description:
            return "Game Development"
        elif 'mobile' in description or 'ios' in description:
            return "Mobile Development"
        elif 'security' in description or 'reverse' in description:
            return "Security Research"
        elif 'development' in description or 'tool' in description:
            return "Development Tools"
        elif 'utility' in description:
            return "System Utilities"
        else:
            return "General Purpose"
    
    def _calculate_quality_score(self, repo: Dict[str, Any]) -> float:
        """Calculate quality score based on repository metrics"""
        score = 5.0  # Base score
        
        # Language popularity bonus
        popular_languages = ['python', 'javascript', 'typescript', 'go', 'rust', 'java', 'c#', 'swift']
        if repo.get('language', '').lower() in popular_languages:
            score += 1.0
        
        # MIT license bonus
        if 'MIT' in repo.get('license', ''):
            score += 1.0
        
        # Recent update bonus
        if '2025' in repo.get('last_updated', ''):
            score += 0.5
        
        # Stars bonus
        score += min(repo.get('stars', 0) * 0.001)
        
        return round(min(score, 10.0), 1)
    
    def save_to_json(self, filename: str = None):
        """Save repositories data to JSON file"""
        if filename is None:
            filename = self.data_dir / "repositories.json"
        else:
            filename = Path(filename)
        
        # Create data directory if it doesn't exist
        filename.parent.mkdir(parents=True, exist_ok=True)
        
        # Save to JSON
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump({
                'total_repositories': len(self.repositories),
                'last_updated': datetime.now().isoformat(),
                'repositories': self.repositories
            }, f, indent=2, ensure_ascii=False)
        
        print(f"💾 Saved repository data to {filename}")
        return filename
    
    def generate_category_pages(self, output_dir: str):
        """Generate individual category pages"""
        output_path = Path(output_dir)
        
        # Group repositories by category
        categories = {}
        for repo in self.repositories:
            category = self._categorize_repository(repo)
            if category not in categories:
                categories[category] = []
            categories[category].append(repo)
        
        # Generate markdown pages for each category
        for category, repos in categories.items():
            if category != "other":
                self._generate_category_page(category, repos, output_path)
        
        print(f"📄 Generated {len(categories)} category pages")
    
    def _categorize_repository(self, repo: Dict[str, Any]) -> str:
        """Categorize repository based on its content and purpose"""
        purpose = repo.get('purpose', '').lower()
        tags = repo.get('tags', [])
        
        if 'mcp' in tags or 'mcp' in repo.get('name', '').lower():
            return "mcp-servers"
        elif any(tag in ['ai', 'llm', 'machine-learning', 'nlp', 'transformers', 'ocr'] for tag in tags):
            return "ai-ml-tools"
        elif any(tag in ['development', 'static-analysis', 'semgrep', 'fastapi', 'docusaurus'] for tag in tags):
            return "development-tools"
        elif any(tag in ['mobile', 'ios', 'android', 'swift'] for tag in tags):
            return "mobile-tools"
        elif any(tag in ['security', 'malware', 'cheat-engine', 'proximity'] for tag in tags):
            return "security-tools"
        else:
            return "utilities"
    
    def _generate_category_page(self, category: str, repos: List[Dict[str, Any]], output_path: Path):
        """Generate markdown page for a specific category"""
        # Create category directory
        category_dir = output_path / "docs" / category
        category_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate markdown content
        content = f"# {category.replace('-', ' ').title()}\n\n"
        content += f"**Total Repositories**: {len(repos)}\n\n"
        content += f"**Description**: {self._get_category_description(category)}\n\n"
        content += "## Repositories\n\n"
        
        # Sort repositories by quality score
        sorted_repos = sorted(repos, key=lambda x: x.get('quality_score', 0), reverse=True)
        
        for repo in sorted_repos:
            content += f"### [{repo['name']}]({repo['url']})\n\n"
            content += f"**Description**: {repo.get('description', 'No description available')}\n\n"
            content += f"**Language**: {repo.get('language', 'Unknown')}\n"
            content += f"**License**: {repo.get('license', 'Unknown')}\n"
            content += f"**Last Updated**: {repo.get('last_updated', 'Unknown')}\n"
            content += f"**Stars**: {repo.get('stars', 0)}\n"
            content += f"**Tags**: {', '.join(repo.get('tags', []))}\n"
            content += f"**Quality Score**: {repo.get('quality_score', 0)}/10\n\n"
            content += "---\n\n"
        
        # Save to file
        filename = category_dir / "README.md"
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"📄 Generated {filename}")
    
    def _get_category_description(self, category: str) -> str:
        """Get description for a category"""
        descriptions = {
            "mcp-servers": "Servers for Model Context Protocol integration with AI tools",
            "ai-ml-tools": "Tools and frameworks for artificial intelligence and machine learning development",
            "development-tools": "Tools for software development, building, and deployment",
            "mobile-tools": "Tools for mobile app development and iOS/Android platforms",
            "security-tools": "Tools for security research, reverse engineering, and vulnerability analysis",
            "utilities": "General purpose utilities and automation tools"
        }
        return descriptions.get(category, "Uncategorized repositories")

def main():
    """Main function to run the crawler"""
    # Configuration
    username = "Alot1z"
    data_dir = "G:/GITHUB-REPOs/Alot1z.github.io/data"
    
    # Initialize crawler
    crawler = GitHubRepoCrawler(username, data_dir)
    
    # Crawl repositories
    repositories = crawler.crawl_repositories()
    
    # Save data
    json_file = crawler.save_to_json()
    
    # Generate category pages
    crawler.generate_category_pages("G:/GITHUB-REPOs/Alot1z.github.io")
    
    print("🎉 Repository crawling and documentation generation complete!")
    print(f"📊 Data saved to: {json_file}")
    print(f"📁 Category pages generated in: G:/GITHUB-REPOs/Alot1z.github.io/docs")

if __name__ == "__main__":
    main()
