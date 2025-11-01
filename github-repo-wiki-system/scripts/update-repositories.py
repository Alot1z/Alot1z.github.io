#!/usr/bin/env python3
"""
Alot1z's Repository Wiki - Automated Repository Updater
This script automatically crawls GitHub repositories and updates the wiki data.
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, List, Any
import re
import os

class GitHubRepositoryCrawler:
    def __init__(self, username: str = "Alot1z"):
        self.username = username
        self.base_url = "https://github.com"
        self.repositories = []
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def crawl_repositories(self) -> List[Dict[str, Any]]:
        """Crawl all repositories for the given username"""
        print(f"🚀 Starting crawl for {self.username}'s repositories...")
        
        page = 1
        while True:
            print(f"📄 Crawling page {page}...")
            
            url = f"{self.base_url}/{self.username}?page={page}&tab=repositories"
            response = self.session.get(url)
            
            if response.status_code != 200:
                print(f"❌ Failed to fetch page {page}: {response.status_code}")
                break
            
            repos = self._parse_repository_page(response.text)
            if not repos:
                print(f"✅ No more repositories found on page {page}")
                break
            
            self.repositories.extend(repos)
            print(f"📦 Found {len(repos)} repositories on page {page}")
            page += 1
            
            # Be respectful to GitHub's rate limits
            time.sleep(1)
        
        print(f"✅ Total repositories found: {len(self.repositories)}")
        return self.repositories
    
    def _parse_repository_page(self, html: str) -> List[Dict[str, Any]]:
        """Parse repository information from HTML"""
        repos = []
        
        # Extract repository items using regex patterns
        repo_pattern = r'<li[^>]*itemtype="http://schema.org/Code".*?</li>'
        matches = re.findall(repo_pattern, html, re.DOTALL)
        
        for match in matches:
            repo = self._extract_repository_info(match)
            if repo:
                repos.append(repo)
        
        return repos
    
    def _extract_repository_info(self, html: str) -> Dict[str, Any]:
        """Extract individual repository information"""
        repo = {}
        
        # Extract repository name and URL
        name_match = re.search(r'<a[^>]*href="([^"]*)"[^>]*>([^<]+)</a>', html)
        if name_match:
            repo['url'] = name_match.group(1)
            repo['name'] = name_match.group(2).strip()
        
        # Extract description
        desc_match = re.search(r'<p[^>]*itemprop="description">([^<]*)</p>', html)
        if desc_match:
            repo['description'] = desc_match.group(1).strip()
        
        # Extract language
        lang_match = re.search(r'<span[^>]*itemprop="programmingLanguage">([^<]*)</span>', html)
        if lang_match:
            repo['language'] = lang_match.group(1).strip()
        
        # Extract stars (if available)
        stars_match = re.search(r'aria-label="star".*?(\d+)', html)
        if stars_match:
            repo['stars'] = int(stars_match.group(1))
        else:
            repo['stars'] = 0
        
        # Extract fork information
        fork_match = re.search(r'Forked from[^>]*href="[^"]*">([^<]*)</a>', html)
        if fork_match:
            repo['forks'] = True
            repo['original'] = fork_match.group(1).strip()
        else:
            repo['forks'] = False
        
        # Extract license
        license_match = re.search(r'([A-Za-z\s0-9.]+(?:License|Public Domain|GPL|LGPL|Apache|MIT|BSD))', html)
        if license_match:
            repo['license'] = license_match.group(1).strip()
        
        # Extract last updated date
        updated_match = re.search(r'Updated[^>]*>([^<]+)</', html)
        if updated_match:
            repo['lastUpdated'] = updated_match.group(1).strip()
        
        return repo if repo.get('name') else None
    
    def categorize_repository(self, repo: Dict[str, Any]) -> str:
        """Automatically categorize repository based on name, description, and language"""
        name = repo.get('name', '').lower()
        description = repo.get('description', '').lower()
        language = repo.get('language', '').lower()
        
        # Category keywords and rules
        categories = {
            'mcp-servers': {
                'keywords': ['mcp', 'model context protocol'],
                'languages': ['typescript', 'python', 'javascript'],
                'patterns': [r'^mcp-', r'-mcp$', r'.*mcp.*']
            },
            'ai-ml-tools': {
                'keywords': ['ai', 'ml', 'machine learning', 'llm', 'neural', 'model', 'training', 'inference'],
                'languages': ['python', 'jupyter', 'javascript', 'typescript'],
                'patterns': [r'.*ai.*', r'.*ml.*', r'.*neural.*']
            },
            'web-scraping': {
                'keywords': ['scraping', 'crawler', 'scraper', 'parse', 'extract', 'spider'],
                'languages': ['python', 'javascript', 'go', 'rust'],
                'patterns': [r'.*scrap.*', r'.*crawl.*', r'.*scraper.*']
            },
            'development-tools': {
                'keywords': ['framework', 'library', 'tool', 'utility', 'build', 'test', 'lint'],
                'languages': ['python', 'javascript', 'typescript', 'rust', 'go'],
                'patterns': [r'.*framework.*', r'.*lib.*', r'.*tool.*']
            },
            'security-tools': {
                'keywords': ['security', 'scan', 'vulnerability', 'penetration', 'reverse engineer', 'hack'],
                'languages': ['python', 'c', 'c++', 'java', 'assembly'],
                'patterns': [r'.*security.*', r'.*scan.*', r'.*audit.*']
            },
            'mobile-development': {
                'keywords': ['ios', 'android', 'mobile', 'app', 'swift', 'kotlin'],
                'languages': ['swift', 'kotlin', 'java', 'dart'],
                'patterns': [r'.*ios.*', r'.*android.*', r'.*mobile.*']
            }
        }
        
        # Score each category
        scores = {}
        for category, config in categories.items():
            score = 0
            
            # Check keywords
            for keyword in config['keywords']:
                if keyword in name or keyword in description:
                    score += 3
            
            # Check language
            if language in config['languages']:
                score += 2
            
            # Check patterns
            for pattern in config['patterns']:
                if re.search(pattern, name) or re.search(pattern, description):
                    score += 2
            
            scores[category] = score
        
        # Return category with highest score
        if scores:
            return max(scores, key=scores.get)
        
        return 'development-tools'  # Default category
    
    def generate_tags(self, repo: Dict[str, Any], category: str) -> List[str]:
        """Generate tags for repository based on metadata"""
        tags = []
        name = repo.get('name', '').lower()
        description = repo.get('description', '').lower()
        language = repo.get('language', '')
        
        # Add category tag
        tags.append(category.replace('-', ''))
        
        # Add language tag
        if language:
            tags.append(language.lower())
        
        # Add technology tags
        tech_keywords = {
            'python': ['python', 'machine learning', 'data science'],
            'javascript': ['javascript', 'nodejs', 'web', 'frontend'],
            'typescript': ['typescript', 'nodejs', 'web', 'typed'],
            'c#': ['csharp', '.net', 'unity', 'windows'],
            'go': ['golang', 'performance', 'concurrent'],
            'rust': ['rust', 'systems', 'performance', 'memory-safe'],
            'java': ['java', 'enterprise', 'android', 'jvm']
        }
        
        if language.lower() in tech_keywords:
            tags.extend(tech_keywords[language.lower()])
        
        # Add specific feature tags
        if 'api' in name or 'api' in description:
            tags.append('api')
        if 'web' in name or 'web' in description:
            tags.append('web')
        if 'docker' in name or 'docker' in description:
            tags.append('docker')
        if 'database' in name or 'database' in description:
            tags.append('database')
        
        # Remove duplicates and limit to 10 tags
        return list(set(tags))[:10]
    
    def determine_difficulty(self, repo: Dict[str, Any], category: str) -> str:
        """Determine difficulty level based on various factors"""
        name = repo.get('name', '').lower()
        description = repo.get('description', '').lower()
        language = repo.get('language', '').lower()
        
        # Simple heuristic based on complexity indicators
        complexity_indicators = {
            'beginner': ['simple', 'basic', 'starter', 'learn', 'tutorial', 'example'],
            'advanced': ['advanced', 'enterprise', 'professional', 'production', 'system']
        }
        
        # Check complexity keywords
        for level, keywords in complexity_indicators.items():
            for keyword in keywords:
                if keyword in name or keyword in description:
                    return level
        
        # Default difficulty based on category
        category_difficulty = {
            'mcp-servers': 'intermediate',
            'ai-ml-tools': 'advanced',
            'web-scraping': 'intermediate',
            'development-tools': 'beginner',
            'security-tools': 'advanced',
            'mobile-development': 'intermediate'
        }
        
        return category_difficulty.get(category, 'beginner')
    
    def process_repositories(self) -> Dict[str, Any]:
        """Process crawled repositories and categorize them"""
        print("🔄 Processing and categorizing repositories...")
        
        processed = {
            'total': len(self.repositories),
            'lastUpdated': datetime.now().isoformat(),
            'categories': {}
        }
        
        # Group repositories by category
        categories = {}
        for repo in self.repositories:
            category = self.categorize_repository(repo)
            
            if category not in categories:
                categories[category] = []
            
            # Add metadata
            repo['category'] = category
            repo['tags'] = self.generate_tags(repo, category)
            repo['difficulty'] = self.determine_difficulty(repo, category)
            
            categories[category].append(repo)
        
        # Format categories for the wiki system
        for category_name, repos in categories.items():
            category_info = {
                'name': self._format_category_name(category_name),
                'description': self._get_category_description(category_name),
                'count': len(repos),
                'priority': self._get_category_priority(category_name),
                'repositories': repos
            }
            processed['categories'][category_name] = category_info
        
        print(f"✅ Processed {len(categories)} categories")
        return processed
    
    def _format_category_name(self, category: str) -> str:
        """Format category name for display"""
        names = {
            'mcp-servers': 'MCP Servers',
            'ai-ml-tools': 'AI & Machine Learning Tools',
            'web-scraping': 'Web Scraping & Automation',
            'development-tools': 'Development Tools & Utilities',
            'security-tools': 'Security & Reverse Engineering',
            'mobile-development': 'Mobile Development & iOS'
        }
        return names.get(category, category.replace('-', ' ').title())
    
    def _get_category_description(self, category: str) -> str:
        """Get description for category"""
        descriptions = {
            'mcp-servers': 'Model Context Protocol servers for AI integration',
            'ai-ml-tools': 'Artificial intelligence and machine learning frameworks',
            'web-scraping': 'Tools for web data extraction and automation',
            'development-tools': 'Programming tools, frameworks, and development utilities',
            'security-tools': 'Security analysis, penetration testing, and reverse engineering tools',
            'mobile-development': 'iOS development, apps, and mobile utilities'
        }
        return descriptions.get(category, f'Repositories related to {category}')
    
    def _get_category_priority(self, category: str) -> str:
        """Get priority level for category"""
        priorities = {
            'mcp-servers': 'high',
            'ai-ml-tools': 'high',
            'web-scraping': 'medium',
            'development-tools': 'medium',
            'security-tools': 'medium',
            'mobile-development': 'low'
        }
        return priorities.get(category, 'medium')
    
    def update_wiki_data(self, data: Dict[str, Any], output_path: str = "src/js/repositories-data.js"):
        """Update the repository data file"""
        print("📝 Updating wiki data file...")
        
        # Generate JavaScript content
        js_content = f"""// Alot1z's Complete GitHub Repository Database
// Auto-generated on {datetime.now().isoformat()}
// Total repositories: {data['total']}

const repositoriesData = {json.dumps(data, indent=4)};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {{
    module.exports = repositoriesData;
}}
"""
        
        # Write to file
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
        
        print(f"✅ Updated {output_path}")
    
    def run(self):
        """Run the complete crawling and update process"""
        try:
            # Step 1: Crawl repositories
            repos = self.crawl_repositories()
            
            if not repos:
                print("❌ No repositories found")
                return
            
            # Step 2: Process and categorize
            data = self.process_repositories()
            
            # Step 3: Update wiki data file
            self.update_wiki_data(data)
            
            print("🎉 Repository update completed successfully!")
            print(f"📊 Summary: {data['total']} repositories across {len(data['categories'])} categories")
            
        except Exception as e:
            print(f"❌ Error during update: {e}")
            raise

if __name__ == "__main__":
    crawler = GitHubRepositoryCrawler()
    crawler.run()
