import { Persona, Question, AnswerValues } from '../types';

export const PERSONAS: Personas = {
  A: { 
    name: "A: 独自路線のこだわり屋", 
    description: "高い専門性と自分だけのスタイルで、品質を徹底的に追求する職人。妥協を許さない姿勢が、組織の基準を引き上げます。", 
    color: "rgba(255, 99, 132, 0.8)" 
  },
  B: { 
    name: "B: 主張が弱い協調型", 
    description: "対立を避け、全体の調和を何よりも重んじる平和主義者。自分の意見を抑え、聞き役に徹することでチームの安定に貢献します。", 
    color: "rgba(54, 162, 235, 0.8)" 
  },
  C: { 
    name: "C: スピード早いミス多い人", 
    description: "素早く行動を起こすが、細かい確認が不足しがち。スピード感でチームに勢いをもたらす一方、ミスが発生しやすい傾向があります。", 
    color: "rgba(255, 206, 86, 0.8)" 
  },
  D: { 
    name: "D: 慎重すぎるくらいに確認する人", 
    description: "完璧を求めて何度も確認を重ねる慎重派。ミスを防ぐことに徹する一方、作業スピードが遅くなりがちです。", 
    color: "rgba(75, 192, 192, 0.8)" 
  },
  E: { 
    name: "E: 流されやすい順応型", 
    description: "場の空気を読み、チームの意見に柔軟に合わせるサポーター。周りをサポートし、円滑な人間関係を築きます。", 
    color: "rgba(153, 102, 255, 0.8)" 
  },
  F: { 
    name: "F: 変化を拒む保守型", 
    description: "既存の手法や前例を重んじ、新しい変化に抵抗を示す保守派。安定性を重視し、確実性を追求します。", 
    color: "rgba(255, 159, 64, 0.8)" 
  }
};

export const QUESTIONS: Question[] = [
  // Persona Questions
  { text: "仕事は、自分なりのやり方で進めないと気が済まない。", scores: { A: 2, E: -1, F: -1 } },
  { text: "計画よりも、まず行動に移すことが重要だ。", scores: { C: 2, D: -2, F: -1 } },
  { text: "資料を提出する前は、何度も見直しをしないと不安になる。", scores: { D: 2, C: -2 } },
  { text: "チームの調和を保つためなら、自分の意見を譲ることがよくある。", scores: { E: 2, B: 2, A: -1 } },
  { text: "新しいツールや手法を導入することには、抵抗を感じる。", scores: { F: 2, C: -1, A: -1 } },
  { text: "会議では、自分の意見を言うよりも、まず周りの意見を聞きたい。", scores: { B: 2, E: 1 } },
  { text: "細かい部分のクオリティに、つい時間をかけすぎてしまう。", scores: { A: 2, C: -1 } },
  { text: "活発な議論よりも、穏やかな雰囲気で会議を進めたい。", scores: { B: 2, F: 1 } },
  { text: "「とりあえずやってみよう」という言葉に強く共感する。", scores: { C: 2, D: -2 } },
  { text: "仕事を進める上で、最も避けたいのは予期せぬトラブルだ。", scores: { D: 2, F: 1, C: -2 } },
  { text: "周りから頼られると、自分の仕事が多くても引き受けてしまいがちだ。", scores: { E: 2, A: -1 } },
  { text: "「前例がない」と聞くと、少し躊躇してしまう。", scores: { F: 2, C: -1 } },
  // Leader/Player Questions
  { text: "チームを率いる役割を任されると、やりがいを感じる。", scores: { LP: 2 } },
  { text: "全体の戦略を考えるより、自分の担当業務に集中したい。", scores: { LP: -2 } },
  { text: "メンバーの進捗を管理し、サポートすることに抵抗はない。", scores: { LP: 2 } },
  { text: "指示されたことを完璧にこなすことに、大きな満足感を覚える。", scores: { LP: -2 } }
];

export const ANSWER_VALUES: AnswerValues = {
  STRONGLY_AGREE: 2,
  AGREE: 1,
  NEUTRAL: 0,
  DISAGREE: -1,
  STRONGLY_DISAGREE: -2
};

export const TEAMS = [
  '上級教務研究員',
  '解答決定者',
  '科目マネジメント',
  '模試マネジメント',
  'インフラマネジメント',
  '新規プロジェクトマネジメント',
  '人材管理',
  '人事セクション'
] as const;

export type Team = typeof TEAMS[number];

export interface Personas {
  [key: string]: Persona;
}
