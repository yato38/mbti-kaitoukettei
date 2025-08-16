import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="screen text-center">
      <div className="result-container">
        <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-6 text-shadow">
          教務研究員ペルソナ診断
        </h1>
        <p className="text-green-200 mb-10 text-xl leading-relaxed">
          いくつかの簡単な質問に答えるだけで、あなたの仕事における隠れたペルソナと傾向を分析します。
        </p>
        <button 
          onClick={onStart}
          className="btn-primary text-xl px-12 py-5"
          aria-label="診断を始める"
        >
          診断を始める
        </button>
      </div>
    </div>
  );
};
