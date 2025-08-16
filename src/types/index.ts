export interface Question {
  text: string;
  scores: { [key: string]: number };
}

export interface Persona {
  name: string;
  description: string;
  color: string;
}

export interface DiagnosisState {
  currentQuestionIndex: number;
  answers: number[];
  personaScores: { [key: string]: number };
  leaderScore: number;
  playerScore: number;
  isComplete: boolean;
}

export type ScreenType = 'userInfo' | 'start' | 'question' | 'result';

export interface UserInfo {
  id: string;
  name: string;
  team: string;
}

export interface DiagnosisResult {
  userInfo: UserInfo;
  personaScores: { [key: string]: number };
  personaPercentages: { [key: string]: number }; // 各ペルソナのパーセンテージ
  leaderPercentage: number;
  playerPercentage: number;
  answers: number[];
  completedAt: string;
}

export interface AnswerValues {
  STRONGLY_AGREE: number;
  AGREE: number;
  NEUTRAL: number;
  DISAGREE: number;
  STRONGLY_DISAGREE: number;
}
