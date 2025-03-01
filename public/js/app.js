/**
 * Main Application
 * Initializes and coordinates all components
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Feather icons
  feather.replace();
  
  // Initialize socket.io connection
  const socket = io();
  
  // App state
  let appStarted = false;
  let speakEnabled = true;
  let voiceCommandsEnabled = false;
  let showBoundingBoxes = true;
  
  // Load settings
  const settings = storageUtils.loadSettings();
  
  // Initialize components
  const cameraView = new CameraView();
  const detectionResults = new DetectionResults();
  const emergencyPanel = new EmergencyPanel();
  const settingsPanel = new SettingsPanel();
  
  // Apply initial settings
  speechUtils.updateSettings(settings.speech);
  detectionUtils.setDetectionThreshold(settings.detectionThreshold);
  accessibilityUtils.setHapticFeedback(settings.hapticFeedback);
  accessibilityUtils.setHighContrast(settings.highContrast);
  batteryUtils.setBatteryAlerts(settings.batteryAlerts);
  
  // Update emergency contacts
  emergencyPanel.updateContacts(settings.emergencyContacts);
  
  // Set settings panel save callback
  settingsPanel.setOnSaveCallback(handleSaveSettings);
  
  // Get DOM elements
  const welcomeScreen = document.getElementById('welcome-screen');
  const mainScreen = document.getElementById('main-screen');
  const startButton = document.getElementById('start-button');
  const toggleSpeechButton = document.getElementById('toggle-speech');
  const toggleVoiceCommandsButton = document.getElementById('toggle-voice-commands');
  const batteryStatusButton = document.getElementById('battery-status');
  const locationStatusButton = document.getElementById('location-status');
  const emergencyButton = document.getElementById('emergency-button');
  const toggleContrastButton = document.getElementById('toggle-contrast');
  const settingsButton = document.getElementById('settings-button');
  
  // Setup event listeners
  startButton.addEventListener('click', startApp);
  toggleSpeechButton.addEventListener('click', handleToggleSpeech);
  toggleVoiceCommandsButton.addEventListener('click', handleToggleVoiceCommands);
  batteryStatusButton.addEventListener('click', handleBatteryStatus);
  locationStatusButton.addEventListener('click', handleLocationStatus);
  emergencyButton.addEventListener('click', handleEmergencyAssistance);
  toggleContrastButton.addEventListener('click', handleToggleHighContrast);
  settingsButton.addEventListener('click', handleOpenSettings);
  
  // Start app
  function startApp() {
    accessibilityUtils.simulateButtonPress();
    
    // Hide welcome screen, show main screen
    welcomeScreen.classList.remove('active');
    mainScreen.classList.add('active');
    
    // Start detection
    cameraView.startDetection(handleDetection);
    
    // Initialize voice commands
    setupVoiceCommands();
    
    // Set app started
    appStarted = true;
    
    // Welcome message
    speechUtils.speak("OpenVision started. Ready to assist you.");
  }
  
  // Handle object detection
  function handleDetection(objects) {
    detectionResults.updateResults(objects);
  }
  
  // Toggle speech
  function handleToggleSpeech() {
    accessibilityUtils.simulateButtonPress();
    
    speakEnabled = !speakEnabled;
    detectionResults.setSpeakResults(speakEnabled);
    
    // Update button state
    toggleSpeechButton.classList.toggle('active', speakEnabled);
    toggleSpeechButton.innerHTML = speakEnabled ? 
      '<i data-feather="volume-2"></i>' : 
      '<i data-feather="volume-x"></i>';
    
    // Initialize icons
    feather.replace();
    
    // Announce state change
    speechUtils.speak(speakEnabled ? "Speech enabled" : "Speech disabled");
  }
  
  // Toggle voice commands
  function handleToggleVoiceCommands() {
    accessibilityUtils.simulateButtonPress();
    
    voiceCommandsEnabled = !voiceCommandsEnabled;
    
    if (voiceCommandsEnabled) {
      const success = voiceCommandUtils.startListening();
      if (!success) {
        voiceCommandsEnabled = false;
        speechUtils.speak("Voice commands are not supported in this browser");
      } else {
        speechUtils.speak("Voice commands activated");
      }
    } else {
      voiceCommandUtils.stopListening();
      speechUtils.speak("Voice commands deactivated");
    }
    
    // Update button state
    toggleVoiceCommandsButton.classList.toggle('active', voiceCommandsEnabled);
    toggleVoiceCommandsButton.innerHTML = voiceCommandsEnabled ? 
      '<i data-feather="mic"></i>' : 
      '<i data-feather="mic-off"></i>';
    
    // Initialize icons
    feather.replace();
  }
  
  // Announce battery status
  function handleBatteryStatus() {
    accessibilityUtils.simulateButtonPress();
    
    const status = batteryUtils.getBatteryStatus();
    speechUtils.speak(status);
  }
  
  // Announce location
  async function handleLocationStatus() {
    accessibilityUtils.simulateButtonPress();
    
    if (!locationUtils.isLocationEnabled()) {
      await locationUtils.enableLocationTracking();
    }
    
    const locationString = locationUtils.getLocationString();
    speechUtils.speak(`Your current location is ${locationString}`);
  }
  
  // Show emergency panel
  function handleEmergencyAssistance() {
    accessibilityUtils.simulateButtonPress();
    emergencyPanel.show();
  }
  
  // Toggle high contrast mode
  function handleToggleHighContrast() {
    accessibilityUtils.simulateButtonPress();
    
    const newValue = !settings.highContrast;
    settings.highContrast = newValue;
    
    accessibilityUtils.setHighContrast(newValue);
    storageUtils.saveSettings(settings);
    
    speechUtils.speak(newValue ? "High contrast mode enabled" : "High contrast mode disabled");
  }
  
  // Show settings panel
  function handleOpenSettings() {
    accessibilityUtils.simulateButtonPress();
    
    // Load current settings
    settingsPanel.loadSettings(settings);
    settingsPanel.show();
  }
  
  // Save settings
  function handleSaveSettings(newSettings) {
    // Apply settings
    speechUtils.updateSettings(newSettings.speech);
    detectionUtils.setDetectionThreshold(newSettings.detectionThreshold);
    accessibilityUtils.setHapticFeedback(newSettings.hapticFeedback);
    accessibilityUtils.setHighContrast(newSettings.highContrast);
    batteryUtils.setBatteryAlerts(newSettings.batteryAlerts);
    
    // Update emergency contacts
    emergencyPanel.updateContacts(newSettings.emergencyContacts);
    
    // Save settings
    settings = { ...newSettings };
    storageUtils.saveSettings(settings);
    
    // Announce
    speechUtils.speak("Settings saved");
  }
  
  // Setup voice commands
  function setupVoiceCommands() {
    // Register voice commands
    voiceCommandUtils.registerCommand('start speaking', () => {
      if (!speakEnabled) {
        handleToggleSpeech();
      }
    });
    
    voiceCommandUtils.registerCommand('stop speaking', () => {
      if (speakEnabled) {
        handleToggleSpeech();
      }
    });
    
    voiceCommandUtils.registerCommand('emergency', () => {
      handleEmergencyAssistance();
    });
    
    voiceCommandUtils.registerCommand('settings', () => {
      handleOpenSettings();
    });
    
    voiceCommandUtils.registerCommand('toggle boxes', () => {
      showBoundingBoxes = !showBoundingBoxes;
      cameraView.setShowBoundingBoxes(showBoundingBoxes);
      speechUtils.speak(showBoundingBoxes ? "Bounding boxes shown" : "Bounding boxes hidden");
    });
    
    voiceCommandUtils.registerCommand('battery', () => {
      handleBatteryStatus();
    });
    
    voiceCommandUtils.registerCommand('location', () => {
      handleLocationStatus();
    });
    
    voiceCommandUtils.registerCommand('high contrast', () => {
      handleToggleHighContrast();
    });
  }
  
  // Handle socket.io events
  socket.on('connect', () => {
    console.log('Connected to server');
  });
  
  socket.on('emergency_notification', (data) => {
    console.log('Emergency notification received:', data);
    // Could display a notification to the user
  });
});