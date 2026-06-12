# 📖 PhishGuard AI - Installation Guide

## Quick Start (5 minutes)

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/phishguard-ai.git
cd phishguard-ai

# Start with Docker Compose
docker-compose up --build

# Access at http://localhost:5000
```

### Option 2: Manual Installation

#### Step 1: Backend Setup

```bash
# Clone repository
git clone https://github.com/yourusername/phishguard-ai.git
cd phishguard-ai

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your settings

# Initialize database
python -c "from database.models import Database; Database().init_db()"

# Train ML model (optional)
python model/train_model.py

# Run backend
python app.py
```

Backend runs at: `http://localhost:5000`

#### Step 2: Frontend Setup

```bash
# In a new terminal
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Detailed Installation

### Prerequisites

#### System Requirements
- **OS**: Linux, macOS, or Windows
- **RAM**: Minimum 2GB (4GB recommended)
- **Storage**: 1GB free space
- **Python**: 3.11 or higher
- **Node.js**: 20 or higher
- **npm**: 10 or higher

#### Check Versions

```bash
python --version  # Should be 3.11+
node --version    # Should be 20+
npm --version     # Should be 10+
```

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/phishguard-ai.git
cd phishguard-ai
```

### Step 2: Backend Installation

#### Create Virtual Environment

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**
```cmd
python -m venv venv
venv\Scripts\activate
```

#### Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### Configure Environment

```bash
cp .env.example .env
```

Edit `.env` file:

```env
# Required
SECRET_KEY=your-secret-key-here-make-it-long-and-random

# Database (SQLite for development)
DATABASE_URL=sqlite:///database/phishguard.db

# Optional API Keys (for enhanced detection)
VIRUSTOTAL_API_KEY=your-key-here
GOOGLE_SAFE_BROWSING_API_KEY=your-key-here
```

#### Initialize Database

```bash
python -c "from database.models import Database; db = Database(); db.init_db()"
```

#### Train ML Model (Optional)

```bash
python model/train_model.py
```

This creates a sample dataset and trains the model. For production, use a larger dataset.

#### Run Backend

```bash
python app.py
```

Or with Gunicorn (production):

```bash
gunicorn app:app --bind 0.0.0.0:5000 --workers 4
```

### Step 3: Frontend Installation

```bash
npm install
npm run dev
```

### Step 4: Verify Installation

1. Backend API: `http://localhost:5000/api`
2. Frontend: `http://localhost:5173`
3. Test API: `curl http://localhost:5000/api`

---

## API Keys Setup

### VirusTotal API

1. Go to [VirusTotal](https://www.virustotal.com/gui/join-us)
2. Create a free account
3. Go to Profile → API Key
4. Copy your API key
5. Add to `.env`: `VIRUSTOTAL_API_KEY=your-key`

**Free Tier**: 4 requests/minute, 500 requests/day

### Google Safe Browsing API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "Safe Browsing API"
4. Create API credentials
5. Copy API key
6. Add to `.env`: `GOOGLE_SAFE_BROWSING_API_KEY=your-key`

**Free Tier**: 10,000 requests/day

### PhishTank API

1. Go to [PhishTank](https://www.phishtank.com/api_info.php)
2. Register for API key
3. Add to `.env`: `PHISHTANK_API_KEY=your-key`

**Free Tier**: Unlimited

---

## Production Deployment

### Using Docker (Recommended)

```bash
# Build production image
docker build -t phishguard-ai:latest .

# Run with environment variables
docker run -d \
  -p 5000:5000 \
  -e SECRET_KEY=your-production-secret \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e VIRUSTOTAL_API_KEY=your-key \
  --name phishguard \
  phishguard-ai:latest
```

### Deploy to Render

1. Fork repository to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New Web Service"
4. Connect GitHub repository
5. Render auto-detects `render.yaml`
6. Add environment variables
7. Click "Create Web Service"

### Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# Add environment variables
railway variables set SECRET_KEY=your-secret
```

### Deploy to Heroku

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create phishguard-ai

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set SECRET_KEY=your-secret
heroku config:set VIRUSTOTAL_API_KEY=your-key

# Deploy
git push heroku main

# Open app
heroku open
```

---

## Database Setup

### SQLite (Development)

Default configuration, no setup needed.

### PostgreSQL (Production)

```bash
# Install PostgreSQL
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql

# Create database
sudo -u postgres createdb phishguard
sudo -u postgres createuser phishguard_user

# Set password
sudo -u postgres psql
ALTER USER phishguard_user WITH PASSWORD 'your-password';
\q

# Update .env
DATABASE_URL=postgresql://phishguard_user:your-password@localhost:5432/phishguard
```

---

## Chrome Extension Installation

### Development Mode

1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select `extensions/chrome_extension` folder

### Build Extension

```bash
cd extensions/chrome_extension
# Add icon files to icons/ folder
# icon16.png, icon48.png, icon128.png
```

### Publish to Chrome Web Store

1. Create ZIP file of extension folder
2. Go to [Chrome Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard)
3. Pay $5 registration fee
4. Upload ZIP
5. Fill in details
6. Submit for review

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000  # Linux/Mac
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 PID  # Linux/Mac
taskkill /PID PID /F  # Windows
```

### Database Connection Error

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql
```

### Module Not Found

```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### CORS Errors

Ensure backend CORS is enabled in `app.py`:

```python
from flask_cors import CORS
CORS(app)
```

---

## Performance Optimization

### Enable Caching

Add Redis for caching:

```bash
# Install Redis
sudo apt-get install redis-server

# Update .env
REDIS_URL=redis://localhost:6379
```

### Use CDN

Serve static files from CDN:
- Cloudflare
- AWS CloudFront
- Vercel Edge Network

### Database Indexing

```sql
CREATE INDEX idx_scans_user_id ON scans(user_id);
CREATE INDEX idx_scans_created_at ON scans(created_at);
CREATE INDEX idx_users_email ON users(email);
```

---

## Security Checklist

- [ ] Change default `SECRET_KEY`
- [ ] Use strong passwords
- [ ] Enable HTTPS in production
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Monitor API usage
- [ ] Implement rate limiting
- [ ] Enable CORS properly
- [ ] Use environment variables
- [ ] Regular backups

---

## Support

If you encounter issues:

1. Check [GitHub Issues](https://github.com/yourusername/phishguard-ai/issues)
2. Read [Documentation](https://docs.phishguard.ai)
3. Join [Discord Community](https://discord.gg/phishguard)
4. Email: support@phishguard.ai

---

## Next Steps

1. ✅ Install PhishGuard AI
2. ✅ Configure API keys
3. ✅ Train ML model
4. ✅ Create admin account
5. ✅ Deploy to production
6. ✅ Install Chrome extension
7. ✅ Set up monitoring
8. ✅ Configure backups

---

**Happy scanning! 🛡️**
