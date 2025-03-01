/**
 * Settings Panel Component
 * Manages app settings
 */
class SettingsPanel {
  constructor() {
    this.panel = document.getElementById('settings-panel');
    this.closeButton = this.panel.querySelector('.close-button');
    this.saveButton = document.getElementById('save-settings');
    
    // Speech settings
    this.speechRateInput = document.getElementById('speech-rate');
    this.speechRateValue = document.getElementById('speech-rate-value');
    this.speechVolumeInput = document.getElementById('speech-volume');
    this.speechVolumeValue = document.getElementById('speech-volume-value');
    this.speechLanguageSelect = document.getElementById('speech-language');
    
    // Detection settings
    this.detectionThresholdInput = document.getElementById('detection-threshold');
    this.detectionThresholdValue = document.getElementById('detection-threshold-value');
    
    // Accessibility settings
    this.hapticFeedbackCheckbox = document.getElementById('haptic-feedback');
    this.highContrastCheckbox = document.getElementById('high-contrast');
    this.batteryAlertsCheckbox = document.getElementById('battery-alerts');
    
    // Emergency contacts
    this.contactsContainer = document.getElementById('contacts-container');
    this.newContactNameInput = document.getElementById('new-contact-name');
    this.newContactPhoneInput = document.getElementById('new-contact-phone');
    this.addContactButton = document.getElementById('add-contact-button');
    
    this.settings = null;
    this.onSaveCallback = null;
    
    this.setupEventListeners();
    this.populateLanguages();
  }
  
  setupEventListeners() {
    // Close button
    this.closeButton.addEventListener('click', () => {
      accessibilityUtils.simulateButtonPress();
      this.hide();
    });
    
    // Save button
    this.saveButton.addEventListener('click', () => {
      accessibilityUtils.simulateButtonPress();
      this.saveSettings();
    });
    
    // Speech rate input
    this.speechRateInput.addEventListener('input', () => {
      const value = parseFloat(this.speechRateInput.value);
      this.speechRateValue.textContent = value.toFixed(1);
    });
    
    // Speech volume input
    this.speechVolumeInput.addEventListener('input', () => {
      const value = parseFloat(this.speechVolumeInput.value);
      this.speechVolumeValue.textContent = value.toFixed(1);
    });
    
    // Detection threshold input
    this.detectionThresholdInput.addEventListener('input', () => {
      const value = parseFloat(this.detectionThresholdInput.value);
      this.detectionThresholdValue.textContent = `${Math.round(value * 100)}%`;
    });
    
    // Add contact button
    this.addContactButton.addEventListener('click', () => {
      accessibilityUtils.simulateButtonPress();
      this.addContact();
    });
  }
  
  populateLanguages() {
    if (!this.speechLanguageSelect) return;
    
    const languages = speechUtils.getAvailableLanguages();
    
    // Clear existing options
    this.speechLanguageSelect.innerHTML = '';
    
    // Add language options
    languages.forEach(lang => {
      const option = document.createElement('option');
      option.value = lang;
      option.textContent = lang;
      this.speechLanguageSelect.appendChild(option);
    });
  }
  
  loadSettings(settings) {
    this.settings = { ...settings };
    
    // Update UI with settings
    if (this.speechRateInput) {
      this.speechRateInput.value = this.settings.speech.rate;
      this.speechRateValue.textContent = this.settings.speech.rate.toFixed(1);
    }
    
    if (this.speechVolumeInput) {
      this.speechVolumeInput.value = this.settings.speech.volume;
      this.speechVolumeValue.textContent = this.settings.speech.volume.toFixed(1);
    }
    
    if (this.speechLanguageSelect) {
      this.speechLanguageSelect.value = this.settings.speech.language;
    }
    
    if (this.detectionThresholdInput) {
      this.detectionThresholdInput.value = this.settings.detectionThreshold;
      this.detectionThresholdValue.textContent = `${Math.round(this.settings.detectionThreshold * 100)}%`;
    }
    
    if (this.hapticFeedbackCheckbox) {
      this.hapticFeedbackCheckbox.checked = this.settings.hapticFeedback;
    }
    
    if (this.highContrastCheckbox) {
      this.highContrastCheckbox.checked = this.settings.highContrast;
    }
    
    if (this.batteryAlertsCheckbox) {
      this.batteryAlertsCheckbox.checked = this.settings.batteryAlerts;
    }
    
    this.renderContacts();
  }
  
  renderContacts() {
    if (!this.contactsContainer) return;
    
    // Clear previous contacts
    this.contactsContainer.innerHTML = '';
    
    // Add contacts
    this.settings.emergencyContacts.forEach((contact, index) => {
      const contactItem = document.createElement('div');
      contactItem.className = 'contact-item';
      
      contactItem.innerHTML = `
        <div class="contact-info">
          <p>${contact.name}</p>
          <p>${contact.phone}</p>
        </div>
        <button class="delete-button" data-index="${index}">
          <i data-feather="trash-2"></i>
        </button>
      `;
      
      this.contactsContainer.appendChild(contactItem);
      
      // Add delete button event listener
      const deleteButton = contactItem.querySelector('.delete-button');
      deleteButton.addEventListener('click', () => {
        accessibilityUtils.simulateButtonPress();
        this.removeContact(index);
      });
    });
    
    // Initialize feather icons
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  }
  
  addContact() {
    const name = this.newContactNameInput.value.trim();
    const phone = this.newContactPhoneInput.value.trim();
    
    if (!name || !phone) return;
    
    const newContact = {
      name,
      phone
    };
    
    this.settings.emergencyContacts.push(newContact);
    this.renderContacts();
    
    // Clear inputs
    this.newContactNameInput.value = '';
    this.newContactPhoneInput.value = '';
  }
  
  removeContact(index) {
    this.settings.emergencyContacts.splice(index, 1);
    this.renderContacts();
  }
  
  saveSettings() {
    // Update settings object with UI values
    this.settings.speech.rate = parseFloat(this.speechRateInput.value);
    this.settings.speech.volume = parseFloat(this.speechVolumeInput.value);
    this.settings.speech.language = this.speechLanguageSelect.value;
    this.settings.detectionThreshold = parseFloat(this.detectionThresholdInput.value);
    this.settings.hapticFeedback = this.hapticFeedbackCheckbox.checked;
    this.settings.highContrast = this.highContrastCheckbox.checked;
    this.settings.batteryAlerts = this.batteryAlertsCheckbox.checked;
    
    // Call save callback
    if (this.onSaveCallback) {
      this.onSaveCallback(this.settings);
    }
    
    // Hide panel
    this.hide();
  }
  
  setOnSaveCallback(callback) {
    this.onSaveCallback = callback;
  }
  
  show() {
    if (!this.panel) return;
    
    this.panel.classList.add('active');
    speechUtils.speak("Opening settings");
  }
  
  hide() {
    if (!this.panel) return;
    
    this.panel.classList.remove('active');
  }
}