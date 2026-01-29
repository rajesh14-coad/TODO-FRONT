import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, X, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const SearchBar = ({ value, onChange, onClear, onFocus, onVoiceResult }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isMac, setIsMac] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Detect if user is on Mac
        setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);

        // Keyboard shortcut handler
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('global-search')?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Initialize Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setIsListening(false);
                if (onVoiceResult) {
                    onVoiceResult(transcript);
                } else {
                    onChange(transcript);
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                toast.error('Voice recognition failed. Please try again.');
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onChange, onVoiceResult]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            toast.error('Voice recognition is not supported in this browser.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setIsListening(true);
            recognitionRef.current.start();
            toast.success('Listening...', { icon: '🎙️', duration: 2000 });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl"
        >
            <div
                className={`
          search-bar
          ${isFocused ? 'ring-2 ring-blue-500/50 dark:ring-indigo-500/50 shadow-lg' : ''}
          ${isListening ? 'ring-2 ring-red-500/50 shadow-md animate-pulse' : ''}
        `}
            >
                <Search className="w-5 h-5 text-slate-400" />

                <input
                    id="global-search"
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => {
                        setIsFocused(true);
                        onFocus?.();
                    }}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Search tasks..."
                    className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                />

                <div className="flex items-center gap-2">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleListening}
                        className={`p-2 rounded-lg transition-colors ${isListening
                            ? 'text-red-500 bg-red-500/10'
                            : 'text-slate-400 hover:text-blue-500 hover:bg-white/40 dark:hover:bg-white/10 dark:hover:text-white'
                            }`}
                        title={isListening ? 'Stop Listening' : 'Voice Search / Create Task'}
                    >
                        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </motion.button>

                    <AnimatePresence mode="wait">
                        {value ? (
                            <motion.button
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                onClick={onClear}
                                className="icon-btn p-1.5"
                            >
                                <X className="w-4 h-4" />
                            </motion.button>
                        ) : (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/60 dark:border-white/10"
                            >
                                {isMac ? (
                                    <Command className="w-3 h-3 text-slate-400" />
                                ) : (
                                    <span className="text-[10px] font-bold text-slate-400">CTRL</span>
                                )}
                                <span className="text-[10px] font-bold text-slate-400">K</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default SearchBar;
