import React, { useEffect, useState } from 'react';

const SplashScreen: React.FC = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 flex items-center justify-center">
      <div className={`text-center transition-all duration-1000 ${
        fadeIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>
        {/* Logo */}
        <div className="mb-10">
          <div className="w-30 h-30 mx-auto rounded-full bg-primary shadow-2xl shadow-primary/30 flex items-center justify-center">
            <span className="text-4xl font-bold text-white tracking-wider">AIVA</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2">
          Alyasra Intelligent Virtual Assistant
        </h1>
        <p className="text-lg text-slate-300 mb-15">
          Empowering Business Decisions
        </p>

        {/* Loading indicator */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.5s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;