import { useState, useEffect } from 'preact/hooks';
import { StartScreen } from './components/StartScreen';
import { Quiz } from './components/Quiz';
import { Score } from './components/Score';
import { selectVersesForRound } from './utils/verses';
import { clearPlayedVerses, saveGameState, loadGameState, clearGameState } from './utils/storage';

const QUESTIONS_PER_ROUND = 10;

export function App() {
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'finished'
  const [currentRound, setCurrentRound] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  
  // Load verses and check for saved game state
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}verses.json`)
      .then(res => res.json())
      .then(data => {
        setVerses(data);
        setLoading(false);
        
        // Check for saved game state
        const savedState = loadGameState();
        if (savedState && savedState.gameState === 'playing') {
          // Verify the saved verses still exist
          const savedVerses = savedState.currentRound.filter(v => 
            data.some(verse => {
              const id = verse.number !== '-1' ? verse.number : verse.lines[0];
              const savedId = v.number !== '-1' ? v.number : v.lines[0];
              return id === savedId;
            })
          );
          
          if (savedVerses.length > 0 && savedState.currentQuestion < savedVerses.length) {
            setCurrentRound(savedVerses);
            setCurrentQuestion(savedState.currentQuestion);
            setAnswers(savedState.answers || []);
            setGameState('playing');
          } else {
            // Invalid saved state, clear it
            clearGameState();
          }
        }
      })
      .catch(err => {
        console.error('Error loading verses:', err);
        setLoading(false);
      });
  }, []);
  
  const startRound = () => {
    const roundVerses = selectVersesForRound(verses, QUESTIONS_PER_ROUND);
    setCurrentRound(roundVerses);
    setCurrentQuestion(0);
    setAnswers([]);
    setGameState('playing');
    saveGameState({
      gameState: 'playing',
      currentRound: roundVerses,
      currentQuestion: 0,
      answers: []
    });
  };
  
  const resumeGame = () => {
    const savedState = loadGameState();
    if (savedState && savedState.gameState === 'playing') {
      setCurrentRound(savedState.currentRound);
      setCurrentQuestion(savedState.currentQuestion);
      setAnswers(savedState.answers || []);
      setGameState('playing');
    }
  };
  
  const handleAnswer = (isCorrect) => {
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    
    if (currentQuestion + 1 < currentRound.length) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      saveGameState({
        gameState: 'playing',
        currentRound: currentRound,
        currentQuestion: nextQuestion,
        answers: newAnswers
      });
    } else {
      setGameState('finished');
      clearGameState(); // Clear saved state when round is finished
    }
  };
  
  const handleNewRound = () => {
    startRound();
  };
  
  const handleReset = () => {
    if (confirm('Вы уверены, что хотите сбросить весь прогресс? Все сыгранные стихи будут забыты.')) {
      clearPlayedVerses();
      startRound();
    }
  };
  
  const handleGoHome = (e) => {
    e.preventDefault();
    // Save current game state before going home
    if (gameState === 'playing' && currentRound.length > 0) {
      saveGameState({
        gameState: 'playing',
        currentRound: currentRound,
        currentQuestion: currentQuestion,
        answers: answers
      });
    }
    setGameState('start');
  };
  
  const renderContent = () => {
    if (loading) {
      return (
        <div class="loading">
          <div class="spinner"></div>
          <p>Загрузка стихов...</p>
        </div>
      );
    }
    
    if (verses.length === 0) {
      return (
        <div class="error">
          <p>Ошибка загрузки стихов. Проверьте, что файл verses.json существует.</p>
        </div>
      );
    }
    
    if (gameState === 'start') {
      const hasInProgressGame = loadGameState() && loadGameState().gameState === 'playing';
      return <StartScreen onStart={startRound} onResume={hasInProgressGame ? resumeGame : null} />;
    }
    
    if (gameState === 'finished') {
      const score = answers.filter(a => a).length;
      return (
        <Score 
          score={score} 
          total={currentRound.length}
          onNewRound={handleNewRound}
          totalVerses={verses.length}
        />
      );
    }
    
    if (gameState === 'playing' && currentRound.length > 0) {
      const currentVerse = currentRound[currentQuestion];
      return (
        <Quiz
          verse={currentVerse}
          onAnswer={handleAnswer}
          questionNumber={currentQuestion + 1}
          totalQuestions={currentRound.length}
        />
      );
    }
    
    return null;
  };

  return (
    <div class="app-layout">
      {(gameState === 'playing' || gameState === 'finished') && (
        <a href="#" onClick={handleGoHome} class="nav-link">← Главная</a>
      )}
      <div class="app-content">
        {renderContent()}
      </div>
    </div>
  );
}

