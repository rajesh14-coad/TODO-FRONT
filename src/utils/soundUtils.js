// Professional Sound Utility
// Generates short, professional notification sounds

class SoundGenerator {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  // Task Added - Short Ding (0.3s)
  playTaskAdded() {
    const duration = 0.3;
    const frequency = 800;
    this.playTone(frequency, duration, 0.3, 8);
  }

  // Task Completed - Celebratory Chime (0.5s)
  playTaskCompleted() {
    const notes = [523.25, 659.25, 783.99]; // C5 -> E5 -> G5
    const noteDuration = 0.15;

    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, noteDuration, 0.25, 5);
      }, index * noteDuration * 1000);
    });
  }

  // Goal Finished - Soft AI Chime (0.4s)
  playGoalFinished() {
    const duration = 0.4;
    const frequency = 880; // A5

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const oscillator2 = this.audioContext.createOscillator();

    oscillator.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator2.frequency.value = frequency * 2; // Harmonic

    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    oscillator.start(now);
    oscillator2.start(now);
    oscillator.stop(now + duration);
    oscillator2.stop(now + duration);
  }

  // Reminder - Minimalist Pulse (0.3s)
  playReminder() {
    const duration = 0.3;
    const frequency = 600;
    this.playTone(frequency, duration, 0.25, 10);
  }

  // Helper function to play a single tone
  playTone(frequency, duration, volume, decay) {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
  }
}

// Create singleton instance
const soundGenerator = new SoundGenerator();

// Export sound functions
export const playSound = (soundType) => {
  try {
    switch (soundType) {
      case 'task-added':
        soundGenerator.playTaskAdded();
        break;
      case 'task-completed':
        soundGenerator.playTaskCompleted();
        break;
      case 'goal-finished':
        soundGenerator.playGoalFinished();
        break;
      case 'reminder':
        soundGenerator.playReminder();
        break;
      default:
        console.warn(`Unknown sound type: ${soundType}`);
    }
  } catch (error) {
    console.error('Sound playback failed:', error);
  }
};

export default soundGenerator;
