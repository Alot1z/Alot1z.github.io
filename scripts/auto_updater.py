#!/usr/bin/env python3
"""
Automatic Repository Updater for Alot1z GitHub Repository Wiki System

This script automatically updates repository information and regenerates
documentation when new repositories are starred or existing ones are updated.

Author: Generated for Alot1z GitHub Repository Wiki System
License: MIT License
"""

import json
import time
import requests
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Set

class RepositoryUpdater:
    def __init__(self, data_file: str, wiki_dir: str):
        self.data_file = Path(data_file)
        self.wiki_dir = Path(wiki_dir)
        self.repositories = []
        self.session = requests.Session()
        
    def load_existing_data(self):
        """Load existing repository data from JSON file"""
        try:
            with open(self.data_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.repositories = data.get('repositories', [])
            print(f"✅ Loaded {len(self.repositories)} existing repositories")
            return True
        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"⚠️ Could not load existing data: {e}")
            return False
    
    def check_for_updates(self) -> Dict[str, Any]:
        """Check for repository updates since last crawl"""
        updates = {
            'new_repositories': [],
            'updated_repositories': [],
            'removed_repositories': []
        }
        
        if not self.repositories:
            return updates
        
        # Get current starred repositories
        current_repos = self.get_current_starred_repositories()
        current_urls = {repo['url'] for repo in current_repos}
        existing_urls = {repo['url'] for repo in self.repositories}
        
        # Find new repositories
        for repo in current_repos:
            if repo['url'] not in existing_urls:
                updates['new_repositories'].append(repo)
        
        # Find removed repositories
        for repo in self.repositories:
            if repo['url'] not in current_urls:
                updates['removed_repositories'].append(repo)
        
        # Find updated repositories
        for current_repo in current_repos:
            for existing_repo in self.repositories:
                if (current_repo['url'] == existing_repo['url'] and 
                    self._has_significant_update(current_repo, existing_repo)):
                    updates['updated_repositories'].append(current_repo)
        
        return updates
    
    def get_current_starred_repositories(self) -> List[Dict[str, Any]]:
        """Get current list of starred repositories"""
        repositories = []
        page = 1
        
        while True:
            url = f"https://github.com/Alot1z?page={page}&tab=repositories"
            
            try:
                response = self.session.get(url, timeout=30)
                response.raise_for_status()
                
                # Parse current repositories
                page_repos = self._parse_repositories_page(response.text)
                
                if not page_repos:
                    break
                    
                repositories.extend(page_repos)
                page += 1
                
                time.sleep(1)  # Rate limiting
                
            except requests.exceptions.RequestException as e:
                print(f"Error checking updates: {e}")
                break
        
        return repositories
    
    def _parse_repositories_page(self, html_content: str) -> List[Dict[str, Any]]:
        """Parse repositories from GitHub HTML page (simplified version)"""
        repositories = []
        
        # Extract repository blocks
        repo_blocks = re.findall(
            r'<a[^>]*href="(/[^"]*)"[^>]*>([^<]*)</a>.*?'
            r'<p[^>]*>(.*?)</p>.*?'
            r'<span[^>]*item-prop="main-language"[^>]*>([^<]*)</span>.*?'
            r'<span[^>]*item-prop="license"[^>]*>([^<]*)</span>',
            html_content,
            re.DOTALL
        )
        
        for block in repo_blocks:
            repo = self._extract_repo_from_block(block)
            if repo:
                repositories.append(repo)
        
        return repositories
    
    def _extract_repo_from_block(self, block: str) -> Dict[str, Any]:
        """Extract repository information from HTML block"""
        repo = {}
        
        # Extract URL and name
        url_match = re.search(r'href="(/[^"]*)"', block)
        name_match = re.search(r'>([^<]*)</a>', block)
        
        if url_match and name_match:
            repo['url'] = f"https://github.com{url_match.group(1)}"
            repo['name'] = name_match.group(1).strip()
            
            # Extract description
            desc_match = re.search(r'<p[^>]*>(.*?)</p>', block)
            repo['description'] = desc_match.group(1).strip() if desc_match else ""
            
            # Extract language
            lang_match = re.search(r'item-prop="main-language"[^>]*>([^<]*)</span>', block)
            repo['language'] = lang_match.group(1).strip() if lang_match else "Unknown"
            
            # Extract license
            license_match = re.search(r'item-prop="license"[^>]*>([^<]*)</span>', block)
            repo['license'] = license_match.group(1).strip() if license_match else "Unknown"
            
            # Extract update date
            date_match = re.search(r'>([^<]*)</[^>]*>([^<]*)</[^>]*>', block)
            repo['last_updated'] = date_match.group(2).strip() if date_match else "Unknown"
            
            return repo
        
        return {}
    
    def _has_significant_update(self, current: Dict[str, Any], existing: Dict[str, Any]) -> bool:
        """Check if repository has significant updates"""
        # Different update methods to check
        # For now, check if description or language has changed
        current_desc = current.get('description', '')
        existing_desc = existing.get('description', '')
        current_lang = current.get('language', '')
        existing_lang = existing.get('language', '')
        
        return (current_desc != existing_desc or 
                current_lang != existing_lang or
                current.get('stars', 0) != existing.get('stars', 0))
    
    def update_repository_data(self, repo: Dict[str, Any]) -> None:
        """Update or add repository data"""
        # Find existing repository
        for i, existing_repo in enumerate(self.repositories):
            if existing_repo['url'] == repo['url']:
                self.repositories[i] = repo
                return
        
        # Add new repository
        self.repositories.append(repo)
    
    def save_updated_data(self):
        """Save updated repository data"""
        data = {
            'total_repositories': len(self.repositories),
            'last_updated': datetime.now().isoformat(),
            'categories': self._categorize_repositories(),
            'repositories': self.repositories
        }
        
        with open(self.data_file, 'w', encoding='-utf-8') as f:
            json.dump(data, f, indent=2)
        
        print(f"💾 Updated repository database with {len(self.repositories)} repositories")
    
    def _categorize_repositories(self) -> Dict[str, List[Dict[str, Any]]]:
        """Categorize all repositories"""
        categories = {
            'mcp-servers': [],
            'ai-ml-tools': [],
            'development-tools': [],
            'mobile-tools': [],
            'security-tools': [],
            'utilities': []
        }
        
        for repo in self.repositories:
            category = self._determine_category(repo)
            if category in categories:
                categories[category].append(repo)
            else:
                categories['utilities'].append(repo)
        
        # Remove empty categories
        return {k: v for k, v in categories.items() if v}
    
    def _determine_category(self, repo: Dict[str, Any]) -> str:
        """Determine repository category based on content and tags"""
        name = repo.get('name', '').lower()
        description = repo.get('description', '').lower()
        
        # Priority categories in order of specificity
        category_map = {
            'mcp': 'mcp-servers',
            'ai': 'ai-ml-tools',
            'ml': 'ai-ml-tools',
            'ocr': 'ai-ml-tools',
            'development': 'development-tools',
            'mobile': 'mobile-tools',
            'ios': 'mobile-tools',
            'android': 'mobile-tools',
            'security': 'security-tools',
            'malware': 'security-tools',
            'reverse': 'security-tools',
            'cheat': 'security-tools',
            'game': 'mobile-tools',
            'game-development': 'mobile-tools',
            'utility': 'utilities',
            'file': 'utilities',
            'monitoring': 'utilities',
            'automation': 'utilities'
        }
        
        for keyword, category in category_map.items():
            if keyword in name or keyword in description:
                return category
        
        return 'utilities'
    
    def regenerate_wiki_pages(self):
        """Regenerate all wiki pages from updated repository data"""
        print("🔄 Regenerating wiki documentation...")
        
        categories = self._categorize_repositories()
        
        # Generate main index page
        self._generate_main_index(categories)
        
        # Generate category pages
        for category, repos in categories.items():
            self._generate_category_page(category, repos)
        
        print("✅ Wiki pages regenerated successfully")
    
    def _generate_main_index(self, categories: Dict[str, List[Dict[str, Any]]):
        """Generate main index page"""
        index_content = f"""# Alot1z's GitHub Repository Wiki

Welcome to the comprehensive documentation of all {len(self.repositories)} starred GitHub repositories by Alot1z. This wiki automatically updates when new repositories are starred or existing ones are updated.

## Repository Statistics

- **Total Repositories**: {len(self.repositories)}
- **Categories**: {len(categories)}
- **Last Updated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Repository Categories

"""
        
        for category, repos in categories.items():
            category_name = categories[category]['name']
            count = len(repos)
            description = categories[category]['description']
            
            index_content += f"### [{category_name}]({category.lower()}/) - {count} repositories\n"
            index_content += f"{description}\n\n"
        
        index_content += """
## Recent Updates

The wiki automatically updates when repositories are:
- Newly starred repositories
- Updated repositories
- License changes
- Significant activity

## Quick Links

- [Browse by Category](./categories/) - Browse repositories by category
- [Search Repository Database](../data/repositories.json) - Download raw data
- [Automation Scripts](../scripts/) - Automation and management tools

## Repository Quality Distribution

This wiki uses a quality scoring system (1-10) based on:
- Language popularity and ecosystem support
- License permissiveness and community adoption
- Update frequency and maintenance status
- Star count and community engagement
- Documentation quality and completeness

---
*Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*"""
        
        index_path = self.wiki_dir / "index.md"
        with open(index_path, 'w', encoding='utf-8') as f:
            f.write(index_content)
        
        print(f"📄 Generated main index: {index_path}")
    
    def _generate_category_page(self, category: str, repos: List[Dict[str, Any]]):
        """Generate category page"""
        category_name = categories[category]['name']
        description = categories[category]['description']
        
        category_content = f"""# {category_name}

{description}

## Repository List

"""
        
        # Sort by quality score
        sorted_repos = sorted(repos, key=lambda x: x.get('quality_score', 0), reverse=True)
        
        for repo in sorted_repos:
            quality_emoji = "⭐" if repo.get('quality_score', 0) >= 8 else "📖"
            
            category_content += f"{quality_emoji} [{repo['name']}]({repo['url']})\n"
            category_content += f"**Language**: {repo['language']} | **License**: {repo['license']}\n"
            category_content += f"**Stars**: {repo['stars']} | **Updated**: {repo['last_updated']}\n"
            category_content += f"{repo.get('description', 'No description available')}\n\n"
        
        category_content += f"""
---
*Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*

## Quality Scoring

Repositories are scored 1-10 based on:
- Language popularity (Python, JavaScript, TypeScript, etc.)
- License type (MIT, Apache 2.0, GPL, etc.)
- Update frequency and maintenance
- Star count and community engagement
- Description quality and completeness

"""
        
        category_dir = self.wiki_dir / "docs" / category
        category_dir.mkdir(parents=True, exist_ok=True)
        
        category_path = category_dir / "README.md"
        with open(category_path, 'w', encoding='utf-8') as f:
            f.write(category_content)
        
        print(f"📄 Generated category page: {category_path}")
    
    def run_scheduled_update(self):
        """Run the complete update process"""
        print("🔄 Starting scheduled repository update...")
        
        # Load existing data
        if not self.load_existing_data():
            print("⚠️ No existing data found, performing initial crawl")
            repositories = self.crawl_repositories()
            self.repositories = repositories
            self.save_updated_data()
        else:
            # Check for updates
            updates = self.check_for_updates()
            
            if any(updates.values()):
                print(f"🔄 Updates detected:")
                if updates['new_repositories']:
                    print(f"  🆕 New repositories: {len(updates['new_repositories'])}")
                if updates['updated_repositories']:
                    print(f"  🔄 Updated repositories: {len(updates['updated_repositories'])}")
                if updates['removed_repositories']:
                    print(f"  🗑️ Removed repositories: {len(updates['removed_repositories')}")
                
                # Update repository data
                for repo in updates['new_repositories']:
                    self.update_repository_data(repo)
                
                for repo in updates['updated_repositories']:
                    self.update_repository_data(repo)
                
                # Remove deleted repositories
                for repo in updates['removed_repositories']:
                    self.repositories = [r for r in self.repositories if r['url'] != repo['url']]
                
                # Save updated data
                self.save_updated_data()
                self.regenerate_wiki_pages()
                
                print(f"✅ Update completed: {len(self.repositories)} repositories")
            else:
                print("✅ No updates detected")
                print("✅ Repository database is up to date")
        
        print(f"📊 Database contains {len(self.repositories)} repositories")

def main():
    """Main update function"""
    data_file = "G:/GITHUB-REPOs/Alot1z.github.io/data/repositories.json"
    wiki_dir = "G:/GITHUB-REPOs/Alot1z.github.io"
    
    updater = RepositoryUpdater(data_file, wiki_dir)
    updater.run_scheduled_update()

if __name__name__ == "__main__":
    main()
