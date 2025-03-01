/**
 * Camera View Component
 * Handles camera setup and object detection
 */
class CameraView {
  constructor() {
    this.videoElement = document.getElementById('video');
    this.canvasElement = document.getElementById('detection-canvas');
    this.loadingOverlay = document.getElementById('loading-overlay');
    this.cameraSwitchButton = document.getElementById('camera-switch');
    this.offlineIndicator = document.getElementById('offline-indicator');
    
    this.facingMode = 'environment'; // Start with back camera
    this.cameraStream = null;
    this.detectionActive = false;
    this.showBoundingBoxes = true;
    this.animationFrameId = null;
    this.lastDetectionTime = 0;
    this.detectionInterval = 500; // Detect every 500ms
    
    // Initialize
    this.setupEventListeners();
    this.checkOfflineStatus();
  }
  
  setupEventListeners() {
    // Camera switch button
    this.cameraSwitchButton.addEventListener('click', () => {
      accessibilityUtils.simulateButtonPress();
      this.toggleCamera();
    });
    
    // Check for online/offline status
    window.addEventListener('online', () => this.checkOfflineStatus());
    window.addEventListener('offline', () => this.checkOfflineStatus());
  }
  
  checkOfflineStatus() {
    if (navigator.onLine) {
      this.offlineIndicator.classList.add('hidden');
    } else {
      this.offlineIndicator.classList.remove('hidden');
    }
  }
  
  async setupCamera() {
    if (!this.videoElement) return false;
    
    try {
      // Stop any existing stream
      if (this.cameraStream) {
        this.cameraStream.getTracks().forEach(track => track.stop());
      }
      
      const constraints = {
        video: {
          facingMode: this.facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoElement.srcObject = stream;
      this.cameraStream = stream;
      
      return new Promise((resolve) => {
        this.videoElement.onloadedmetadata = () => {
          resolve(true);
        };
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      return false;
    }
  }
  
  toggleCamera() {
    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
    this.setupCamera();
  }
  
  async startDetection(onDetection) {
    this.showLoading(true);
    
    // Load detection model
    const modelLoaded = await detectionUtils.loadModel();
    if (!modelLoaded) {
      console.error('Failed to load detection model');
      return false;
    }
    
    // Setup camera
    const cameraSetup = await this.setupCamera();
    if (!cameraSetup) {
      console.error('Failed to setup camera');
      return false;
    }
    
    this.showLoading(false);
    this.detectionActive = true;
    
    // Start detection loop
    const detectFrame = async (timestamp) => {
      if (!this.detectionActive) return;
      
      if (timestamp - this.lastDetectionTime >= this.detectionInterval) {
        if (this.videoElement && this.videoElement.readyState === 4) {
          const objects = await detectionUtils.detectObjects(this.videoElement);
          onDetection(objects);
          this.lastDetectionTime = timestamp;
          
          // Draw bounding boxes if enabled
          if (this.showBoundingBoxes) {
            this.drawBoundingBoxes(objects);
          } else {
            this.clearCanvas();
          }
        }
      }
      
      this.animationFrameId = requestAnimationFrame(detectFrame);
    };
    
    this.animationFrameId = requestAnimationFrame(detectFrame);
    return true;
  }
  
  stopDetection() {
    this.detectionActive = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    // Stop camera stream
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
    }
    
    this.clearCanvas();
  }
  
  setShowBoundingBoxes(show) {
    this.showBoundingBoxes = show;
    if (!show) {
      this.clearCanvas();
    }
  }
  
  drawBoundingBoxes(objects) {
    if (!this.canvasElement || !this.videoElement) return;
    
    const ctx = this.canvasElement.getContext('2d');
    if (!ctx) return;
    
    // Match canvas size to video
    this.canvasElement.width = this.videoElement.videoWidth;
    this.canvasElement.height = this.videoElement.videoHeight;
    
    // Clear previous drawings
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    
    // Draw each bounding box
    objects.forEach(obj => {
      const [x, y, width, height] = obj.bbox;
      
      // Draw rectangle
      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);
      
      // Draw label
      ctx.fillStyle = '#00FFFF';
      ctx.font = '24px Arial';
      ctx.fillText(
        `${obj.class} (${Math.round(obj.score * 100)}%)`,
        x,
        y > 20 ? y - 5 : y + 25
      );
    });
  }
  
  clearCanvas() {
    if (!this.canvasElement) return;
    
    const ctx = this.canvasElement.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    }
  }
  
  showLoading(show) {
    if (show) {
      this.loadingOverlay.classList.remove('hidden');
    } else {
      this.loadingOverlay.classList.add('hidden');
    }
  }
}