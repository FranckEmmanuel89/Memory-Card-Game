const cards = document.querySelectorAll('.memory-card');  // seleziona tutti gli elementi con class 'mermory-card'
const replayButton = document.getElementById('replay-button');  // seleziona il buttone replay con l'id
const memoryGameSection = document.querySelector('.memory-game');  // seleziona le section con tutte le carte
const flipContainer = document.getElementById('flip-container');  // seleziona il container che conta il numero di flip
const scoreContainer = document.getElementById('score-container'); // seleziona il conatainer che conta il punteggio delle coppie trovate
const timeContainer = document.getElementById('time-container'); // seleziona il container del timer

let hasFlippedCard = false;  // indica se una carta è stata girata
let lockBoard = false;  // impedisce di girare una carta quando due carte sono già girate
let firstCard, secondCard; // variabile per le due carte girate
let pairsFound = 0;  // numro di coppie trovate
let flipCounter = 0;  // numero di carte girate

const deniedRing = () => {  // function per emettere un suono quando le carte non corrispondono
  const audio = new Audio();
  audio.src = "song/denied.mp3";
  audio.play();
}

const foundRing = () => {  // function per emettere un suono quando le carte corrispondono
  const audio = new Audio();
  audio.src = "song/found.mp3";
  audio.play();
}

const endGameRing = () => {  // function per emettere un suono a fine partita
  const audio = new Audio();
  audio.src = "song/end-game.mp3";
  audio.play();
}


let secondi = 0; 
let minuti = 0; 
let timeOff = true // all'inizio il timer non parte quindi timeOff true


const timeOn = () => { // funzione che verfica se il timer parte o no
  if (timeOff) {  
    timeOff = false 
    runingTime() // chiamata della funzione per iniziare il timer
  }
}

const stopTime = () => { // funzione per fermare il timer quando la partita è finita
    if (!timeOff) {
      timeOff = true;
    }
  }

const timer = () => {
  secondi++
  if (secondi >= 60) {
    minutes += 1;
    secondi = 0;
  }
}

const runingTime = () => { // funzione per iniziare il timer
  if (timeOff) return; // se il timer è fermo, la funzione non fa niente e si ferma
    secondi = parseInt(secondi); 
    minuti = parseInt(minuti);
    secondi++;

  if (secondi === 60) { // se i secondi sono 60, i muniti aumentano di 1 ed i seocndi prendono il valore 0
    minuti++;
    secondi= 0;

  }

  if (secondi < 10) {  // per poter avere 00 per i secondi ed avere un formato 00:00
    secondi = '0' + secondi;
  }

  if (minuti < 10) { // per poter avere 00 per i minuti ed avere un formato 00:00
    minuti = '0' + minuti;
  }

  timeContainer.textContent = `${minuti}:${secondi}`; // stampa dei minuri e dei secondi nel timeContainer
  timeOut = setTimeout(runingTime, 1000); // la funzione 'runingTime' viene richiamata ogni 1000 ms. Questo permette di incrementare i secondi di 1 ed andare avanti con il timer
  
}

const resetTime = () => { // funzione per risettare il timer e comimciare una nuova partita con un timer 00:00
  timeContainer.textContent = '00:00';
  timeOff = true;
  minuti = 0;
  secondi = 0;
}


function flipCard() {  // verifica se la griglia di giocco è bloccata, o se la carta scelta è la stessa di 'firstCard'.
    if (lockBoard) return;
    if (this === firstCard) return;
    this.classList.add('flip');  // aggiungi la classe 'flip' per girare le carte
    flipCounter++;  // aggiorna la conta dei flip
    flipContainer.textContent = `Flips: ${flipCounter}`; // stampa la conta aggiotnata nel container flip
    timeOn();   

    if (!hasFlippedCard) {  // se nessuna carta è stat girata ( hasFlippedCard è false ) ed assegna come firstCard
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
   
    secondCard = this;   // se una carta è già stata girata, viene assegnata come 'secondCard' e chiama la function 'checkForMatch'
    checkForMatch(); 
}


function checkForMatch() { // verifica se le due carte girate hanno la stessa 'data-image'
    let isMatch = firstCard.dataset.image === secondCard.dataset.image;

    isMatch ? disableCards() : unflipCards(); // se le 'data-image' corrispondono, 'isMath' è vero e chiama la function disableCards, nel caso contrario chiama la unflipCards

    setTimeout (() => { // aggiunge la class shake a la firstCard ed alla secondCard con un delay di 800 ms
      firstCard.classList.add('shake');
      secondCard.classList.add('shake');
    }, 800 ); 
}

function disableCards() { // rimuove l'evento 'click' alle carte che corrispondono. cosi non si possono più girare
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    pairsFound++; // Aunmenta il numero di coppue trovate
    

    setTimeout (() => { // chiamata function per emettere un suono quando le carte corrispondono con un delay di 800 ms
      foundRing();
      scoreContainer.textContent = `Score: ${pairsFound}/8`; // il punteggio viene aggiornato con un delay de 800 ms
     },800);

    if (pairsFound === cards.length / 2) { // se tutte le coppie sono state trovate, emette il suono e l'animazione di fine gioco con un delay di 1200 ms
        stopTime();
        setTimeout(() => {
            endGameAnimation();
            endGameRing();
            confetti();
            setTimeout(() => {
            confetti();
            ocnfetti()
            },1000);
            confetti();
        }, 1200);
    }

    resetBoard(); // reinizializza la griglia
}

function unflipCards() {
    lockBoard = true;  // blocca la griglia per impedire i click durante l'animazione

    setTimeout(() => {  // Rimouve le class 'flip' e 'shake' delle carte con un delai di 1500 ms
        firstCard.classList.remove('shake');
        secondCard.classList.remove('shake');
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();  // reinizializza la griglia
    }, 1500);

    setTimeout (() => { // chiamata della function 'deniedRing' con un delai di 800 ms
        deniedRing();
    },800);
}

function resetBoard() { // reinizializza le variabili 'hasFlippedCard', 'lockBoard', 'firstCard', e secondCard per il prossimo turno
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function shuffle() { // per ogni carta, genera una posizione causuale e l'assegna alla proprietà 'order' del css.
    cards.forEach(card => {
        let randomPosition = Math.floor(Math.random() * cards.length);
        card.style.order = randomPosition;
    });
}

 
function restartGame() { // function per ricominciare il giocco
    resetTime();
    pairsFound = 0; // reinizializza il punteggio delle coppie trovate
    flipCounter = 0; // reinizializza la conta delle carte girate 'flip'
    flipContainer.textContent = `Flips: ${flipCounter}`; // reinizializza il container la conta delle carte girate 'flip'
    scoreContainer.textContent = `Score: ${pairsFound}/8`; // reinizializza il contanier del punteggio delle coppie trovate
    cards.forEach(card => {
        card.classList.remove('flip'); // rimuove l'evento 'flip'a tute le carte per girarle
        card.addEventListener('click', flipCard); // riattiva l'evento 'click' per tutte le carte
    });
    memoryGameSection.classList.remove('end-game'); // rimuove la class 'end-agme' alla section del giocco
    shuffle(); // rimescola le carte chiamando la funzione
}

function endGameAnimation() { // function per l'animazione di fine giocco
    memoryGameSection.classList.add('end-game'); // aggiungi la class 'end-game' a la section del giocco per l'animazione di fine partita
    setTimeout(() => { // visualizzare complimenti hai vinto con un delai di 2500 ms
      alert(
            `Congratulations!!🥳 You found all pairs with ${flipCounter} flips in ${minuti}:${secondi} seconds.
            
                                   Click REPLAY to play again.`);
    }, 3000);
}

cards.forEach(card => card.addEventListener('click', flipCard)); // aggiunge l'evento click ad ogni carta per farle girare quando vengono cliccate
replayButton.addEventListener('click', restartGame); // aggiunge l'evento click al buton replay per fare ricominciare il gioco quando viene cliccato

shuffle(); // mescola le carte ad inizio partita chiamando la function
