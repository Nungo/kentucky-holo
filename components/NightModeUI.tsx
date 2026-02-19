'use client';

import { useStoryStore } from '@/store/useStoryStore';
import { Moon, Globe, Sparkles, ChefHat, Wheat, Loader2, Volume2, VolumeX, RotateCcw, Music, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const STORY_CATEGORIES = [
  { 
    id: 'colonel', 
    icon: ChefHat, 
    label: "The Colonel's Journey", 
    iconColor: 'text-purple-400',
    hoverColor: 'group-hover:text-purple-300'
  },
  { 
    id: 'recipe', 
    icon: Sparkles, 
    label: "Secret Recipe Mystery", 
    iconColor: 'text-blue-400',
    hoverColor: 'group-hover:text-blue-300'
  },
  { 
    id: 'farm', 
    icon: Wheat, 
    label: "From Farm to Bucket", 
    iconColor: 'text-green-400',
    hoverColor: 'group-hover:text-green-300'
  },
  { 
    id: 'world', 
    icon: Globe, 
    label: "Around the World", 
    iconColor: 'text-orange-400',
    hoverColor: 'group-hover:text-orange-300'
  },
];

export function NightModeUI() {
  const { currentStory, isGenerating, error, generateStory, clearStory } = useStoryStore();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [hologramMode, setHologramMode] = useState(false); // NEW: Hologram mode toggle
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const musicNodesRef = useRef<{
    oscillators: OscillatorNode[];
    gains: GainNode[];
  }>({ oscillators: [], gains: [] });

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };

    loadVoices();
    
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Create ambient music
  const createAmbientMusic = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    stopAmbientMusic();

    const frequencies = [
      { freq: 220, type: 'sine' as OscillatorType, volume: 0.03 },
      { freq: 330, type: 'sine' as OscillatorType, volume: 0.02 },
      { freq: 440, type: 'sine' as OscillatorType, volume: 0.025 },
      { freq: 523.25, type: 'sine' as OscillatorType, volume: 0.015 },
    ];

    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    frequencies.forEach(({ freq, type, volume }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      
      oscillators.push(osc);
      gains.push(gain);
    });

    musicNodesRef.current = { oscillators, gains };
  };

  const stopAmbientMusic = () => {
    const { oscillators, gains } = musicNodesRef.current;
    const ctx = audioContextRef.current;

    if (ctx && gains.length > 0) {
      gains.forEach(gain => {
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      });

      setTimeout(() => {
        oscillators.forEach(osc => {
          try {
            osc.stop();
          } catch (e) {}
        });
        musicNodesRef.current = { oscillators: [], gains: [] };
      }, 1000);
    }
  };

  const getFemaleVoice = () => {
    const voices = speechSynthesis.getVoices();
    
    const femaleNames = [
      'samantha',
      'victoria',
      'karen',
      'serena',
      'tessa',
      'moira',
      'fiona',
      'microsoft zira',
      'google us english female',
      'google uk english female',
      'female',
    ];

    for (const keyword of femaleNames) {
      const voice = voices.find(v => v.name.toLowerCase().includes(keyword));
      if (voice) {
        return voice;
      }
    }

    const ukVoice = voices.find(v => 
      v.lang.includes('en-GB') || 
      v.lang.includes('en-AU')
    );
    if (ukVoice) {
      return ukVoice;
    }

    const usVoice = voices.find(v => v.lang.includes('en-US'));
    if (usVoice) {
      return usVoice;
    }

    return voices[0];
  };

  const cleanupTypewriter = () => {
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setIsTyping(false);
  };

  const cleanupSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const cleanupMusic = () => {
    stopAmbientMusic();
  };

  const startSpeech = (text: string) => {
    if ('speechSynthesis' in window && voicesLoaded) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      const femaleVoice = getFemaleVoice();
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      utterance.rate = 0.7;
      utterance.pitch = 1.2;
      utterance.volume = 0.85;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => setIsSpeaking(false);
      
      utteranceRef.current = utterance;
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    cleanupTypewriter();
    setDisplayedText('');

    if (currentStory) {
      setIsTyping(true);
      let index = 0;
      const text = currentStory.content;

      typingTimerRef.current = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          cleanupTypewriter();
        }
      }, 30);

      if (musicEnabled) {
        createAmbientMusic();
      }

      setTimeout(() => {
        startSpeech(text);
      }, 100);
    } else {
      cleanupMusic();
    }

    return () => {
      cleanupTypewriter();
      cleanupSpeech();
      cleanupMusic();
    };
  }, [currentStory?.content, voicesLoaded]);

  useEffect(() => {
    if (currentStory) {
      if (musicEnabled) {
        createAmbientMusic();
      } else {
        stopAmbientMusic();
      }
    }
  }, [musicEnabled]);

  const toggleSpeech = () => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.pause();
      setIsSpeaking(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsSpeaking(true);
      }
    }
  };

  const replayAudio = () => {
    if (currentStory) {
      cleanupSpeech();
      setTimeout(() => {
        startSpeech(currentStory.content);
      }, 100);
    }
  };

  const toggleMusic = () => {
    setMusicEnabled(!musicEnabled);
  };

  const handleClearStory = () => {
    cleanupTypewriter();
    cleanupSpeech();
    cleanupMusic();
    clearStory();
  };

  // HOLOGRAM MODE: Hide text, show only visuals + audio
  if (currentStory && hologramMode) {
    return (
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        {/* Minimal controls for hologram mode */}
        <button
          onClick={() => setHologramMode(false)}
          className="p-3 rounded-full bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 transition-all backdrop-blur-sm"
          title="Show text"
        >
          <Eye className="w-5 h-5 text-purple-400" />
        </button>
        <button
          onClick={handleClearStory}
          className="p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 transition-all backdrop-blur-sm text-white text-sm px-4"
        >
          Exit Story
        </button>
      </div>
    );
  }

  // NORMAL MODE: Show full text popup
  if (currentStory) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center p-4 sm:p-8">
        <div className="bg-black/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {currentStory.title}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {/* Hologram Mode Toggle */}
              <button
                onClick={() => setHologramMode(true)}
                className="text-gray-400 hover:text-white transition-colors"
                title="Hologram mode (hide text)"
              >
                <EyeOff className="w-5 h-5" />
              </button>
              <button
                onClick={toggleSpeech}
                className="text-gray-400 hover:text-white transition-colors"
                title={isSpeaking ? "Pause voice" : "Play voice"}
              >
                {isSpeaking ? (
                  <Volume2 className="w-5 h-5 text-purple-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-purple-400" />
                )}
              </button>
              <button
                onClick={replayAudio}
                className="text-gray-400 hover:text-white transition-colors"
                title="Replay story audio"
              >
                <RotateCcw className="w-5 h-5 text-blue-400" />
              </button>
              <button
                onClick={toggleMusic}
                className="text-gray-400 hover:text-white transition-colors"
                title={musicEnabled ? "Music on" : "Music off"}
              >
                <Music className={`w-5 h-5 ${musicEnabled ? 'text-green-400' : 'text-gray-400'}`} />
              </button>
              <button
                onClick={handleClearStory}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>

          <div className="text-gray-300 text-base sm:text-lg leading-relaxed space-y-4 min-h-[200px] max-h-[400px] overflow-y-auto">
            {displayedText.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            {isTyping && (
              <span className="inline-block w-1 h-5 bg-purple-400 animate-pulse ml-1" />
            )}
          </div>

          <div className="mt-4 text-center text-xs text-gray-400">
            {isSpeaking && "🎙️ Reading story..."}
            {!isSpeaking && !isTyping && "✨ Story complete • Click 👁️ for hologram mode"}
          </div>

          <button
            onClick={handleClearStory}
            className="mt-6 w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 px-6 py-3 rounded-xl transition-all border border-purple-500/30"
          >
            Choose Another Story
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="absolute top-4 sm:top-8 left-1/2 transform -translate-x-1/2 z-10 text-center px-4">
        <div className="bg-black/60 backdrop-blur-md rounded-2xl px-6 sm:px-8 py-3 sm:py-4 border border-white/10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">Kentucky Stories</h2>
          <p className="text-gray-400 text-xs sm:text-sm">Choose a bedtime story</p>
        </div>
      </div>

      <div className="absolute bottom-20 sm:bottom-24 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-3xl px-4 sm:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {STORY_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => generateStory(category.id as any)}
                disabled={isGenerating}
                className={`
                  bg-black/60 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10
                  hover:bg-black/80 hover:border-white/20 transition-all
                  flex flex-col items-center gap-2 sm:gap-3 group
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${category.iconColor} ${category.hoverColor} transition-all group-hover:scale-110`} />
                <span className="text-white text-xs sm:text-sm text-center font-medium">
                  {category.label}
                </span>
              </button>
            );
          })}
        </div>

        {isGenerating && (
          <div className="mt-4 sm:mt-6 bg-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/10 text-center">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 animate-spin mx-auto mb-3" />
            <p className="text-white text-sm sm:text-base">Generating your story...</p>
          </div>
        )}

        {error && (
          <div className="mt-4 sm:mt-6 bg-red-500/20 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-red-500/30 text-center">
            <p className="text-red-300 text-sm sm:text-base">{error}</p>
          </div>
        )}
      </div>
    </>
  );
}