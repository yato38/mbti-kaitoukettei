import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { PERSONAS } from '../data';
import { UserInfo } from '../types';
import { generatePDF } from '../utils/pdfGenerator';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

interface ResultScreenProps {
  userInfo: UserInfo;
  personaScores: { [key: string]: number };
  leaderPercentage: number;
  playerPercentage: number;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  userInfo,
  personaScores,
  leaderPercentage,
  playerPercentage,
  onRestart,
}) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // パーセンテージを計算
  const totalScore = Object.values(personaScores).reduce((sum, score) => sum + Math.abs(score), 0);
  const personaPercentages = Object.entries(personaScores).map(([key, score]) => ({
    key,
    persona: PERSONAS[key],
    percentage: totalScore > 0 ? Math.round((Math.abs(score) / totalScore) * 100) : 0,
  })).sort((a, b) => b.percentage - a.percentage);

  // PDFダウンロード処理
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await generatePDF({
        userInfo,
        leaderPercentage,
        playerPercentage,
        personaPercentages,
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // チャートデータの準備
  const chartData = {
    labels: personaPercentages.map(item => item.persona.name),
    datasets: [
      {
        data: personaPercentages.map(item => item.percentage),
        backgroundColor: personaPercentages.map(item => item.persona.color),
        borderWidth: 3,
        borderColor: '#1a4d2e',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#ffffff',
          font: {
            size: 12,
            weight: 'bold' as const,
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#22c55e',
        borderWidth: 2,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed}%`;
          }
        }
      },
    },
  };

  return (
    <div className="screen text-center">
      <div className="result-container">
        <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-6 text-shadow">
          診断結果
        </h1>

        {/* ユーザー情報表示 */}
        <div className="mb-8 bg-green-900/30 p-6 rounded-xl border border-green-700/50 backdrop-blur-sm">
          <h3 className="text-lg font-bold mb-4 text-green-300">診断者情報</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-green-200">
            <div>
              <span className="font-semibold">ID: </span>
              {userInfo.id}
            </div>
            <div>
              <span className="font-semibold">氏名: </span>
              {userInfo.name}
            </div>
            <div>
              <span className="font-semibold">所属チーム: </span>
              {userInfo.team}
            </div>
          </div>
        </div>
        
        {/* リーダー/プレイヤー結果 */}
        <div className="my-8 bg-green-900/40 p-8 rounded-2xl border border-green-700/50 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-6 text-green-300">
            リーダー / プレイヤー 傾向
          </h2>
          <div className="flex justify-center items-center space-x-8 text-3xl md:text-4xl">
            <div className="text-blue-400">
              <span className="font-bold">リーダー: {leaderPercentage}%</span>
            </div>
            <span className="text-green-400 text-2xl">/</span>
            <div className="text-purple-400">
              <span className="font-bold">プレイヤー: {playerPercentage}%</span>
            </div>
          </div>
        </div>

        <p className="text-green-200 mb-8 text-xl font-medium">
          あなたのペルソナ構成はこちらです。
        </p>
        
        {/* チャート */}
        <div className="mb-8">
          <div className="chart-container">
            <div className="h-64 md:h-72">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
        
        {/* ペルソナ詳細 */}
        <div className="mt-8 text-left space-y-6">
          {personaPercentages.map(({ key, persona, percentage }, index) => (
            <div
              key={key}
              className="persona-card"
              style={{ borderLeftColor: persona.color }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-green-300">
                  {index + 1}. {persona.name}
                </h3>
                <span className="percentage-badge">
                  {percentage}%
                </span>
              </div>
              <p className="text-green-100 leading-relaxed text-lg">
                {persona.description}
              </p>
            </div>
          ))}
        </div>
        

        
        {/* アクションボタン */}
        <div className="mt-10 flex flex-col md:flex-row justify-center gap-4">
          <button 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="btn-secondary text-xl px-8 py-5 flex items-center justify-center gap-2"
            aria-label="PDFをダウンロード"
          >
            {isGeneratingPDF ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                PDF生成中...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDFをダウンロード
              </>
            )}
          </button>
          <button 
            onClick={onRestart}
            className="btn-primary text-xl px-12 py-5"
            aria-label="もう一度診断する"
          >
            もう一度診断する
          </button>
        </div>
      </div>
    </div>
  );
};
