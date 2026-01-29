import React, { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const SettingsContext = createContext();

// 🎵 Premium Sound Library - Soothing & Motivating
export const soundOptions = {
  notification: [
    {
      label: 'Soft Chime',
      url: 'https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3',
      description: 'Gentle, peaceful chime'
    },
    {
      label: 'Gentle Beep',
      url: 'https://assets.mixkit.co/active_storage/sfx/2357/2357-preview.mp3',
      description: 'Soft double beep'
    },
    {
      label: 'Bird Chirp',
      url: 'https://assets.mixkit.co/active_storage/sfx/2462/2462-preview.mp3',
      description: 'Natural bird sound'
    },
  ],
  completion: [
    {
      label: 'Meditation Bowl',
      url: 'https://assets.mixkit.co/active_storage/sfx/2359/2359-preview.mp3',
      description: 'Calming bowl sound'
    },
    {
      label: 'Success Ping',
      url: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
      description: 'Satisfying completion'
    },
    {
      label: 'Peaceful Whoosh',
      url: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
      description: 'Smooth whoosh effect'
    },
  ],
};

export const SettingsProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useLocalStorage('sound_enabled', true);
  const [volume, setVolume] = useLocalStorage('sound_volume', 50); // 0-100
  const [notificationSound, setNotificationSound] = useLocalStorage(
    'notification_sound',
    soundOptions.notification[0].url
  );
  const [completionSound, setCompletionSound] = useLocalStorage(
    'completion_sound',
    soundOptions.completion[0].url
  );

  const playSound = (soundUrl) => {
    if (soundEnabled && soundUrl) {
      const audio = new Audio(soundUrl);
      audio.volume = volume / 100;
      audio.play().catch(e => console.error('Audio play failed:', e));
    }
  };

  const playNotificationSound = () => {
    playSound(notificationSound);
  };

  const playCompletionSound = () => {
    playSound(completionSound);
  };

  const playPreviewSound = (soundUrl) => {
    // Always play preview regardless of soundEnabled setting
    const audio = new Audio(soundUrl);
    audio.volume = volume / 100;
    audio.play().catch(e => console.error('Audio preview failed:', e));
  };

  return (
    <SettingsContext.Provider value={{
      soundEnabled,
      setSoundEnabled,
      volume,
      setVolume,
      notificationSound,
      setNotificationSound,
      completionSound,
      setCompletionSound,
      playNotificationSound,
      playCompletionSound,
      playPreviewSound,
      soundOptions,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
