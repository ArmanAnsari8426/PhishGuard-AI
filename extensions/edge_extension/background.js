/**
 * PhishGuard AI - Edge Extension Background Script
 * Compatible with Microsoft Edge (Chromium-based)
 */

const API_BASE_URL = 'https://api.phishguard.ai';

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    if (tab.url.startsWith('edge://') || tab.url.startsWith('chrome://')) {
      return;
    }
    scanUrl(tab.url, tabId);
  }
});

async function scanUrl(url, tabId) {
  try {
    const { apiToken } = await chrome.storage.local.get(['apiToken']);
    
    if (!apiToken) {
      updateIcon(tabId, 0);
      return;
    }
    
    const cacheKey = `scan_${btoa(url).slice(0, 50)}`;
    const cached = await chrome.storage.local.get([cacheKey]);
    
    if (cached[cacheKey]) {
      const { result, timestamp } = cached[cacheKey];
      if (Date.now() - timestamp < 3600000) {
        handleResult(result, tabId);
        return;
      }
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
      
      await chrome.storage.local.set({
        [cacheKey]: { result, timestamp: Date.now() }
      });
      
      handleResult(result, tabId);
    }
  } catch (error) {
    console.error('Scan error:', error);
  }
}

function handleResult(result, tabId) {
  updateIcon(tabId, result.risk_score);
  
  if (result.risk_score > 80) {
    showWarning(result);
  }
}

function updateIcon(tabId, riskScore) {
  let color;
  
  if (riskScore <= 20) color = '#00ff88';
  else if (riskScore <= 40) color = '#00d4ff';
  else if (riskScore <= 60) color = '#ffdd00';
  else if (riskScore <= 80) color = '#ffaa00';
  else color = '#ff3366';
  
  chrome.action.setIcon({
    tabId: tabId,
    path: {
      16: 'icons/icon16.png',
      48: 'icons/icon48.png',
      128: 'icons/icon128.png'
    }
  });
  
  chrome.action.setBadgeText({
    tabId: tabId,
    text: riskScore > 0 ? riskScore.toString() : ''
  });
  
  chrome.action.setBadgeBackgroundColor({
    tabId: tabId,
    color: color
  });
}

function showWarning(result) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: '⚠️ Phishing Detected!',
    message: `This website has been flagged as phishing (Risk: ${result.risk_score}/100). Proceed with caution!`,
    priority: 2
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scanUrl') {
    scanUrl(request.url, sender.tab?.id || 0);
    sendResponse({ success: true });
  }
  return true;
});

console.log('PhishGuard AI Edge Extension loaded');
