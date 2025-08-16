import { useState, useCallback } from 'react';
import { DiagnosisState, ScreenType, UserInfo, DiagnosisResult } from '../types';
import { QUESTIONS, PERSONAS } from '../data';
import { spreadsheetService } from '../services/spreadsheetService';

const initialState: DiagnosisState = {
  currentQuestionIndex: 0,
  answers: [],
  personaScores: Object.keys(PERSONAS).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
  leaderScore: 0,
  playerScore: 0,
  isComplete: false,
};

export const useDiagnosis = () => {
  const [state, setState] = useState<DiagnosisState>(initialState);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('userInfo');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const startDiagnosis = useCallback((userInfo: UserInfo) => {
    setUserInfo(userInfo);
    setState(initialState);
    setCurrentScreen('question');
  }, []);

  const answerQuestion = useCallback((answerValue: number) => {
    setState(prevState => {
      const newAnswers = [...prevState.answers, answerValue];
      const currentQuestion = QUESTIONS[prevState.currentQuestionIndex];
      
      // スコアを計算
      const newPersonaScores = { ...prevState.personaScores };
      let newLeaderScore = prevState.leaderScore;
      let newPlayerScore = prevState.playerScore;
      
      // ペルソナスコアの更新
      Object.entries(currentQuestion.scores).forEach(([key, score]) => {
        if (key === 'LP') {
          // リーダー/プレイヤースコアの更新
          if (score > 0) {
            newLeaderScore += answerValue * score;
          } else {
            newPlayerScore += answerValue * Math.abs(score);
          }
        } else {
          // ペルソナスコアの更新
          newPersonaScores[key] = (newPersonaScores[key] || 0) + answerValue * score;
        }
      });

      const nextQuestionIndex = prevState.currentQuestionIndex + 1;
      const isComplete = nextQuestionIndex >= QUESTIONS.length;

      const newState = {
        ...prevState,
        currentQuestionIndex: nextQuestionIndex,
        answers: newAnswers,
        personaScores: newPersonaScores,
        leaderScore: newLeaderScore,
        playerScore: newPlayerScore,
        isComplete,
      };

      // 次の質問があるかチェック
      if (isComplete) {
        setTimeout(() => setCurrentScreen('result'), 100);
      }

      return newState;
    });
  }, []);

  const restartDiagnosis = useCallback(() => {
    setState(initialState);
    setCurrentScreen('userInfo');
    setUserInfo(null);
  }, []);

  const getCurrentQuestion = useCallback(() => {
    return QUESTIONS[state.currentQuestionIndex];
  }, [state.currentQuestionIndex]);

  const getProgressPercentage = useCallback(() => {
    return ((state.currentQuestionIndex + 1) / QUESTIONS.length) * 100;
  }, [state.currentQuestionIndex]);

  const getLeaderPlayerPercentages = useCallback(() => {
    const total = Math.abs(state.leaderScore) + Math.abs(state.playerScore);
    if (total === 0) return { leader: 50, player: 50 };
    
    const leaderPercentage = Math.round((Math.abs(state.leaderScore) / total) * 100);
    const playerPercentage = 100 - leaderPercentage;
    
    return { leader: leaderPercentage, player: playerPercentage };
  }, [state.leaderScore, state.playerScore]);

  const getTopPersonas = useCallback(() => {
    return Object.entries(state.personaScores)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([key, score]) => ({
        key,
        persona: PERSONAS[key],
        score: score as number,
      }));
  }, [state.personaScores]);

  const getDiagnosisResult = useCallback((): DiagnosisResult | null => {
    if (!userInfo || !state.isComplete) return null;

    const { leader, player } = getLeaderPlayerPercentages();
    
    return {
      userInfo,
      personaScores: state.personaScores,
      leaderPercentage: leader,
      playerPercentage: player,
      answers: state.answers,
      completedAt: new Date().toISOString(),
    };
  }, [userInfo, state, getLeaderPlayerPercentages]);

  const exportToSpreadsheet = useCallback(async (result: DiagnosisResult) => {
    try {
      // 設定の検証
      if (!spreadsheetService.validateConfig()) {
        console.warn('スプレッドシート設定が不完全です。ローカルストレージに保存します。');
        
        // フォールバック：ローカルストレージに保存
        const spreadsheetData = {
          id: result.userInfo.id,
          name: result.userInfo.name,
          team: result.userInfo.team,
          leaderPercentage: result.leaderPercentage,
          playerPercentage: result.playerPercentage,
          ...Object.entries(result.personaScores).reduce((acc, [key, score]) => ({
            ...acc,
            [key]: score,
          }), {}),
          completedAt: result.completedAt,
        };
        
        const existingData = JSON.parse(localStorage.getItem('diagnosisResults') || '[]');
        existingData.push(spreadsheetData);
        localStorage.setItem('diagnosisResults', JSON.stringify(existingData));
        
        alert('診断結果がローカルに保存されました。\nスプレッドシートへの送信には設定が必要です。');
        return;
      }

      // スプレッドシートに送信
      const success = await spreadsheetService.sendResult(result);
      
      if (success) {
        alert('診断結果がスプレッドシートに正常に送信されました。');
      } else {
        throw new Error('スプレッドシートへの送信に失敗しました');
      }
      
    } catch (error) {
      console.error('Failed to export to spreadsheet:', error);
      alert('診断結果の保存に失敗しました。\nエラー: ' + (error as Error).message);
    }
  }, []);

  return {
    state,
    currentScreen,
    userInfo,
    startDiagnosis,
    answerQuestion,
    restartDiagnosis,
    getCurrentQuestion,
    getProgressPercentage,
    getLeaderPlayerPercentages,
    getTopPersonas,
    getDiagnosisResult,
    exportToSpreadsheet,
  };
};
