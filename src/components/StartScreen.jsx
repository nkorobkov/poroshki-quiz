import { useState } from 'preact/hooks';

const EXAMPLES = [
  {
    lines: [
      'покуда есть на белом свете',
      'оттенки и полутона',
      'за белизну не прекратится',
      'война'
    ],
    attribution: '© ab'
  },
  {
    lines: [
      'тебе помогут жизнь и опыт',
      'убавить глупость хоть на треть',
      'но ради этого придётся',
      'стареть'
    ],
    attribution: '© Каркас'
  },
  {
    lines: [
      'любовь способна расширяться',
      'в душе под действием тепла',
      'всё меньше оставляя места',
      'для зла'
    ],
    attribution: '© m-mus'
  },
  {
    lines: [
      'почту за честь знакомство с вами',
      'поскольку в этом что то есть',
      'когда нет чести чтить знакомство',
      'за честь'
    ],
    attribution: '© Znake музз Цай'
  },
  {
    lines: [
      'и глянул лось печально в небо',
      'а небо видит в чаще лось',
      'стоит и смотрит как то странно',
      'насквозь'
    ],
    attribution: '© зажатый'
  },
  {
    lines: [
      'на склоне фудзи в час заката',
      'найти улитку пожирней',
      'и с диким хохотом погнаться',
      'за ней'
    ],
    attribution: '© колик'
  },
  {
    lines: [
      'последний стул смеялся бендер',
      'мы с вами будем жить как знать',
      'как знать промямлил киса тихо',
      'как знать'
    ],
    attribution: '© stakhanoff'
  },
  {
    lines: [
      'стыдясь врождённого изъяна',
      'дальтоник нео в мандраже',
      'глядел на пару идентичных',
      'драже'
    ],
    attribution: '© YanaKrilova'
  },
  {
    lines: [
      'билет вагон и проводница',
      'гул пассажиров крепкий чай',
      'куда приеду сам не знаю',
      'встречай'
    ],
    attribution: '© enotas'
  }
];

export function StartScreen({ onStart, onResume }) {
  const [showMoreRules, setShowMoreRules] = useState(false);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  
  const nextExample = () => {
    setCurrentExampleIndex((prev) => (prev + 1) % EXAMPLES.length);
  };
  
  const currentExample = EXAMPLES[currentExampleIndex];
  
  return (
    <div class="start-screen">
      <h1 class="title">Порошки — Викторина</h1>
      <p class="subtitle">
        Угадайте четвёртую строку стихотворения по первым трём!
      </p>
      
      <div class="rules">
        <h3>Правила:</h3>
        <ul>
          <li>В каждом раунде 10 вопросов</li>
          <li>Вам покажут первые 3 строки стихотворения</li>
          <li>Нужно угадать четвёртую строку</li>
        </ul>
        
        <div class="more-rules-toggle" onClick={() => setShowMoreRules(!showMoreRules)}>
          Еще...
        </div>
        
        {showMoreRules && (
          <div class="more-rules">
            <ul>
              <li>В четвертой строке всегда ровно два слога</li>
              <li>Вторая и четвёртая строки рифмуются</li>
              <li>Используются только строчные буквы и пробелы</li>
              <li>Обычно в порошке заключена законченная идея, отсылка или шутка</li>
              <li>Речь может быть как прямой, так и косвенной</li>
            </ul>
            
            <div class="example-verse">
              <div class="example-title">Пример:</div>
              <div class="example-carousel">
                <div class="example-text">
                  {currentExample.lines.join('\n')}
                </div>
                {currentExample.attribution && (
                  <div class="example-attribution">
                    {currentExample.attribution}
                  </div>
                )}
                <button class="example-next" onClick={nextExample} aria-label="Следующий пример">
                  →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div class="start-actions">
        {onResume && (
          <button onClick={onResume} class="button button-primary button-large">
            Продолжить игру
          </button>
        )}
        <button onClick={onStart} class="button button-primary button-large">
          {onResume ? 'Новый раунд' : 'Начать игру'}
        </button>
      </div>
    </div>
  );
}

