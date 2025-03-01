/**
 * Emergency Panel Component
 * Handles emergency contacts and location sharing
 */
class EmergencyPanel {
  constructor() {
    this.panel = document.getElementById('emergency-panel');
    this.contactsList = document.getElementById('emergency-contacts-list');
    this.messageBox = document.getElementById('emergency-message');
    this.shareLocationButton = document.getElementById('share-location-button');
    this.closeButton = this.panel.querySelector('.close-button');
    
    this.contacts = [];
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Close button
    this.closeButton.addEventListener('click', () => {
      accessibilityUtils.simulateButtonPress();
      this.hide();
    });
    
    // Share location button
    this.shareLocationButton.addEventListener('click', async () => {
      accessibilityUtils.simulateButtonPress();
      
      if (!locationUtils.isLocationEnabled()) {
        await locationUtils.enableLocationTracking();
      }
      
      const result = await locationUtils.shareLocation();
      this.showMessage(result);
      speechUtils.speak(result);
      
      // Send emergency alert
      locationUtils.sendEmergencyAlert();
    });
  }
  
  updateContacts(contacts) {
    this.contacts = contacts;
    this.renderContacts();
  }
  
  renderContacts() {
    if (!this.contactsList) return;
    
    // Clear previous contacts
    this.contactsList.innerHTML = '';
    
    if (this.contacts.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'No emergency contacts added. Add contacts in settings.';
      emptyMessage.className = 'text-light';
      this.contactsList.appendChild(emptyMessage);
      return;
    }
    
    // Add contacts
    this.contacts.forEach(contact => {
      const listItem = document.createElement('li');
      
      const button = document.createElement('button');
      button.className = 'contact-button';
      button.innerHTML = `
        <span>${contact.name}</span>
        <i data-feather="phone"></i>
      `;
      
      button.addEventListener('click', () => {
        accessibilityUtils.simulateButtonPress();
        this.callContact(contact);
      });
      
      listItem.appendChild(button);
      this.contactsList.appendChild(listItem);
    });
    
    // Initialize feather icons
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  }
  
  callContact(contact) {
    // Use tel: protocol to initiate a call
    window.location.href = `tel:${contact.phone}`;
    speechUtils.speak(`Calling ${contact.name}`);
  }
  
  showMessage(message) {
    if (!this.messageBox || !message) return;
    
    this.messageBox.textContent = message;
    this.messageBox.classList.remove('hidden');
  }
  
  clearMessage() {
    if (!this.messageBox) return;
    
    this.messageBox.textContent = '';
    this.messageBox.classList.add('hidden');
  }
  
  show() {
    if (!this.panel) return;
    
    this.panel.classList.add('active');
    this.clearMessage();
    speechUtils.speak("Emergency assistance activated");
  }
  
  hide() {
    if (!this.panel) return;
    
    this.panel.classList.remove('active');
  }
}