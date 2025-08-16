import React, { useState } from 'react';
import { Question } from '../types';

interface QuestionScreenProps {
  question: Question;
  progressPercentage: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  onAnswer: (value: number) => void;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  question,
  progressPercentage,
  currentQuestionIndex,
  totalQuestions,
  onAnswer,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswerClick = (value: number) => {
    setSelectedAnswer(value);
    // 少し遅延を入れてから次の質問に進む
    setTimeout(() => {
      onAnswer(value);
      setSelectedAnswer(null);
    }, 300);
  };

  const answerOptions = [
    { value: 2, label: '強くそう思う', className: 'agree-strong' },
    { value: 1, label: 'そう思う', className: 'agree' },
    { value: 0, label: 'どちらでもない', className: 'neutral' },
    { value: -1, label: 'あまり思わない', className: 'disagree' },
    { value: -2, label: '全く思わない', className: 'disagree-strong' },
  ];

  return (
    <div className="screen">
      <div className="result-container">
        <div className="mb-8">
          <p className="text-sm text-green-300 text-center mb-3 font-medium">
            質問 {currentQuestionIndex + 1} / {totalQuestions}
          </p>
          <div 
            className="w-full bg-green-900/50 rounded-full h-3" 
            role="progressbar" 
            aria-valuenow={progressPercentage} 
            aria-valuemin={0} 
            aria-valuemax={100}
          >
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-semibold mb-10 text-center min-h-[8rem] flex items-center justify-center leading-relaxed text-green-100">
          {question.text}
        </h2>
        
        <div className="space-y-4" role="group" aria-labelledby="question-text">
          {answerOptions.map((option) => (
            <button
              key={option.value}
              className={`btn-answer ${option.className} ${
                selectedAnswer === option.value ? 'selected' : ''
              }`}
              onClick={() => handleAnswerClick(option.value)}
              disabled={selectedAnswer !== null}
              aria-label={option.label}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
