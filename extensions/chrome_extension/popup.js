/**
 * PhishGuard AI - Chrome Extension Popup Script
 */

const contentDiv = document.getElementById('content');

// Initialize popup
async function init() {
  const { apiToken } = await chrome.storage.local.get(['apiToken']);
  
  if (!apiToken) {
    showLoginPrompt();
    return;
  }
  
  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab || !tab.url || tab.url.startsWith('chrome://')) {
    showInvalidTab();
    return;
  }
  
  // Get cached result
  const cacheKey = `result_${tab.id}`;
  const cached = await chrome.storage.local.get([cacheKey]);
  
  if (cached[cacheKey]) {
    showScanResult(cached[cacheKey], tab.url);
  } else {
    showScanButton(tab.url, tab.id);
  }
}

// Show login prompt
function showLoginPrompt() {
  contentDiv.innerHTML = `
    <div class="login-prompt">
      <div style="font-size: 48px; margin-bottom: 16px;">🔐</div>
      <h2 style="color: #e2e8f0; margin-bottom: 8px;">Sign In Required</h2>
      <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin-bottom: 20px;">
        Please sign in to your PhishGuard AI account to enable real-time protection.
      </p>
      <button class="login-button" id="login-btn">Sign In to PhishGuard</button>
      <p style="color: #64748b; font-size: 11px; margin-top: 12px;">
        Don't have an account? <a href="https://phishguard.ai/register" target="_blank" style="color: #00d4ff;">Sign up free</a>
      </p>
    </div>
  `;
  
  document.getElementById('login-btn').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://phishguard.ai/login' });
  });
}

// Show invalid tab message
function showInvalidTab() {
  contentDiv.innerHTML = `
    <div class="status-card">
      <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
      <p style="color: #94a3b8;">Cannot scan this page</p>
    </div>
  `;
}

// Show scan button
function showScanButton(url, tabId) {
  contentDiv.innerHTML = `
    <div class="url-display">${url}</div>
    <button class="scan-button" id="scan-btn">🔍 Scan This URL</button>
  `;
  
  document.getElementById('scan-btn').addEventListener('click', async () => {
    const btn = document.getElementById('scan-btn');
    btn.disabled = true;
    btn.innerHTML = '<span class="loading"></span> Scanning...';
    
    chrome.runtime.sendMessage(
      { action: 'scanUrl', url },
      async (response) => {
        if (response?.success) {
          // Get result from cache
          const cacheKey = `result_${tabId}`;
          const cached = await chrome.storage.local.get([cacheKey]);
          if (cached[cacheKey]) {
            showScanResult(cached[cacheKey], url);
          }
        }
      }
    );
  });
}

// Show scan result
function showScanResult(result, url) {
  const { risk_score, category, features, virus_total } = result;
  
  let scoreColor = '#00ff88';
  let statusBg = 'rgba(0, 255, 136, 0.1)';
  let statusColor = '#00ff88';
  
  if (risk_score <= 20) {
    scoreColor = '#00ff88';
  } else if (risk_score <= 40) {
    scoreColor = '#00d4ff';
    statusColor = '#00d4ff';
    statusBg = 'rgba(0, 212, 255, 0.1)';
  } else if (risk_score <= 60) {
    scoreColor = '#ffdd00';
    statusColor = '#ffdd00';
    statusBg = 'rgba(255, 221, 0, 0.1)';
  } else if (risk_score <= 80) {
    scoreColor = '#ffaa00';
    statusColor = '#ffaa00';
    statusBg = 'rgba(255, 170, 0, 0.1)';
  } else {
    scoreColor = '#ff3366';
    statusColor = '#ff3366';
    statusBg = 'rgba(255, 51, 102, 0.1)';
  }
  
  contentDiv.innerHTML = `
    <div class="url-display">${url}</div>
    
    <div class="status-card">
      <div class="risk-gauge">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8"/>
          <circle cx="60" cy="60" r="50" fill="none" stroke="${scoreColor}" stroke-width="8"
                  stroke-dasharray="${(risk_score / 100) * 314} 314"
                  stroke-linecap="round"
                  transform="rotate(-90 60 60)"/>
        </svg>
        <div class="risk-score">
          <div class="risk-number" style="color: ${scoreColor}">${risk_score}</div>
          <div class="risk-label">Risk Score</div>
        </div>
      </div>
      
      <div class="status-badge" style="background: ${statusBg}; color: ${statusColor}; border-color: ${statusColor}40;">
        ${category}
      </div>
    </div>
    
    <div class="features">
      <div class="feature">
        <div class="feature-label">URL Length</div>
        <div class="feature-value">${features?.url_length || 0} chars</div>
      </div>
      <div class="feature">
        <div class="feature-label">HTTPS</div>
        <div class="feature-value">${features?.has_https ? '✓ Yes' : '✗ No'}</div>
      </div>
      <div class="feature">
        <div class="feature-label">Detections</div>
        <div class="feature-value">${virus_total?.detections || 0}/${virus_total?.total_engines || 70}</div>
      </div>
      <div class="feature">
        <div class="feature-label">Reputation</div>
        <div class="feature-value">${virus_total?.reputation || 0}/100</div>
      </div>
    </div>
    
    <button class="scan-button" id="view-details">View Full Report</button>
  `;
  
  document.getElementById('view-details').addEventListener('click', () => {
    chrome.tabs.create({ url: `https://phishguard.ai/scan/${result.id}` });
  });
}

// Initialize
init();
