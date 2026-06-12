/**
 * PhishGuard AI - Chrome Extension Content Script
 * Injects warning overlays on phishing websites
 */

(function() {
  'use strict';
  
  // Check if warning already shown
  if (document.getElementById('phishguard-warning')) {
    return;
  }
  
  // Get current tab URL
  const currentUrl = window.location.href;
  const tabId = Date.now(); // Temporary ID
  
  // Request scan result from background
  chrome.runtime.sendMessage(
    { action: 'getScanResult', tabId },
    (result) => {
      if (result && result.risk_score > 80) {
        showWarningOverlay(result);
      }
    }
  );
  
  // Show warning overlay
  function showWarningOverlay(result) {
    const overlay = document.createElement('div');
    overlay.id = 'phishguard-warning';
    overlay.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.95);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      ">
        <div style="
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 2px solid #ff3366;
          border-radius: 16px;
          padding: 40px;
          max-width: 500px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(255, 51, 102, 0.3);
        ">
          <div style="
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            background: rgba(255, 51, 102, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
          ">⚠️</div>
          
          <h1 style="
            color: #ff3366;
            font-size: 28px;
            margin: 0 0 16px 0;
            font-weight: 700;
          ">Phishing Detected!</h1>
          
          <p style="
            color: #e2e8f0;
            font-size: 16px;
            line-height: 1.6;
            margin: 0 0 24px 0;
          ">
            This website has been flagged as a potential phishing site. 
            It may attempt to steal your personal information.
          </p>
          
          <div style="
            background: rgba(255, 51, 102, 0.1);
            border: 1px solid rgba(255, 51, 102, 0.3);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 24px;
          ">
            <div style="color: #94a3b8; font-size: 14px; margin-bottom: 8px;">Risk Score</div>
            <div style="color: #ff3366; font-size: 32px; font-weight: 700;">${result.risk_score}/100</div>
            <div style="color: #ff3366; font-size: 14px; font-weight: 600; margin-top: 4px;">${result.category}</div>
          </div>
          
          <div style="display: flex; gap: 12px; justify-content: center;">
            <button id="phishguard-go-back" style="
              padding: 12px 24px;
              background: #00d4ff;
              color: #0a0e1a;
              border: none;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            ">← Go Back to Safety</button>
            
            <button id="phishguard-proceed" style="
              padding: 12px 24px;
              background: transparent;
              color: #94a3b8;
              border: 1px solid #475569;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            ">Proceed Anyway</button>
          </div>
          
          <p style="
            color: #64748b;
            font-size: 12px;
            margin: 20px 0 0 0;
          ">
            Protected by PhishGuard AI
          </p>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Add event listeners
    document.getElementById('phishguard-go-back').addEventListener('click', () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'https://www.google.com';
      }
    });
    
    document.getElementById('phishguard-proceed').addEventListener('click', () => {
      if (confirm('Are you sure you want to proceed? This site may be dangerous.')) {
        overlay.remove();
      }
    });
  }
})();
