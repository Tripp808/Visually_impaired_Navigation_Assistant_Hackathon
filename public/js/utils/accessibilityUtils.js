/**
 * Accessibility Utility for haptic feedback and high contrast mode
 */
class AccessibilityUtility {
  constructor() {
    this.hapticFeedbackEnabled = true;
    this.highContrastEnabled = false;
  }
  
  setHapticFeedback(enabled) {
    this.hapticFeedbackEnabled = enabled;
  }
  
  setHighContrast(enabled) {
    this.highContrastEnabled = enabled;
    if (enabled) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }
  
  vibrate(pattern) {
    if (this.hapticFeedbackEnabled && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }
  
  // Simulate a button click with appropriate feedback
  simulateButtonPress() {
    if (this.hapticFeedbackEnabled && navigator.vibrate) {
      navigator.vibrate(50);
    }
  }
  
  // Alert for potential hazards with strong feedback
  alertHazard() {
    if (this.hapticFeedbackEnabled && navigator.vibrate) {
      // Strong vibration pattern for hazards
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
  }
}

const accessibilityUtils = new AccessibilityUtility();