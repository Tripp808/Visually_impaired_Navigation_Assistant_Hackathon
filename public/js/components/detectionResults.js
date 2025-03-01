/**
 * Detection Results Component
 * Displays and speaks detected objects
 */
class DetectionResults {
  constructor() {
    this.resultsElement = document.getElementById('detection-results');
    this.objectsList = document.getElementById('objects-list');
    
    this.isActive = false;
    this.speakResults = true;
    this.lastSpokenTime = 0;
    this.speakInterval = 2000; // Minimum time between spoken results (2 seconds)
  }
  
  setActive(active) {
    this.isActive = active;
    if (!active) {
      this.clearResults();
    }
  }
  
  setSpeakResults(speak) {
    this.speakResults = speak;
  }
  
  updateResults(objects) {
    if (!this.isActive || !this.objectsList) return;
    
    // Clear previous results
    this.clearResults();
    
    // Add new results
    objects.forEach(obj => {
      const [, , width, height] = obj.bbox;
      const size = width * height;
      const distance = speechUtils.estimateDistance(size);
      
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <span>${obj.class}</span>
        <span>${distance} (${Math.round(obj.score * 100)}%)</span>
      `;
      
      this.objectsList.appendChild(listItem);
    });
    
    // Speak results if enabled
    this.speakDetectionResults(objects);
  }
  
  speakDetectionResults(objects) {
    if (!this.isActive || !this.speakResults || objects.length === 0) return;
    
    const now = Date.now();
    if (now - this.lastSpokenTime < this.speakInterval) return;
    
    // Prepare description of detected objects
    const objectDescriptions = objects
      .slice(0, 3) // Limit to top 3 objects to avoid information overload
      .map(obj => {
        const [, , width, height] = obj.bbox;
        const size = width * height;
        const distance = speechUtils.estimateDistance(size);
        return `${obj.class} ${distance}`;
      });
    
    // Check for potential hazards (objects very close to the user)
    const hazards = objects.filter(obj => {
      const [, , width, height] = obj.bbox;
      const size = width * height;
      return size > 0.4 && ['person', 'car', 'truck', 'bicycle', 'motorcycle'].includes(obj.class);
    });
    
    let speechText = '';
    
    if (hazards.length > 0) {
      // Priority alert for hazards
      speechText = `Caution! ${hazards[0].class} very close`;
      accessibilityUtils.alertHazard();
    } else if (objectDescriptions.length > 0) {
      // Normal description
      speechText = objectDescriptions.join(', ');
    }
    
    if (speechText) {
      speechUtils.speak(speechText, hazards.length > 0);
      this.lastSpokenTime = now;
    }
  }
  
  clearResults() {
    if (this.objectsList) {
      this.objectsList.innerHTML = '';
    }
  }
  
  show() {
    if (this.resultsElement) {
      this.resultsElement.classList.remove('hidden');
    }
  }
  
  hide() {
    if (this.resultsElement) {
      this.resultsElement.classList.add('hidden');
    }
  }
}