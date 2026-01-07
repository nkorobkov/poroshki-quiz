import { useState, useEffect, useRef } from 'preact/hooks';
import { checkAnswer } from '../utils/verses';
import { markVerseAsPlayed } from '../utils/storage';

export function Quiz({ verse, onAnswer, questionNumber, totalQuestions }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  
  const correctAnswer = verse.lines[3];
  const firstThreeLines = verse.lines.slice(0, 3);
  
  // Reset state when verse changes
  useEffect(() => {
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(false);
    // Focus input after a brief delay to ensure it's rendered
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 100);
  }, [verse]);
  
  // Add document-level Enter key handler when result is shown
  useEffect(() => {
    if (!showResult) return;
    
    const handleEnter = (e) => {
      if (e.key === 'Enter' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        // Click the submit button to trigger form submission
        if (buttonRef.current && !buttonRef.current.disabled) {
          buttonRef.current.click();
        }
      }
    };
    
    document.addEventListener('keydown', handleEnter);
    return () => {
      document.removeEventListener('keydown', handleEnter);
    };
  }, [showResult]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!showResult) {
      // First submit - check answer
      if (!userAnswer.trim()) return;
      
      const correct = checkAnswer(userAnswer, correctAnswer);
      setIsCorrect(correct);
      setShowResult(true);
      
      // Mark as played
      const verseId = verse.number !== '-1' ? verse.number : verse.lines[0];
      markVerseAsPlayed(verseId);
    } else {
      // Second submit - continue to next question
      onAnswer(isCorrect);
    }
  };
  
  return (
    <div class="quiz-container">
      <div class="quiz-header">
        <div class="question-counter">
          Вопрос {questionNumber} из {totalQuestions}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} class="quiz-form">
        <div class="verse-display">
          <div class="verse-text">
            {firstThreeLines.join('\n')}
            {'\n'}
            {showResult ? (
              <strong class="correct-answer">{correctAnswer}</strong>
            ) : (
              <span class="verse-line-placeholder">&nbsp;</span>
            )}
          </div>
          {!showResult ? (
            <div class="answer-line">
              <input
                ref={inputRef}
                type="text"
                value={userAnswer}
                onInput={(e) => setUserAnswer(e.target.value)}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Введите четвёртую строку..."
                class="answer-input"
              />
            </div>
          ) : (
            <div class={`answer-line result-line ${isCorrect ? 'correct' : 'incorrect'}`}>
              <div class="result-text">
                {isCorrect ? 'Правильно!' : `Не ${userAnswer}`}
              </div>
            </div>
          )}
        </div>
        
        <button 
          ref={buttonRef}
          type="submit" 
          disabled={!showResult && !userAnswer.trim()}
          class={`submit-button ${(showResult || userAnswer.trim()) ? 'enabled' : ''}`}
        >
          {showResult ? 'Продолжить' : 'Ответить'}
        </button>
      </form>
      
      {verse.attribution && (
        <div class="attribution">
          {verse.attribution}
        </div>
      )}
    </div>
  );
}

