const cards = document.querySelectorAll('.memory-card'); 
const replayButton = document.getElementById('replay-button');
const memoryGameSection = document.querySelector('.memory-game');
const flipContainer = document.getElementById('flip-container');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let pairsFound = 0;
let flipCounter = 0;

const deniedRing = () => {
  const audio = new Audio();
  audio.src = "song/denied.mp3";
  audio.play();
}

const foundRing = () => {
  const audio = new Audio();
  audio.src = "song/found.mp3";
  audio.play();
}

const endGameRing = () => {
  const audio = new Audio();
  audio.src = "song/end-game.mp3";
  audio.play();
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');
    flipCounter++;
    flipContainer.textContent = `Flips: ${flipCounter}`;

    if (!hasFlippedCard) {
      // primo click
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    // secondo click
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.image === secondCard.dataset.image;

    isMatch ? disableCards() : unflipCards();

    setTimeout (() => {
      firstCard.classList.add('shake');
      secondCard.classList.add('shake');
    }, 800 ); 
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    pairsFound++;

    setTimeout (() => {
      foundRing();;
     },800);

    if (pairsFound === cards.length / 2) {
        setTimeout(() => {
            endGameAnimation();
            endGameRing();
        }, 1200);
    }

    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('shake');
        secondCard.classList.remove('shake');
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);

    setTimeout (() => {
        deniedRing();
    },800);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * cards.length);
        card.style.order = randomPos;
    });
}

function restartGame() {
    pairsFound = 0;
    flipCounter = 0;
    flipContainer.textContent = `Flips: ${flipCounter}`;
    cards.forEach(card => {
        card.classList.remove('flip');
        card.addEventListener('click', flipCard);
    });
    memoryGameSection.classList.remove('end-game');
    shuffle();
}

function endGameAnimation() {
    memoryGameSection.classList.add('end-game');
    setTimeout(() => {
        alert('Congratulations! You found all pairs. Click REPLAY to play again.');
    }, 1000);
}

cards.forEach(card => card.addEventListener('click', flipCard));
replayButton.addEventListener('click', restartGame);

shuffle();
