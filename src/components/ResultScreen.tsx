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
import ConfigStatus from './ConfigStatus';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

interface ResultScreenProps {
  userInfo: UserInfo;
  personaScores: { [key: string]: number };
  leaderPercentage: number;
  playerPercentage: number;
  onRestart: () => void;
  onExport: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  userInfo,
  personaScores,
  leaderPercentage,
  playerPercentage,
  onRestart,
  onExport,
}) => {
  const [showConfig, setShowConfig] = useState(false);
  // パーセンテージを計算
  const totalScore = Object.values(personaScores).reduce((sum, score) => sum + Math.abs(score), 0);
  const personaPercentages = Object.entries(personaScores).map(([key, score]) => ({
    key,
    persona: PERSONAS[key],
    percentage: totalScore > 0 ? Math.round((Math.abs(score) / totalScore) * 100) : 0,
  })).sort((a, b) => b.percentage - a.percentage);

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
        
        {/* 設定状況表示ボタン */}
        <div className="mt-6 flex justify-center">
          <button 
            onClick={() => setShowConfig(!showConfig)}
            className="text-green-300 hover:text-green-200 text-sm underline"
            aria-label="設定状況を表示"
          >
            {showConfig ? '設定状況を隠す' : '設定状況を表示'}
          </button>
        </div>

        {/* 設定状況 */}
        {showConfig && (
          <div className="mt-4">
            <ConfigStatus />
          </div>
        )}
        
        {/* アクションボタン */}
        <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">
          <button 
            onClick={onExport}
            className="btn-primary text-xl px-12 py-5 bg-blue-600 hover:bg-blue-700"
            aria-label="結果を保存"
          >
            結果を保存
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
