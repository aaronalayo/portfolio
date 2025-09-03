// src/components/ModernCookieBanner.tsx
import React, { useState, useEffect } from 'react';

interface ModernCookieBannerProps {
  onAccept: () => void;
}

// Define the structure of our compliant consent record
interface ConsentRecord {
  consentId: string;
  timestamp: string;
  consentTextVersion: string;
  choices: {
    analytics: boolean;
  };
}

// Store the text in constants so we can version it
const CONSENT_TEXT_VERSION = "1.0";
const CONSENT_MAIN_TEXT = "We use cookies to analyze website traffic and enhance your browsing experience.";
const CONSENT_PREFERENCES_TEXT = "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously (e.g., via Google Analytics).";

const ModernCookieBanner: React.FC<ModernCookieBannerProps> = ({ onAccept }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  // On component mount, check if a valid consent record exists
  useEffect(() => {
    const consentString = localStorage.getItem('cookie_consent_record');
    if (!consentString) {
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // This is the new, compliant function to handle the user's action
  const handleAction = (analyticsChoice: boolean) => {
    setIsClosing(true); // Trigger the exit animation

    // Create the detailed consent record
    const newConsentRecord: ConsentRecord = {
      consentId: `consent-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      consentTextVersion: CONSENT_TEXT_VERSION,
      choices: {
        analytics: analyticsChoice,
      },
    };

    // Save the entire object as a JSON string
    localStorage.setItem('cookie_consent_record', JSON.stringify(newConsentRecord));

    // Wait for the animation to complete
    setTimeout(() => {
      setShowBanner(false);
      // If the user accepted analytics cookies, trigger the onAccept function
      if (analyticsChoice) {
        onAccept();
      }
    }, 500); // This duration must match your CSS transition duration
  };

  if (!showBanner) {
    return null;
  }

  // --- YOUR ORIGINAL, CORRECT JSX AND STYLING ARE RESTORED HERE ---
  return (
    <div
      className={`fixed bottom-4 left-4 z-[1000] w-full max-w-md transition-all duration-500 ease-in-out ${
        isClosing ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="bg-gray-900 text-white rounded-lg shadow-2xl p-6">
        {showPreferences ? (
          // --- PREFERENCES VIEW ---
          <div>
            <h3 className="text-lg font-bold mb-2">Cookie Preferences</h3>
            <p className="text-sm text-gray-300 mb-4">
              We use cookies to enhance your experience. You can choose which types of cookies to allow.
            </p>
            <div className="bg-gray-800 p-3 rounded-md">
              <label htmlFor="analytics-cookies" className="flex items-center justify-between cursor-pointer">
                <span className="font-semibold text-white">Analytics Cookies</span>
                <input
                  type="checkbox"
                  id="analytics-cookies"
                  className="h-4 w-4 rounded text-red-500 bg-gray-700 border-gray-600 focus:ring-red-500"
                  defaultChecked
                  disabled
                />
              </label>
              <p className="text-xs text-gray-400 mt-1">{CONSENT_PREFERENCES_TEXT}</p>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowPreferences(false)}
                className="text-sm font-semibold hover:text-gray-300 transition"
              >
                Back
              </button>
              <button
                // This button now correctly calls handleAction with `true`
                onClick={() => handleAction(true)}
                className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg text-sm"
              >
                Accept & Save
              </button>
            </div>
          </div>
        ) : (
          // --- MAIN VIEW ---
          <div>
            <h3 className="text-lg font-bold mb-2">This website uses cookies</h3>
            <p className="text-sm text-gray-300 mb-4">{CONSENT_MAIN_TEXT}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                // The "Accept" button now passes `true` for the analytics choice
                onClick={() => handleAction(true)}
                className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg text-sm w-full sm:w-auto"
              >
                Accept
              </button>
              <button
                // The "Decline" button now passes `false` for the analytics choice
                onClick={() => handleAction(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-sm w-full sm:w-auto"
              >
                Decline
              </button>
              <button
                onClick={() => setShowPreferences(true)}
                className="text-sm text-gray-400 hover:text-white underline transition w-full sm:w-auto text-center sm:ml-auto"
              >
                Customize
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernCookieBanner;