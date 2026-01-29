import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Waveform = () => (
  <div className="flex items-center gap-1 h-4 px-2">
    {[1, 2, 3, 4, 5].map((i) => (
      <motion.div
        key={i}
        animate={{
          height: [4, 12, 4],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.1,
          ease: "easeInOut"
        }}
        className="w-1 bg-white rounded-full"
      />
    ))}
  </div>
);

const VoiceInput = ({ onSpeechEnd }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = 'hi-IN';
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => setIsListening(true);
      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onSpeechEnd(transcript);
        setIsListening(false);
      };

      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);

      setRecognition(rec);
    }
  }, [onSpeechEnd]);

  const toggleListening = () => {
    if (!recognition) {
      alert("Voice support not available.");
      return;
    }
    isListening ? recognition.stop() : recognition.start();
  };

  return (
    <div className="relative flex items-center">
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-full mr-2 bg-red-500 rounded-lg py-2 flex items-center shadow-lg"
          >
            <Waveform />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={toggleListening}
        className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center ${isListening
          ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]'
          : 'bg-zinc-800 hover:bg-zinc-700 border border-zinc-700'
          }`}
      >
        {isListening ? <MicOff className="text-white" size={20} /> : <Mic className="text-zinc-400" size={20} />}
      </button>
    </div>
  );
};

export default VoiceInput;