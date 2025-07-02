// Game data and configuration
const GAME_DATA = {
  choices: [
    { name: 'rock', emoji: '🗿' },
    { name: 'paper', emoji: '📄' },
    { name: 'scissors', emoji: '✂️' }
  ],
  rules: {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper'
  },
  messages: {
    win: 'You Win! 🎉',
    lose: 'You Lose! 😢',
    tie: "It's a Tie! 🤝"
  },
  explanations: {
    'rock-scissors': 'Rock crushes Scissors',
    'paper-rock': 'Paper covers Rock',
    'scissors-paper': 'Scissors cuts Paper'
  }
};

// Game state
class GameState {
  constructor() {
    this.playerScore = 0;
    this.computerScore = 0;
    this.currentPlayerChoice = null;
    this.currentComputerChoice = null;
    this.lastResult = null;
    this.gameInProgress = false;
  }

  reset() {
    this.playerScore = 0;
    this.computerScore = 0;
    this.currentPlayerChoice = null;
    this.currentComputerChoice = null;
    this.lastResult = null;
    this.gameInProgress = false;
  }

  updateScore(result) {
    if (result === 'win') {
      this.playerScore++;
    } else if (result === 'lose') {
      this.computerScore++;
    }
  }
}

// Game logic functions
function getRandomChoice() {
  const randomIndex = Math.floor(Math.random() * GAME_DATA.choices.length);
  return GAME_DATA.choices[randomIndex].name;
}

function determineWinner(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    return 'tie';
  }
  
  if (GAME_DATA.rules[playerChoice] === computerChoice) {
    return 'win';
  }
  
  return 'lose';
}

function getChoiceData(choiceName) {
  return GAME_DATA.choices.find(choice => choice.name === choiceName);
}

function getResultExplanation(playerChoice, computerChoice, result) {
  if (result === 'tie') {
    return 'Both players chose the same!';
  }
  
  const winningChoice = result === 'win' ? playerChoice : computerChoice;
  const losingChoice = result === 'win' ? computerChoice : playerChoice;
  const explanationKey = `${winningChoice}-${losingChoice}`;
  
  return GAME_DATA.explanations[explanationKey] || '';
}

// DOM elements
const elements = {
  playerScore: document.getElementById('player-score'),
  computerScore: document.getElementById('computer-score'),
  choiceButtons: document.querySelectorAll('.choice-btn'),
  currentChoices: document.getElementById('current-choices'),
  playerChoiceEmoji: document.getElementById('player-choice-emoji'),
  playerChoiceName: document.getElementById('player-choice-name'),
  computerChoiceEmoji: document.getElementById('computer-choice-emoji'),
  computerChoiceName: document.getElementById('computer-choice-name'),
  resultSection: document.getElementById('result-section'),
  resultMessage: document.getElementById('result-message'),
  resultExplanation: document.getElementById('result-explanation'),
  playAgainBtn: document.getElementById('play-again-btn'),
  resetBtn: document.getElementById('reset-btn')
};

// Game instance
const gameState = new GameState();

// UI update functions
function updateScoreDisplay() {
  elements.playerScore.textContent = gameState.playerScore;
  elements.computerScore.textContent = gameState.computerScore;
}

function updateChoiceDisplay() {
  const playerChoice = getChoiceData(gameState.currentPlayerChoice);
  const computerChoice = getChoiceData(gameState.currentComputerChoice);
  
  elements.playerChoiceEmoji.textContent = playerChoice.emoji;
  elements.playerChoiceName.textContent = playerChoice.name.charAt(0).toUpperCase() + playerChoice.name.slice(1);
  
  elements.computerChoiceEmoji.textContent = computerChoice.emoji;
  elements.computerChoiceName.textContent = computerChoice.name.charAt(0).toUpperCase() + computerChoice.name.slice(1);
  
  elements.currentChoices.style.display = 'flex';
  elements.currentChoices.classList.add('fade-in');
}

function updateResultDisplay() {
  const result = gameState.lastResult;
  const message = GAME_DATA.messages[result];
  const explanation = getResultExplanation(
    gameState.currentPlayerChoice, 
    gameState.currentComputerChoice, 
    result
  );
  
  elements.resultMessage.textContent = message;
  elements.resultExplanation.textContent = explanation;
  
  // Remove previous result classes
  elements.resultSection.classList.remove('win', 'lose', 'tie');
  elements.resultSection.classList.add(result);
  
  elements.resultSection.style.display = 'block';
  elements.resultSection.classList.add('fade-in');
  
  elements.playAgainBtn.style.display = 'inline-flex';
}

function hideGameResults() {
  elements.currentChoices.style.display = 'none';
  elements.resultSection.style.display = 'none';
  elements.playAgainBtn.style.display = 'none';
  
  // Remove animation classes
  elements.currentChoices.classList.remove('fade-in');
  elements.resultSection.classList.remove('fade-in');
}

function clearChoiceSelection() {
  elements.choiceButtons.forEach(btn => {
    btn.classList.remove('selected', 'animate-selection');
  });
}

function disableChoiceButtons(disabled = true) {
  elements.choiceButtons.forEach(btn => {
    btn.disabled = disabled;
    if (disabled) {
      btn.style.opacity = '0.6';
      btn.style.cursor = 'not-allowed';
    } else {
      btn.style.opacity = '';
      btn.style.cursor = 'pointer';
    }
  });
}

// Game flow functions
function playRound(playerChoice) {
  if (gameState.gameInProgress) return;
  
  gameState.gameInProgress = true;
  gameState.currentPlayerChoice = playerChoice;
  gameState.currentComputerChoice = getRandomChoice();
  gameState.lastResult = determineWinner(playerChoice, gameState.currentComputerChoice);
  
  // Add selection animation to clicked button
  const selectedButton = document.querySelector(`[data-choice="${playerChoice}"]`);
  selectedButton.classList.add('selected', 'animate-selection');
  
  // Disable buttons during game play
  disableChoiceButtons(true);
  
  // Show results after a brief delay for better UX
  setTimeout(() => {
    updateChoiceDisplay();
    setTimeout(() => {
      updateResultDisplay();
      gameState.updateScore(gameState.lastResult);
      updateScoreDisplay();
    }, 300);
  }, 600);
}

function resetRound() {
  gameState.gameInProgress = false;
  hideGameResults();
  clearChoiceSelection();
  disableChoiceButtons(false);
}

function resetGame() {
  gameState.reset();
  updateScoreDisplay();
  resetRound();
}

// Event listeners
function setupEventListeners() {
  // Choice button clicks
  elements.choiceButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const choice = e.currentTarget.dataset.choice;
      playRound(choice);
    });
    
    // Add keyboard support
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const choice = e.currentTarget.dataset.choice;
        playRound(choice);
      }
    });
  });
  
  // Play again button
  elements.playAgainBtn.addEventListener('click', resetRound);
  
  // Reset button
  elements.resetBtn.addEventListener('click', resetGame);
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (gameState.gameInProgress) return;
    
    switch(e.key.toLowerCase()) {
      case 'r':
        playRound('rock');
        break;
      case 'p':
        playRound('paper');
        break;
      case 's':
        playRound('scissors');
        break;
      case 'escape':
        if (gameState.currentPlayerChoice) {
          resetRound();
        }
        break;
    }
  });
}

// Initialize game
function initializeGame() {
  updateScoreDisplay();
  hideGameResults();
  setupEventListeners();
  
  // Add some helpful text about keyboard shortcuts
  console.log('🎮 Rock Paper Scissors Game');
  console.log('Keyboard shortcuts: R (Rock), P (Paper), S (Scissors), ESC (Reset round)');
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', initializeGame);

// Add some extra polish with sound effects (optional, commented out)
/*
function playSound(type) {
  // You could add sound effects here
  // const audio = new Audio(`sounds/${type}.mp3`);
  // audio.play().catch(() => {}); // Handle autoplay restrictions
}
*/

// Export for potential testing (in a real app)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    GameState,
    determineWinner,
    getRandomChoice,
    GAME_DATA
  };
}