import { getPlayedCount } from '../utils/storage';
import { generateRoundId } from '../utils/verses';

export function Score({ score, total, onNewRound, totalVerses, currentRound }) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const playedCount = getPlayedCount();
  const availableVerses = totalVerses - playedCount;
  const canPlayAgain = availableVerses >= 10;
  
  // Generate shareable link
  const roundId = currentRound ? generateRoundId(currentRound) : '';
  const shareUrl = roundId ? `${window.location.origin}${window.location.pathname}?round=${roundId}` : '';
  
  const copyToClipboard = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Ссылка скопирована в буфер обмена!');
      }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Ссылка скопирована в буфер обмена!');
      });
    }
  };
  
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
      
      {shareUrl && (
        <div class="share-section">
          <div class="share-label">Поделиться раундом:</div>
          <div class="share-link-container">
            <input 
              type="text" 
              value={shareUrl} 
              readonly 
              class="share-link-input"
              onClick={(e) => e.target.select()}
            />
            <button onClick={copyToClipboard} class="button button-secondary">
              Копировать
            </button>
          </div>
        </div>
      )}
      
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

