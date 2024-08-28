const images = Array.from({length: 8}, (_, i) => i + 1).flatMap(num => [num, num]);
let flippedCard = null;
let lockBoard = false;
let timerId = null;
const grid = document.querySelector('.grid');
const message = document.getElementById('message');

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createCard(image) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.image = image;

    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">?</div>
            <div class="card-back">${image}</div>
        </div>
    `;

    card.addEventListener('click', flipCard);
    return card;
}

function flipCard() {
    if (lockBoard || this === flippedCard) return;

    this.querySelector('.card-inner').style.transform = 'rotateY(180deg)';
    if (!flippedCard) {
        flippedCard = this;
        startTimer();
    } else {
        const currentCard = this;

        if (currentCard.dataset.image === flippedCard.dataset.image) {
            currentCard.classList.add('hidden');
            flippedCard.classList.add('hidden');
            resetBoard();
            checkWin();
        } else {
            lockBoard = true;
            setTimeout(() => {
                currentCard.querySelector('.card-inner').style.transform = 'rotateY(0deg)';
                flippedCard.querySelector('.card-inner').style.transform = 'rotateY(0deg)';
                resetBoard();
            }, 1000);
        }
    }
}

function startTimer() {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
        flippedCard.querySelector('.card-inner').style.transform = 'rotateY(0deg)';
        resetBoard();
    }, 5000);
}

function resetBoard() {
    flippedCard = null;
    lockBoard = false;
    clearTimeout(timerId);
}

function checkWin() {
    const hiddenCards = document.querySelectorAll('.hidden');
    if (hiddenCards.length === images.length) {
        message.textContent = "You win!";
    }
}

function resetGame() {
    message.textContent = '';
    grid.innerHTML = '';
    flippedCard = null;
    lockBoard = false;
    clearTimeout(timerId);
    const shuffledImages = shuffle(images);
    shuffledImages.forEach(image => {
        const card = createCard(image);
        grid.appendChild(card);
    });
}

document.getElementById('reset').addEventListener('click', resetGame);
resetGame();