/**
 * Battery Utility for monitoring device battery status
 */
class BatteryUtility {
  constructor() {
    this.batteryManager = null;
    this.batteryLevel = 1.0;
    this.isCharging = false;
    this.alertsEnabled = true;
    this.lastAlertLevel = 1.0;
    
    this.initBattery();
  }
  
  async initBattery() {
    if ('getBattery' in navigator) {
      try {
        this.batteryManager = await navigator.getBattery();
        
        // Update initial values
        this.batteryLevel = this.batteryManager.level;
        this.isCharging = this.batteryManager.charging;
        
        // Add event listeners
        this.batteryManager.addEventListener('levelchange', () => {
          this.batteryLevel = this.batteryManager.level;
          this.checkBatteryStatus();
        });
        
        this.batteryManager.addEventListener('chargingchange', () => {
          this.isCharging = this.batteryManager.charging;
        });
      } catch (error) {
        console.error('Battery API not supported or permission denied:', error);
      }
    }
  }
  
  getBatteryLevel() {
    return this.batteryLevel;
  }
  
  isDeviceCharging() {
    return this.isCharging;
  }
  
  setBatteryAlerts(enabled) {
    this.alertsEnabled = enabled;
  }
  
  getBatteryStatus() {
    if (!this.batteryManager) {
      return 'Battery status unavailable';
    }
    
    const percentage = Math.round(this.batteryLevel * 100);
    const chargingStatus = this.isCharging ? 'charging' : 'not charging';
    
    return `Battery at ${percentage}% and ${chargingStatus}`;
  }
  
  checkBatteryStatus() {
    if (!this.alertsEnabled) return null;
    
    // Alert at 20%, 10%, and 5%
    const currentLevel = this.batteryLevel;
    
    if (currentLevel <= 0.05 && this.lastAlertLevel > 0.05) {
      this.lastAlertLevel = currentLevel;
      return 'Critical battery level. 5% remaining.';
    } else if (currentLevel <= 0.1 && this.lastAlertLevel > 0.1) {
      this.lastAlertLevel = currentLevel;
      return 'Low battery. 10% remaining.';
    } else if (currentLevel <= 0.2 && this.lastAlertLevel > 0.2) {
      this.lastAlertLevel = currentLevel;
      return 'Battery at 20%. Please charge soon.';
    }
    
    return null;
  }
}

const batteryUtils = new BatteryUtility();