/**
 * PhishGuard AI - Firefox Extension Background Script
 */

const API_BASE_URL = 'https://api.phishguard.ai';

// Listen for tab updates
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    if (tab.url.startsWith('about:') || tab.url.startsWith('moz-extension://')) {
      return;
    }
    scanUrl(tab.url, tabId);
  }
});

async function scanUrl(url, tabId) {
  try {
    const { apiToken } = await browser.storage.local.get(['apiToken']);
    
    if (!apiToken) {
      return;
    }
    
    const response = await fetch(`${API_BASE_URL}/api/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      },
      body: JSON.stringify({ url })
    });
    
    if (response.ok) {
      const result = await response.json();
      updateIcon(tabId, result.risk_score);
      
      if (result.risk_score > 80) {
        showWarning(tabId, result);
      }
    }
  } catch (error) {
    console.error('Scan error:', error);
  }
}

function updateIcon(tabId, riskScore) {
  let icon, color;
  
  if (riskScore <= 20) {
    icon = 'icons/safe48.png';
    color = '#00ff88';
  } else if (riskScore <= 40) {
    icon = 'icons/low48.png';
    color = '#00d4ff';
  } else if (riskScore <= 60) {
    icon = 'icons/suspicious48.png';
    color = '#ffdd00';
  } else if (riskScore <= 80) {
    icon = 'icons/high48.png';
    color = '#ffaa00';
  } else {
    icon = 'icons/phishing48.png';
    color = '#ff3366';
  }
  
  browser.browserAction.setIcon({
    tabId: tabId,
    path: icon
  });
  
  browser.browserAction.setBadgeText({
    tabId: tabId,
    text: riskScore.toString()
  });
  
  browser.browserAction.setBadgeBackgroundColor({
    tabId: tabId,
    color: color
  });
}

function showWarning(tabId, result) {
  browser.notifications.create({
    type: 'basic',
    iconUrl: 'icons/phishing128.png',
    title: '⚠️ Phishing Detected!',
    message: `This website has been flagged as phishing (Risk: ${result.risk_score}/100)`
  });
}

console.log('PhishGuard AI Firefox Extension loaded');
