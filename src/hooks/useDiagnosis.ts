import { useState, useCallback } from 'react';
import { DiagnosisState, ScreenType, UserInfo, DiagnosisResult } from '../types';
import { QUESTIONS, PERSONAS } from '../data';

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

  /**
   * 各ペルソナのパーセンテージを計算
   */
  const getPersonaPercentages = useCallback(() => {
    const totalScore = Object.values(state.personaScores).reduce((sum, score) => sum + Math.abs(score as number), 0);
    
    if (totalScore === 0) {
      // スコアが0の場合は均等に分配
      const equalPercentage = Math.round(100 / Object.keys(state.personaScores).length);
      return Object.keys(state.personaScores).reduce((acc, key) => ({
        ...acc,
        [key]: equalPercentage,
      }), {});
    }
    
    return Object.entries(state.personaScores).reduce((acc, [key, score]) => ({
      ...acc,
      [key]: Math.round((Math.abs(score as number) / totalScore) * 100),
    }), {});
  }, [state.personaScores]);

  const getDiagnosisResult = useCallback((): DiagnosisResult | null => {
    if (!userInfo || !state.isComplete) return null;

    const { leader, player } = getLeaderPlayerPercentages();
    const personaPercentages = getPersonaPercentages();
    
    return {
      userInfo,
      personaScores: state.personaScores,
      personaPercentages, // パーセンテージを追加
      leaderPercentage: leader,
      playerPercentage: player,
      answers: state.answers,
      completedAt: new Date().toISOString(),
    };
  }, [userInfo, state, getLeaderPlayerPercentages, getPersonaPercentages]);



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
  };
};
