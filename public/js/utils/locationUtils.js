/**
 * Location Utility for GPS functionality
 */
class LocationUtility {
  constructor() {
    this.watchId = null;
    this.currentPosition = null;
    this.locationEnabled = false;
    this.socket = io();
  }
  
  async enableLocationTracking() {
    if (!navigator.geolocation) {
      return false;
    }
    
    try {
      // Request permission and get initial position
      this.currentPosition = await this.getCurrentPosition();
      
      // Start watching position
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          this.currentPosition = position;
          this.locationEnabled = true;
        },
        (error) => {
          console.error('Error getting location:', error);
          this.locationEnabled = false;
        },
        {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 27000
        }
      );
      
      return true;
    } catch (error) {
      console.error('Failed to enable location tracking:', error);
      return false;
    }
  }
  
  disableLocationTracking() {
    if (this.watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.locationEnabled = false;
    }
  }
  
  isLocationEnabled() {
    return this.locationEnabled;
  }
  
  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    });
  }
  
  getLocationString() {
    if (!this.currentPosition) {
      return 'Location unavailable';
    }
    
    const { latitude, longitude } = this.currentPosition.coords;
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }
  
  async shareLocation() {
    if (!this.currentPosition) {
      return 'Location unavailable';
    }
    
    const { latitude, longitude } = this.currentPosition.coords;
    const locationURL = `https://maps.google.com/?q=${latitude},${longitude}`;
    
    // Send location to server for emergency contacts
    this.socket.emit('location_update', {
      latitude,
      longitude,
      timestamp: new Date().toISOString()
    });
    
    // Try to use the Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Location',
          text: 'Here is my current location',
          url: locationURL
        });
        return 'Location shared successfully';
      } catch (error) {
        console.error('Error sharing location:', error);
      }
    }
    
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(locationURL);
      return 'Location copied to clipboard';
    } catch (error) {
      console.error('Failed to copy location to clipboard:', error);
      return locationURL;
    }
  }
  
  sendEmergencyAlert() {
    if (!this.currentPosition) {
      return false;
    }
    
    const { latitude, longitude } = this.currentPosition.coords;
    
    // Send emergency alert to server
    this.socket.emit('emergency_alert', {
      location: {
        latitude,
        longitude
      },
      timestamp: new Date().toISOString()
    });
    
    return true;
  }
}

const locationUtils = new LocationUtility();