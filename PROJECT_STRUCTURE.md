# 📁 PhishGuard AI - Project Structure

```
phishguard-ai/
│
├── 📄 README.md                    # Main documentation
├── 📄 INSTALLATION.md              # Detailed installation guide
├── 📄 requirements.txt             # Python dependencies
├── 📄 package.json                 # Node.js dependencies
├── 📄 config.py                    # Flask configuration
├── 📄 app.py                       # Main Flask application
├── 📄 .env.example                 # Environment variables template
├── 📄 .gitignore                   # Git ignore rules
├── 📄 Dockerfile                   # Docker configuration
├── 📄 docker-compose.yml           # Docker Compose setup
├── 📄 Procfile                     # Heroku deployment
├── 📄 render.yaml                  # Render deployment config
├── 📄 railway.json                 # Railway deployment config
│
├── 📂 database/                    # Database models
│   ├── __init__.py
│   └── models.py                   # SQLAlchemy models (SQLite/PostgreSQL)
│
├── 📂 model/                       # Machine Learning
│   ├── train_model.py              # Model training script
│   ├── phishing_model.pkl          # Trained model (generated)
│   └── dataset/                    # Training datasets
│       └── phishing_dataset.csv
│
├── 📂 utils/                       # Utility functions
│   ├── __init__.py
│   ├── feature_extractor.py        # URL feature extraction
│   ├── ssl_checker.py              # SSL certificate verification
│   ├── reputation_checker.py       # VirusTotal, Google Safe Browsing
│   └── pdf_generator.py            # PDF report generation
│
├── 📂 static/                      # Frontend build output
│   ├── index.html
│   ├── assets/
│   └── ...
│
├── 📂 src/                         # React frontend source
│   ├── main.tsx                    # React entry point
│   ├── App.tsx                     # Main app component
│   ├── index.css                   # Global styles
│   │
│   ├── 📂 components/              # Reusable components
│   │   ├── Navbar.tsx              # Navigation bar
│   │   ├── Footer.tsx              # Footer
│   │   ├── FeatureCard.tsx         # Feature showcase card
│   │   ├── StatCard.tsx            # Statistics card
│   │   └── RiskGauge.tsx           # Animated risk gauge
│   │
│   ├── 📂 pages/                   # Page components
│   │   ├── LandingPage.tsx         # Home page
│   │   ├── LoginPage.tsx           # User login
│   │   ├── RegisterPage.tsx        # User registration
│   │   ├── DashboardPage.tsx       # User dashboard
│   │   ├── ScanPage.tsx            # URL scanner
│   │   ├── ScanResultPage.tsx      # Scan results
│   │   ├── HistoryPage.tsx         # Scan history
│   │   ├── AnalyticsPage.tsx       # Analytics dashboard
│   │   ├── AdminPage.tsx           # Admin panel
│   │   └── ProfilePage.tsx         # User profile
│   │
│   ├── 📂 contexts/                # React contexts
│   │   └── ThemeContext.tsx        # Theme management
│   │
│   └── 📂 utils/                   # Frontend utilities
│       ├── cn.ts                   # Class name utility
│       ├── auth.ts                 # Authentication helpers
│       ├── storage.ts              # LocalStorage helpers
│       ├── urlAnalyzer.ts          # URL analysis logic
│       └── pdfGenerator.ts         # PDF generation
│
├── 📂 public/                      # Static assets
│   ├── robots.txt                  # SEO robots file
│   └── sitemap.xml                 # SEO sitemap
│
├── 📂 extensions/                  # Browser extensions
│   └── 📂 chrome_extension/        # Chrome extension
│       ├── manifest.json           # Extension manifest
│       ├── background.js           # Service worker
│       ├── content.js              # Content script
│       ├── popup.html              # Extension popup
│       ├── popup.js                # Popup logic
│       └── icons/                  # Extension icons
│           ├── icon16.png
│           ├── icon48.png
│           └── icon128.png
│
├── 📂 .github/                     # GitHub configuration
│   └── 📂 workflows/
│       └── ci.yml                  # CI/CD pipeline
│
├── 📂 database/                    # Database files (generated)
│   └── phishguard.db               # SQLite database
│
├── 📂 logs/                        # Application logs (generated)
│   └── phishguard.log
│
├── 📂 uploads/                     # File uploads (generated)
│
└── 📂 docs/                        # Additional documentation
    ├── API.md                      # API documentation
    ├── DEPLOYMENT.md               # Deployment guide
    └── CONTRIBUTING.md             # Contribution guidelines
```

---

## 📊 Key Files Overview

### Backend (Python/Flask)

| File | Purpose |
|------|---------|
| `app.py` | Main Flask application with all API routes |
| `config.py` | Configuration settings |
| `requirements.txt` | Python package dependencies |
| `database/models.py` | Database schema and ORM models |
| `model/train_model.py` | ML model training script |
| `utils/feature_extractor.py` | URL feature extraction |
| `utils/ssl_checker.py` | SSL certificate verification |
| `utils/reputation_checker.py` | Threat intelligence integration |
| `utils/pdf_generator.py` | PDF report generation |

### Frontend (React/TypeScript)

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app with routing |
| `src/pages/LandingPage.tsx` | Marketing landing page |
| `src/pages/DashboardPage.tsx` | User dashboard with charts |
| `src/pages/ScanPage.tsx` | URL scanner interface |
| `src/pages/ScanResultPage.tsx` | Detailed scan results |
| `src/pages/AnalyticsPage.tsx` | Analytics and statistics |
| `src/pages/AdminPage.tsx` | Admin control panel |
| `src/utils/urlAnalyzer.ts` | Client-side URL analysis |
| `src/components/RiskGauge.tsx` | Animated risk visualization |

### DevOps & Deployment

| File | Purpose |
|------|---------|
| `Dockerfile` | Container configuration |
| `docker-compose.yml` | Multi-container setup |
| `.github/workflows/ci.yml` | CI/CD pipeline |
| `render.yaml` | Render deployment config |
| `railway.json` | Railway deployment config |
| `Procfile` | Heroku deployment config |

### SEO & Marketing

| File | Purpose |
|------|---------|
| `index.html` | Meta tags, structured data |
| `public/robots.txt` | Search engine rules |
| `public/sitemap.xml` | Site structure for SEO |

### Browser Extension

| File | Purpose |
|------|---------|
| `extensions/chrome_extension/manifest.json` | Extension configuration |
| `extensions/chrome_extension/background.js` | Background service worker |
| `extensions/chrome_extension/content.js` | Page injection script |
| `extensions/chrome_extension/popup.html` | Extension popup UI |

---

## 🎯 Feature Mapping

### Authentication & Authorization
- **Backend**: `app.py` (JWT endpoints)
- **Frontend**: `src/utils/auth.ts`, `src/pages/LoginPage.tsx`, `src/pages/RegisterPage.tsx`

### URL Scanning
- **Backend**: `app.py` (scan endpoint), `utils/feature_extractor.py`, `utils/ssl_checker.py`, `utils/reputation_checker.py`
- **Frontend**: `src/pages/ScanPage.tsx`, `src/pages/ScanResultPage.tsx`, `src/utils/urlAnalyzer.ts`

### Machine Learning
- **Backend**: `model/train_model.py`, `model/phishing_model.pkl`
- **Features**: Random Forest, XGBoost, 20+ URL features

### Analytics & Charts
- **Frontend**: `src/pages/AnalyticsPage.tsx`, `src/pages/DashboardPage.tsx`
- **Library**: Recharts (Area, Bar, Pie charts)

### PDF Reports
- **Backend**: `utils/pdf_generator.py` (ReportLab)
- **Frontend**: `src/utils/pdfGenerator.ts` (jsPDF)

### Chrome Extension
- **Location**: `extensions/chrome_extension/`
- **Features**: Auto-scan, real-time alerts, popup UI

### Admin Panel
- **Frontend**: `src/pages/AdminPage.tsx`
- **Backend**: `app.py` (admin endpoints)

---

## 🚀 Quick Commands

### Development
```bash
# Backend
python app.py

# Frontend
npm run dev

# Docker
docker-compose up
```

### Production
```bash
# Build frontend
npm run build

# Run backend
gunicorn app:app --bind 0.0.0.0:5000

# Train model
python model/train_model.py
```

### Testing
```bash
# Backend tests
pytest tests/

# Frontend tests
npm test
```

### Deployment
```bash
# Docker
docker build -t phishguard-ai .

# Render
git push origin main  # Auto-deploy

# Railway
railway up
```

---

## 📦 Dependencies Summary

### Python (Backend)
- Flask 3.0 - Web framework
- SQLAlchemy - Database ORM
- scikit-learn - Machine learning
- XGBoost - Gradient boosting
- NumPy, Pandas - Data processing
- ReportLab - PDF generation
- python-whois - WHOIS lookup
- cryptography - Security
- PyJWT - Authentication

### Node.js (Frontend)
- React 19 - UI library
- TypeScript - Type safety
- Tailwind CSS v4 - Styling
- Framer Motion - Animations
- Recharts - Charts
- React Router - Routing
- Lucide React - Icons
- jsPDF - PDF generation

---

## 🔐 Security Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables (not in git) |
| `.env.example` | Template file |
| `.gitignore` | Prevents sensitive files from git |
| `config.py` | Security configuration |

---

## 📈 Scalability Considerations

### Horizontal Scaling
- Stateless Flask app (multiple workers)
- PostgreSQL for production database
- Redis for caching and sessions
- Load balancer (Nginx/HAProxy)

### Vertical Scaling
- Increase Gunicorn workers
- Add more CPU/RAM
- Use database connection pooling

### CDN Integration
- Serve static files from CDN
- Cache API responses
- Use edge computing

---

## 🎨 Customization Points

### Branding
- Logo: Update in `src/components/Navbar.tsx`
- Colors: Modify `src/index.css` theme variables
- Favicon: Update in `index.html`

### Features
- Add new scan features: `utils/feature_extractor.py`
- New chart types: `src/pages/AnalyticsPage.tsx`
- Additional APIs: `app.py`

### Integrations
- New threat APIs: `utils/reputation_checker.py`
- Email notifications: Add to `app.py`
- Webhooks: Create new endpoints

---

## 📝 File Naming Conventions

- **Python**: `snake_case.py`
- **React Components**: `PascalCase.tsx`
- **Utilities**: `camelCase.ts`
- **Config**: `kebab-case.yml`

---

**Total Files**: 60+
**Total Lines of Code**: 10,000+
**Languages**: Python, TypeScript, HTML, CSS, JavaScript, JSON, YAML, SQL

---

Built with ❤️ by PhishGuard AI Team
