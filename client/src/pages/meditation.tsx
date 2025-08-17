import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface BreathingPattern {
  name: string;
  animation: string;
  phases: Array<{
    text: string;
    subtext: string;
    duration: number;
  }>;
}

interface SessionState {
  duration: number;
  pattern: string;
  startTime: number | null;
  isPaused: boolean;
  isActive: boolean;
  isComplete: boolean;
}

const breathingPatterns: Record<string, BreathingPattern> = {
  simple: {
    name: 'Простое дыхание',
    animation: 'animate-breathe-simple',
    phases: [
      { text: 'Вдох', subtext: 'Медленно вдыхайте', duration: 3000 },
      { text: 'Выдох', subtext: 'Медленно выдыхайте', duration: 3000 }
    ]
  },
  '478': {
    name: '4-7-8 дыхание',
    animation: 'animate-breathe-478',
    phases: [
      { text: 'Вдох', subtext: '4 секунды', duration: 4000 },
      { text: 'Задержка', subtext: '7 секунд', duration: 7000 },
      { text: 'Выдох', subtext: '8 секунд', duration: 8000 }
    ]
  },
  box: {
    name: 'Квадратное дыхание',
    animation: 'animate-breathe-box',
    phases: [
      { text: 'Вдох', subtext: '4 секунды', duration: 4000 },
      { text: 'Задержка', subtext: '4 секунды', duration: 4000 },
      { text: 'Выдох', subtext: '4 секунды', duration: 4000 },
      { text: 'Пауза', subtext: '4 секунды', duration: 4000 }
    ]
  }
};

export default function MeditationPage() {
  const [session, setSession] = useState<SessionState>({
    duration: 300, // 5 minutes default
    pattern: 'simple',
    startTime: null,
    isPaused: false,
    isActive: false,
    isComplete: false
  });

  const [audioEnabled, setAudioEnabled] = useState(true);
  const [volume, setVolume] = useState(50);
  const [currentPhase, setCurrentPhase] = useState({ text: 'Дышите', subtext: 'Следуйте за кругом' });
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const phaseTimeoutRef = useRef<NodeJS.Timeout>();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const updateBreathingInstructions = useCallback(() => {
    const pattern = breathingPatterns[session.pattern];
    let phaseIndex = 0;

    const nextPhase = () => {
      if (session.isPaused || !session.isActive) return;

      const phase = pattern.phases[phaseIndex];
      setCurrentPhase({ text: phase.text, subtext: phase.subtext });

      phaseIndex = (phaseIndex + 1) % pattern.phases.length;
      
      phaseTimeoutRef.current = setTimeout(nextPhase, phase.duration);
    };

    nextPhase();
  }, [session.pattern, session.isPaused, session.isActive]);

  const updateTimer = useCallback(() => {
    if (session.isPaused || !session.startTime) return;

    const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
    const remaining = Math.max(0, session.duration - elapsed);
    
    setTimeRemaining(remaining);
    setProgress((elapsed / session.duration) * 100);

    if (remaining <= 0) {
      completeSession();
    }
  }, [session.isPaused, session.startTime, session.duration]);

  const startSession = () => {
    setSession(prev => ({
      ...prev,
      startTime: Date.now(),
      isActive: true,
      isPaused: false,
      isComplete: false
    }));

    if (audioEnabled && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const togglePause = () => {
    setSession(prev => ({ ...prev, isPaused: !prev.isPaused }));
    
    if (audioRef.current) {
      if (session.isPaused) {
        if (audioEnabled) {
          audioRef.current.play().catch(e => console.log('Audio play failed:', e));
        }
      } else {
        audioRef.current.pause();
      }
    }
  };

  const stopSession = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setSession(prev => ({
      ...prev,
      startTime: null,
      isActive: false,
      isPaused: false,
      isComplete: false
    }));
    
    setTimeRemaining(session.duration);
    setProgress(0);
    setCurrentPhase({ text: 'Дышите', subtext: 'Следуйте за кругом' });
  };

  const completeSession = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setSession(prev => ({ ...prev, isActive: false, isComplete: true }));
  };

  const newSession = () => {
    setSession(prev => ({
      ...prev,
      startTime: null,
      isActive: false,
      isPaused: false,
      isComplete: false
    }));
    
    setTimeRemaining(session.duration);
    setProgress(0);
    setCurrentPhase({ text: 'Дышите', subtext: 'Следуйте за кругом' });
  };

  // Timer effect
  useEffect(() => {
    if (session.isActive && !session.isPaused) {
      intervalRef.current = setInterval(updateTimer, 1000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [session.isActive, session.isPaused, updateTimer]);

  // Breathing instructions effect
  useEffect(() => {
    if (session.isActive && !session.isPaused) {
      updateBreathingInstructions();
      return () => {
        if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
      };
    }
  }, [session.isActive, session.isPaused, updateBreathingInstructions]);

  // Audio volume effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  if (session.isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zen-light via-zen-medium to-meditation-200 text-zen-darker font-sans">
        <header className="pt-8 pb-4 text-center">
          <h1 className="text-3xl md:text-4xl font-light text-zen-darker mb-2">Медитация дыхания</h1>
          <p className="text-zen-dark opacity-80 text-sm md:text-base">Найдите покой через осознанное дыхание</p>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-md">
          <div className="text-center space-y-6 animate-fade-in">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <div className="text-6xl mb-4">🧘‍♀️</div>
              <h2 className="text-2xl font-light text-zen-darker mb-2">Медитация завершена</h2>
              <p className="text-zen-dark opacity-80 mb-6">Прекрасная работа! Вы потратили время на заботу о себе.</p>
              <div className="bg-zen-light rounded-xl p-4 mb-6">
                <div className="text-sm text-zen-dark opacity-80 mb-1">Время медитации</div>
                <div className="text-xl font-medium text-zen-darker">{Math.floor(session.duration / 60)} минут</div>
              </div>
              <Button 
                onClick={newSession}
                className="w-full bg-gradient-to-r from-zen-main to-zen-dark text-white py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200 hover:from-zen-dark hover:to-zen-darker hover:scale-105 active:scale-95 shadow-lg"
              >
                <i className="fas fa-redo mr-2"></i>
                Новая сессия
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (session.isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zen-light via-zen-medium to-meditation-200 text-zen-darker font-sans">
        <header className="pt-8 pb-4 text-center">
          <h1 className="text-3xl md:text-4xl font-light text-zen-darker mb-2">Медитация дыхания</h1>
          <p className="text-zen-dark opacity-80 text-sm md:text-base">Найдите покой через осознанное дыхание</p>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-md">
          <div className="space-y-6 animate-fade-in">
            {/* Timer and Progress */}
            <div className="text-center">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
                <div className="text-3xl font-light text-zen-darker mb-2">{formatTime(timeRemaining)}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-zen-main to-zen-dark h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(100, progress)}%` }}
                  ></div>
                </div>
                <div className="text-sm text-zen-dark opacity-80">
                  {Math.floor(session.duration / 60)} мин • {breathingPatterns[session.pattern].name}
                </div>
              </div>
            </div>

            {/* Breathing Circle */}
            <div className="flex justify-center items-center mb-8">
              <div className="relative">
                {/* Outer ring */}
                <div className="w-64 h-64 rounded-full border-4 border-zen-main/30 flex items-center justify-center">
                  {/* Main breathing circle */}
                  <div className={`w-48 h-48 rounded-full bg-gradient-to-br from-zen-main/80 to-zen-dark/80 backdrop-blur-sm shadow-xl flex items-center justify-center ${breathingPatterns[session.pattern].animation}`}>
                    <div className="text-white text-center">
                      <div className="text-2xl font-light mb-1">{currentPhase.text}</div>
                      <div className="text-sm opacity-80">{currentPhase.subtext}</div>
                    </div>
                  </div>
                </div>
                {/* Pulse indicators */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border-2 border-zen-main/20 animate-pulse-gentle"></div>
              </div>
            </div>

            {/* Session Controls */}
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={togglePause}
                className="bg-white/70 backdrop-blur-sm text-zen-darker py-3 px-6 rounded-xl font-medium transition-all duration-200 hover:bg-white/90 hover:scale-105 active:scale-95 shadow-lg"
              >
                <i className={`fas ${session.isPaused ? 'fa-play' : 'fa-pause'} mr-2`}></i>
                {session.isPaused ? 'Продолжить' : 'Пауза'}
              </Button>
              <Button 
                onClick={stopSession}
                className="bg-red-500/80 backdrop-blur-sm text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 hover:bg-red-600/90 hover:scale-105 active:scale-95 shadow-lg"
              >
                <i className="fas fa-stop mr-2"></i>
                Остановить
              </Button>
            </div>
          </div>
        </div>

        <audio ref={audioRef} loop preload="auto">
          <source src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_1b1a3d5c1a.mp3?filename=meditation-music-140084.mp3" type="audio/mpeg" />
        </audio>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zen-light via-zen-medium to-meditation-200 text-zen-darker font-sans">
      <header className="pt-8 pb-4 text-center">
        <h1 className="text-3xl md:text-4xl font-light text-zen-darker mb-2">Медитация дыхания</h1>
        <p className="text-zen-dark opacity-80 text-sm md:text-base">Найдите покой через осознанное дыхание</p>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="space-y-6 animate-fade-in">
          {/* Duration Selection */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-medium text-zen-darker mb-4 text-center">Продолжительность сессии</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { duration: 60, label: '1 мин' },
                { duration: 180, label: '3 мин' },
                { duration: 300, label: '5 мин' },
                { duration: 600, label: '10 мин' }
              ].map(({ duration, label }) => (
                <Button
                  key={duration}
                  onClick={() => {
                    setSession(prev => ({ ...prev, duration }));
                    setTimeRemaining(duration);
                  }}
                  className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                    session.duration === duration 
                      ? 'bg-zen-dark text-white hover:bg-zen-darker' 
                      : 'bg-zen-main text-white hover:bg-zen-dark'
                  }`}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Breathing Pattern Selection */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-medium text-zen-darker mb-4 text-center">Техника дыхания</h3>
            <div className="space-y-3">
              {Object.entries(breathingPatterns).map(([key, pattern]) => (
                <Button
                  key={key}
                  onClick={() => setSession(prev => ({ ...prev, pattern: key }))}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 text-left ${
                    session.pattern === key
                      ? 'bg-zen-main text-white hover:bg-zen-dark'
                      : 'bg-white text-zen-darker hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{pattern.name}</span>
                    <small className="opacity-60">
                      {key === 'simple' && '3 сек вдох / 3 сек выдох'}
                      {key === '478' && '4 вдох / 7 задержка / 8 выдох'}
                      {key === 'box' && '4-4-4-4 секунды'}
                    </small>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Audio Settings */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-medium text-zen-darker mb-4 text-center">Фоновые звуки</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-zen-darker">Включить музыку</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={audioEnabled}
                    onChange={(e) => setAudioEnabled(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zen-main"></div>
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-volume-down text-zen-dark"></i>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <i className="fas fa-volume-up text-zen-dark"></i>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <Button 
            onClick={startSession}
            className="w-full bg-gradient-to-r from-zen-main to-zen-dark text-white py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200 hover:from-zen-dark hover:to-zen-darker hover:scale-105 active:scale-95 shadow-lg"
          >
            <i className="fas fa-play mr-2"></i>
            Начать медитацию
          </Button>
        </div>
      </div>
    </div>
  );
}
