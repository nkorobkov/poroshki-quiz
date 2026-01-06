import { getPlayedCount } from '../utils/storage';

export function Score({ score, total, onNewRound, totalVerses }) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const playedCount = getPlayedCount();
  const availableVerses = totalVerses - playedCount;
  const canPlayAgain = availableVerses >= 10;
  
  return (
    <div class="score-container">
      <div class="score-header">
        <h2>Результаты раунда</h2>
      </div>
      
      <div class="score-display">
        <div class="score-circle">
          <div class="score-number">{score}</div>
          <div class="score-total">из {total}</div>
        </div>
        <div class="score-percentage">
          {percentage}%
        </div>
      </div>
      
      <div class="score-stats">
        <div class="stat-item">
          <div class="stat-label">Правильных ответов</div>
          <div class="stat-value">{score}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Всего вопросов</div>
          <div class="stat-value">{total}</div>
        </div>
      </div>
      
      {canPlayAgain && (
        <div class="score-actions">
          <button onClick={onNewRound} class="button button-primary">
            Новый раунд
          </button>
        </div>
      )}
      
      {!canPlayAgain && (
        <div class="score-message">
          Вы сыграли все доступные стихи!
        </div>
      )}
    </div>
  );
}

