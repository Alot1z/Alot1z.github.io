# Git Setup for GitHub Deployment

## Problem Analysis
The deploy script fails at the `git push` step because Git authentication is not properly configured. When you try to push to GitHub, Git should prompt for credentials, but it's not happening.

## Solution Options

### Option 1: SSH Key Setup (Recommended)

1. **Generate SSH Key:**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **Add SSH Key to SSH Agent:**
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

3. **Copy SSH Public Key:**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

4. **Add to GitHub:**
   - Go to GitHub.com
   - Settings > SSH and GPG keys
   - Click "New SSH key"
   - Paste the public key
   - Save

5. **Test Connection:**
   ```bash
   ssh -T git@github.com
   ```

### Option 2: HTTPS with Personal Access Token

1. **Create Personal Access Token:**
   - Go to GitHub.com > Settings > Developer settings > Personal access tokens
   - Click "Generate new token"
   - Select scopes: `repo`, `workflow`
   - Copy the token (you won't see it again)

2. **Update Remote URL:**
   ```bash
   git remote set-url origin https://github.com/Alot1z/Alot1z.github.io.git
   ```

3. **Configure Git Credential Helper:**
   ```bash
   git config --global credential.helper store
   ```

4. **Test Push:**
   ```bash
   git push origin main
   ```
   - Username: your GitHub username
   - Password: your personal access token (not your password)

### Option 3: GitHub CLI

1. **Install GitHub CLI:**
   ```bash
   winget install GitHub.cli
   ```

2. **Authenticate:**
   ```bash
   gh auth login
   ```

3. **Test Push:**
   ```bash
   git push origin main
   ```

## Quick Fix Steps

### For SSH Users:
```cmd
# Run this in your project directory
git remote set-url origin git@github.com:Alot1z/Alot1z.github.io.git

# Then run deploy script
deploy-simple.cmd
```

### For HTTPS Users:
```cmd
# Run this in your project directory  
git remote set-url origin https://github.com/Alot1z/Alot1z.github.io.git

# Configure Git to store credentials
git config --global credential.helper manager-core

# Then run deploy script
deploy-simple.cmd
```

## Troubleshooting

### If Git Still Doesn't Prompt for Credentials:

1. **Check Git Credential Manager:**
   ```cmd
   git config --global --list | findstr credential
   ```

2. **Clear Stored Credentials:**
   ```cmd
   git config --global --unset credential.helper
   git config --global --unset credential.helper
   ```

3. **Configure Windows Credential Manager:**
   ```cmd
   git config --global credential.helper manager-core
   ```

### If SSH Connection Fails:

1. **Check SSH Key:**
   ```cmd
   dir %USERPROFILE%\.ssh\
   ```

2. **Generate New SSH Key:**
   ```cmd
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

3. **Add to GitHub:**
   - Copy contents of `%USERPROFILE%\.ssh\id_ed25519.pub`
   - Add to GitHub SSH settings

### If Push Still Fails:

1. **Check Repository Access:**
   - Make sure you have push access to the repository
   - Check if you're a collaborator or owner

2. **Check Network:**
   - Ensure you can access github.com
   - Check if firewall blocks Git/SSH

3. **Check Remote URL:**
   ```cmd
   git remote -v
   ```
   - Verify the URL is correct

## Automated Solution

Run the setup script:
```cmd
setup-git.cmd
```

This will:
- Check current Git configuration
- Test GitHub connection
- Provide specific setup instructions based on your current setup
- Test push permissions

## Recommended Solution

For most Windows users, the **HTTPS with Personal Access Token** method is easiest:

1. Generate a Personal Access Token on GitHub
2. Update remote URL to HTTPS
3. Configure Git credential helper
4. Run deploy script - it should now prompt for username/token

## Next Steps

1. Run `setup-git.cmd` to diagnose your current setup
2. Follow the recommended solution based on the output
3. Test with `deploy-simple.cmd`
4. If successful, your website will be live at https://Alot1z.github.io

Remember: Personal Access Tokens should be treated like passwords - keep them secure!