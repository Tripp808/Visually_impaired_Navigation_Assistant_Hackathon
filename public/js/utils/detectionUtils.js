/**
 * Detection Utility for object detection using TensorFlow.js
 */
class DetectionUtility {
  constructor() {
    this.model = null;
    this.isModelLoading = false;
    this.detectionThreshold = 0.6;
  }
  
  async loadModel() {
    if (this.model || this.isModelLoading) return;
    
    try {
      this.isModelLoading = true;
      // Load TensorFlow.js model
      this.model = await cocoSsd.load({
        base: 'lite_mobilenet_v2' // Using a lightweight model for better performance
      });
      this.isModelLoading = false;
      return true;
    } catch (error) {
      console.error('Failed to load object detection model:', error);
      this.isModelLoading = false;
      return false;
    }
  }
  
  setDetectionThreshold(threshold) {
    this.detectionThreshold = Math.max(0.1, Math.min(threshold, 1.0));
  }
  
  async detectObjects(video) {
    if (!this.model) {
      await this.loadModel();
      if (!this.model) return [];
    }
    
    try {
      // Perform detection
      const predictions = await this.model.detect(video);
      
      // Filter predictions based on confidence threshold
      return predictions
        .filter(prediction => prediction.score >= this.detectionThreshold)
        .map(prediction => ({
          bbox: prediction.bbox,
          class: prediction.class,
          score: prediction.score
        }));
    } catch (error) {
      console.error('Error during object detection:', error);
      return [];
    }
  }
  
  isLoaded() {
    return !!this.model && !this.isModelLoading;
  }
  
  isLoading() {
    return this.isModelLoading;
  }
}

const detectionUtils = new DetectionUtility();