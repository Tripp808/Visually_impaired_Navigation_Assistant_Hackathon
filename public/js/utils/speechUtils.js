/**
 * Speech Utility for text-to-speech functionality
 */
class SpeechUtility {
  constructor() {
    this.speechSynthesis = window.speechSynthesis;
    this.voices = [];
    this.settings = {
      rate: 1.0,
      volume: 1.0,
      language: 'en-US'
    };
    
    this.loadVoices();
    
    // Handle dynamic voice loading
    if (this.speechSynthesis.onvoiceschanged !== undefined) {
      this.speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    }
  }
  
  loadVoices() {
    this.voices = this.speechSynthesis.getVoices();
  }
  
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
  }
  
  speak(text, priority = false) {
    if (!text) return;
    
    // Cancel current speech if priority message
    if (priority && this.speechSynthesis.speaking) {
      this.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply settings
    utterance.rate = this.settings.rate;
    utterance.volume = this.settings.volume;
    utterance.lang = this.settings.language;
    
    // Find appropriate voice for the language
    const voice = this.voices.find(v => v.lang === this.settings.language);
    if (voice) {
      utterance.voice = voice;
    }
    
    this.speechSynthesis.speak(utterance);
  }
  
  stop() {
    if (this.speechSynthesis.speaking) {
      this.speechSynthesis.cancel();
    }
  }
  
  getAvailableLanguages() {
    const languages = new Set();
    this.voices.forEach(voice => {
      languages.add(voice.lang);
    });
    return Array.from(languages);
  }
  
  estimateDistance(objectSize) {
    // This is a simplified distance estimation
    if (objectSize > 0.5) return "very close";
    if (objectSize > 0.3) return "close";
    if (objectSize > 0.1) return "nearby";
    return "far away";
  }
}

const speechUtils = new SpeechUtility();