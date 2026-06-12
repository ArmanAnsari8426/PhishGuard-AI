/**
 * PhishGuard AI - Chrome Extension Background Script
 * Monitors tab navigation and scans URLs automatically
 */

const API_BASE_URL = 'https://api.phishguard.ai';

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Skip chrome internal pages
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      return;
    }
    
    scanUrl(tab.url, tabId);
  }
});

// Scan URL function
async function scanUrl(url, tabId) {
  try {
    // Get stored API token
    const { apiToken } = await chrome.storage.local.get(['apiToken']);
    
    if (!apiToken) {
      // User not logged in
      updateIcon(tabId, 'unknown');
      return;
    }
    
    // Check cache first
    const cacheKey = `scan_${btoa(url).slice(0, 50)}`;
    const cached = await chrome.storage.local.get([cacheKey]);
    
    if (cached[cacheKey]) {
      const { result, timestamp } = cached[cacheKey];
      const age = Date.now() - timestamp;
      
      // Use cache if less than 1 hour old
      if (age < 3600000) {
        handleScanResult(result, tabId);
        return;
      }
    }
    
    // Call API
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
      
      // Cache result
      await chrome.storage.local.set({
        [cacheKey]: {
          result,
          timestamp: Date.now()
        }
      });
      
      handleScanResult(result, tabId);
    } else {
      updateIcon(tabId, 'unknown');
    }
  } catch (error) {
    console.error('Scan error:', error);
    updateIcon(tabId, 'unknown');
  }
}

// Handle scan result
function handleScanResult(result, tabId) {
  const { risk_score, category } = result;
  
  // Update icon based on risk
  if (risk_score <= 20) {
    updateIcon(tabId, 'safe');
  } else if (risk_score <= 40) {
    updateIcon(tabId, 'low');
  } else if (risk_score <= 60) {
    updateIcon(tabId, 'suspicious');
  } else if (risk_score <= 80) {
    updateIcon(tabId, 'high');
  } else {
    updateIcon(tabId, 'phishing');
    showWarning(tabId, result);
  }
  
  // Store result for popup
  chrome.storage.local.set({
    [`result_${tabId}`]: result
  });
}

// Update extension icon
function updateIcon(tabId, status) {
  const iconPaths = {
    safe: {
      16: 'icons/safe16.png',
      48: 'icons/safe48.png',
      128: 'icons/safe128.png'
    },
    low: {
      16: 'icons/low16.png',
      48: 'icons/low48.png',
      128: 'icons/low128.png'
    },
    suspicious: {
      16: 'icons/suspicious16.png',
      48: 'icons/suspicious48.png',
      128: 'icons/suspicious128.png'
    },
    high: {
      16: 'icons/high16.png',
      48: 'icons/high48.png',
      128: 'icons/high128.png'
    },
    phishing: {
      16: 'icons/phishing16.png',
      48: 'icons/phishing48.png',
      128: 'icons/phishing128.png'
    },
    unknown: {
      16: 'icons/icon16.png',
      48: 'icons/icon48.png',
      128: 'icons/icon128.png'
    }
  };
  
  chrome.action.setIcon({
    tabId,
    path: iconPaths[status] || iconPaths.unknown
  });
}

// Show warning for phishing sites
function showWarning(tabId, result) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/phishing128.png',
    title: '⚠️ Phishing Detected!',
    message: `This website has been flagged as phishing (Risk Score: ${result.risk_score}/100). Proceed with caution!`,
    priority: 2
  });
  
  // Inject warning overlay
  chrome.scripting.executeScript({
    target: { tabId },
    files: ['content.js']
  });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scanUrl') {
    scanUrl(request.url, sender.tab?.id || 0).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.action === 'getScanResult') {
    chrome.storage.local.get([`result_${request.tabId}`], (data) => {
      sendResponse(data[`result_${request.tabId}`] || null);
    });
    return true;
  }
  
  if (request.action === 'setApiToken') {
    chrome.storage.local.set({ apiToken: request.token }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

console.log('PhishGuard AI Extension loaded');
