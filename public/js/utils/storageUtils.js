/**
 * Storage Utility for managing app settings and data
 */
class StorageUtility {
  constructor() {
    this.storageKey = 'openvision_settings';
    this.defaultSettings = {
      speech: {
        rate: 1.0,
        volume: 1.0,
        language: 'en-US'
      },
      detectionThreshold: 0.6,
      emergencyContacts: [
        { name: 'Emergency Services', phone: '911' }
      ],
      hapticFeedback: true,
      highContrast: false,
      batteryAlerts: true
    };
  }
  
  saveSettings(settings) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  }
  
  loadSettings() {
    try {
      const savedSettings = localStorage.getItem(this.storageKey);
      if (!savedSettings) {
        return this.defaultSettings;
      }
      
      return JSON.parse(savedSettings);
    } catch (error) {
      console.error('Failed to load settings:', error);
      return this.defaultSettings;
    }
  }
  
  clearSettings() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Failed to clear settings:', error);
      return false;
    }
  }
}

const storageUtils = new StorageUtility();