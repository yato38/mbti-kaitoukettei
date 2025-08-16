import { StartScreen } from './components/StartScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { ResultScreen } from './components/ResultScreen';
import { UserInfoScreen } from './components/UserInfoScreen';
import { useDiagnosis } from './hooks/useDiagnosis';
import { QUESTIONS } from './data';

function App() {
  const {
    state,
    currentScreen,
    userInfo,
    startDiagnosis,
    answerQuestion,
    restartDiagnosis,
    getCurrentQuestion,
    getProgressPercentage,
    getLeaderPlayerPercentages,
    getDiagnosisResult,
    exportToSpreadsheet,
  } = useDiagnosis();

  const handleExport = async () => {
    const result = getDiagnosisResult();
    if (result) {
      await exportToSpreadsheet(result);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'userInfo':
        return <UserInfoScreen onComplete={startDiagnosis} />;
      
      case 'start':
        return <StartScreen onStart={() => {}} />;
      
      case 'question':
        const currentQuestion = getCurrentQuestion();
        if (!currentQuestion) return null;
        
        return (
          <QuestionScreen
            question={currentQuestion}
            progressPercentage={getProgressPercentage()}
            currentQuestionIndex={state.currentQuestionIndex}
            totalQuestions={QUESTIONS.length}
            onAnswer={answerQuestion}
          />
        );
      
      case 'result':
        if (!userInfo) return null;
        
        const { leader, player } = getLeaderPlayerPercentages();
        return (
          <ResultScreen
            userInfo={userInfo}
            personaScores={state.personaScores}
            leaderPercentage={leader}
            playerPercentage={player}
            onRestart={restartDiagnosis}
            onExport={handleExport}
          />
        );
      
      default:
        return <UserInfoScreen onComplete={startDiagnosis} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-800">
      <div className="container mx-auto px-4 py-8">
        {renderScreen()}
      </div>
    </div>
  );
}

export default App;
