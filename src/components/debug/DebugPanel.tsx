'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

// Create a global array to store logs
declare global {
  interface Window {
    appLogs: string[];
    originalConsoleLog: typeof console.log;
    originalConsoleError: typeof console.error;
  }
}

// Initialize the logs array if it doesn't exist
if (typeof window !== 'undefined') {
  window.appLogs = window.appLogs || [];
  
  // Store original console methods if not already stored
  if (!window.originalConsoleLog) {
    window.originalConsoleLog = console.log;
    window.originalConsoleError = console.error;
    
    // Override console.log
    console.log = function(...args) {
      // Call the original console.log
      window.originalConsoleLog.apply(console, args);
      
      // Add the log to our array
      const logString = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      window.appLogs.push(`[LOG] ${new Date().toISOString()}: ${logString}`);
      
      // Keep only the last 100 logs
      if (window.appLogs.length > 100) {
        window.appLogs.shift();
      }
    };
    
    // Override console.error
    console.error = function(...args) {
      // Call the original console.error
      window.originalConsoleError.apply(console, args);
      
      // Add the error to our array
      const errorString = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      window.appLogs.push(`[ERROR] ${new Date().toISOString()}: ${errorString}`);
      
      // Keep only the last 100 logs
      if (window.appLogs.length > 100) {
        window.appLogs.shift();
      }
    };
  }
}

export default function DebugPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [filter, setFilter] = useState('');
  const [showDebugButton, setShowDebugButton] = useState(false);
  
  // Check URL parameter on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const debugParam = params.get('debug');
      setShowDebugButton(debugParam === 'true');
      
      // Listen for URL changes (for SPA navigation)
      const handleRouteChange = () => {
        const newParams = new URLSearchParams(window.location.search);
        const newDebugParam = newParams.get('debug');
        setShowDebugButton(newDebugParam === 'true');
      };
      
      // Add event listener for popstate (browser back/forward)
      window.addEventListener('popstate', handleRouteChange);
      
      // For Next.js client-side navigation
      const originalPushState = window.history.pushState;
      window.history.pushState = function(...args) {
        // Call the original function first
        originalPushState.apply(this, args);
        // Then call our handler
        handleRouteChange();
      };
      
      return () => {
        window.removeEventListener('popstate', handleRouteChange);
        // Restore original function
        window.history.pushState = originalPushState;
      };
    }
  }, []);
  
  // Update logs from global array
  useEffect(() => {
    const updateLogs = () => {
      if (typeof window !== 'undefined') {
        setLogs([...window.appLogs]);
      }
    };
    
    // Update logs immediately
    updateLogs();
    
    // Set up interval to update logs
    const interval = setInterval(updateLogs, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Filter logs based on search term
  const filteredLogs = logs.filter(log => 
    log.toLowerCase().includes(filter.toLowerCase())
  );
  
  // Don't render anything if debug mode is not enabled
  if (!showDebugButton) {
    return null;
  }
  
  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-md shadow-lg z-50"
      >
        Debug Logs
      </button>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Debug Logs</h2>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Filter logs..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 border rounded-md"
            />
            <button 
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          <pre className="text-xs font-mono whitespace-pre-wrap">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => (
                <div 
                  key={index} 
                  className={`py-1 ${log.includes('[ERROR]') ? 'text-red-600' : 'text-gray-800'}`}
                >
                  {log}
                </div>
              ))
            ) : (
              <div className="text-gray-500">No logs matching filter</div>
            )}
          </pre>
        </div>
        
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.appLogs = [];
                setLogs([]);
              }
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Clear Logs
          </button>
        </div>
      </div>
    </div>
  );
}
