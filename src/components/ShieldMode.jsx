import React, { useState, useEffect, useRef } from 'react';
import { X, Pause, Play, PhoneOff, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ShieldMode = ({ goal, userName = 'Student', isMuted = false, onComplete, onExit }) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [voiceReady, setVoiceReady] = useState(false);
  const intervalRef = useRef(null);
  const hasAnnouncedStart = useRef(false);
  const hasAnnouncedMilestones = useRef(new Set());

  // Initialize voices on mount and unlock audio
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Load voices
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setVoiceReady(true);
        }
      };

      // Voices might load asynchronously
      if (window.speechSynthesis.getVoices().length > 0) {
        loadVoices();
      } else {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }

      // Unlock audio on first interaction (required by browsers)
      const unlockAudio = () => {
        const utterance = new SpeechSynthesisUtterance('');
        window.speechSynthesis.speak(utterance);
        window.speechSynthesis.cancel();
      };

      // Trigger unlock immediately (component mounts on user click)
      unlockAudio();
    }
  }, []);

  // Voice announcement function with Hindi/English support
  const speak = (text, language = 'hi-IN') => {
    if (isMuted || !voiceReady) return; // Don't speak if muted or not ready

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      utterance.volume = 1.0;
      utterance.lang = language;

      // Wait for voices to load
      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice =>
          (voice.lang.includes('hi') || voice.lang.includes('en-IN') || voice.lang.includes('en-US')) &&
          (voice.name.includes('Female') || voice.name.includes('Samantha') || voice.name.includes('Veena') || voice.name.includes('Karen'))
        );

        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        setVoice();
      } else {
        window.speechSynthesis.onvoiceschanged = setVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  // Start announcement with Hindi
  useEffect(() => {
    if (!hasAnnouncedStart.current) {
      speak(`Namaste ${userName}, aapka ${goal.name} shuru ho gaya hai. All the best, focus banaye rakhein!`, 'hi-IN');
      hasAnnouncedStart.current = true;
    }
  }, [goal.name, userName]);

  // Timer logic
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);

  // Milestone announcements
  useEffect(() => {
    const minutes = Math.floor(timeElapsed / 60);
    const milestones = [15, 30, 45, 60];

    milestones.forEach(milestone => {
      if (minutes === milestone && !hasAnnouncedMilestones.current.has(milestone)) {
        speak(`You've been focused for ${milestone} minutes. Keep going!`);
        hasAnnouncedMilestones.current.add(milestone);
      }
    });
  }, [timeElapsed]);

  const handleComplete = () => {
    const hours = Math.floor(timeElapsed / 3600);
    const minutes = Math.floor((timeElapsed % 3600) / 60);

    let timeText = '';
    if (hours > 0) {
      timeText = `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
      timeText = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }

    speak(`Shabaash ${userName}! Aapne ${goal.name} poora kar liya hai. Ab thoda rest kar lijiye.`, 'hi-IN');

    setTimeout(() => {
      onComplete(timeElapsed);
    }, 3000);
  };

  const handleExit = () => {
    if (timeElapsed > 60) {
      setShowExitConfirm(true);
    } else {
      onExit();
    }
  };

  const confirmExit = () => {
    handleComplete();
  };

  // Calculate circular progress
  const totalGoalSeconds = goal.totalTime * 3600;
  const progress = Math.min((timeElapsed / totalGoalSeconds) * 100, 100);
  const circumference = 2 * Math.PI * 140; // radius = 140
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Format time display
  const hours = Math.floor(timeElapsed / 3600);
  const minutes = Math.floor((timeElapsed % 3600) / 60);
  const seconds = timeElapsed % 60;

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Breathing Glow Effect - Edges */}
      <motion.div
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 100px 20px rgba(6, 182, 212, 0.3)',
        }}
      />

      {/* Subtle Mesh Gradient */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 30% 40%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)',
            'radial-gradient(circle at 70% 60%, rgba(14, 165, 233, 0.05) 0%, transparent 50%)',
            'radial-gradient(circle at 30% 40%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0"
      />

      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10">
        <button
          onClick={handleExit}
          className="p-3 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-3 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
        >
          {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-full px-6">
        {/* Goal Name */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-4xl font-bold text-white mb-12 text-center tracking-tight max-w-2xl"
        >
          {goal.name}
        </motion.h1>

        {/* Circular Progress Timer */}
        <div className="relative mb-12">
          {/* Outer Glow */}
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 rounded-full blur-3xl"
          />

          {/* SVG Circle */}
          <svg className="relative" width="320" height="320" viewBox="0 0 320 320">
            {/* Background Circle */}
            <circle
              cx="160"
              cy="160"
              r="140"
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="12"
            />

            {/* Progress Circle */}
            <motion.circle
              cx="160"
              cy="160"
              r="140"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 160 160)"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5 }}
            />

            {/* Gradient Definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
          </svg>

          {/* Timer Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl md:text-7xl font-bold text-white tabular-nums tracking-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            {isPaused && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-cyan-400 mt-4 text-lg font-medium"
              >
                Paused
              </motion.p>
            )}
          </div>
        </div>

        {/* Goal Description */}
        {goal.description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-400 text-base md:text-lg text-center max-w-xl mb-12"
          >
            {goal.description}
          </motion.p>
        )}

        {/* Voice Assistant Indicator */}
        <motion.div
          animate={{
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex items-center gap-3 text-cyan-400/60 mb-8"
        >
          <Mic className="w-4 h-4" />
          <span className="text-sm font-medium">Voice Assistant Active</span>
        </motion.div>

        {/* Phone Away Message */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex items-center gap-3 text-slate-500 mb-12"
        >
          <PhoneOff className="w-5 h-5" />
          <span className="text-sm md:text-base">Keep your phone away and stay focused</span>
        </motion.div>

        {/* Complete Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          onClick={handleComplete}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 transition-all"
        >
          Complete Session
        </motion.button>
      </div>

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110]"
              onClick={() => setShowExitConfirm(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[120] w-full max-w-md mx-4"
            >
              <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-3xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Save Your Progress?
                </h3>
                <p className="text-slate-400 mb-6">
                  You've been focused for {Math.floor(timeElapsed / 60)} minutes. Do you want to save this session?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowExitConfirm(false)}
                    className="flex-1 px-4 py-3 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                  >
                    Continue
                  </button>
                  <button
                    onClick={confirmExit}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all"
                  >
                    Save & Exit
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShieldMode;
