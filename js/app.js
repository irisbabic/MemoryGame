/**
 @description Declaring global variables.
 */
let cards = document.getElementsByClassName('card');
cards = [...cards];
let deck = document.getElementById('cardDeck');
let openedCards = [];
let move = 0;
let h = 0;
let m = 0;
let s = 0;
let timing = null;
let timer = document.getElementById('timer');
let moves = document.getElementById('move');
let stars = document.getElementById('stars');
let modal = document.getElementById("popup");

/**
 @description Initializes the game with shuffled cards.
 */
const game = () => {
    let shuffledCards = shuffle(cards);
    deck.innerHTML = "";
    for (let card of shuffledCards) {
        card.classList.remove("show", "open", "match", "disabled", "noMatch");
        deck.appendChild(card);
    }
    timer.innerHTML = "Time: 0h : 0m : 0s";
    moves.innerHTML = "Moves : 0";
    stars.innerHTML = '<li><i class=\"fa fa-star\"></i></li>' +
                      ' <li><i class=\"fa fa-star\"></i></li>'+
                      '<li><i class=\"fa fa-star\"></i></li>';
    h = 0;
    m = 0;
    s = 0;
    move = 0;
    clearInterval(timing);
    closeModal();
    openedCards = [];
};

/**
 @description Shuffle function from http://stackoverflow.com/a/2450976.
 @param {array} array - Array of cards to shuffle.
 */
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/**
 @description Waiting for whole DOM content to load.
 */
document.addEventListener('DOMContentLoaded', function () {
    game();
});

/**
 @description Adding event listeners for each card in deck.
 */
for (const card of cards) {
    card.addEventListener('click', function (event) {
        displayCard(event.target);
    });
}

/**
 @description Display card's face when clicked.
 @param {object} currentCard
 */
const displayCard = currentCard => {
    currentCard.classList.add("open");
    currentCard.classList.add("show");
    currentCard.classList.add("disabled");
    cardOpened(currentCard);

};

/**
 @description Add current card to the list of currently opened cards.
 @param {object} currentCard
 */
const cardOpened = currentCard => {
    openedCards.push(currentCard);
    checkCard(openedCards);
};

/**
 @description Perform a check if two cards are a match.
 @param {array} openedCards
 */
const checkCard = openedCards => {
    if (openedCards.length >= 2 && openedCards.length % 2 === 0) {
        moveCounter();
        openedCards[openedCards.length - 1].firstElementChild.className ===
        openedCards[openedCards.length - 2].firstElementChild.className ?
            match(openedCards) : notMatch(openedCards);
    }
};

/**
 @description If cards are a match add match class to both.
 @param {array} openedCards
 */
const match = openedCards => {
    openedCards[openedCards.length - 1].classList.add("match");
    openedCards[openedCards.length - 2].classList.add("match");
    setTimeout(function () {
        if (openedCards.length === 16) {
            finished();
        }
    }, 400);
};

/**
 @description If cards are not a match, add noMatch class to both and turn them face down again.
 @param {array} openedCards
 */
const notMatch = (openedCards) => {
    for (const card of cards) {
        card.classList.add("disabled");
    }
    openedCards[openedCards.length - 1].classList.toggle("noMatch");
    openedCards[openedCards.length - 2].classList.toggle("noMatch");
    setTimeout(function () {
        openedCards[openedCards.length - 1].classList.remove("show", "open", "noMatch");
        openedCards[openedCards.length - 2].classList.remove("show", "open", "noMatch");
        openedCards.pop();
        openedCards.pop();

        let difference = cards.filter(card => !openedCards.includes(card));
        for (const card of cards) {
            for (const disabledCard of difference) {
                if (card === disabledCard) {
                    card.classList.remove("disabled");
                }
            }
        }

    }, 1000);
};


/**
 @description Count moves made and lower the rating if 10 or more moves are made.
 */
const moveCounter = () => {
    move++;
    moves.innerHTML = `Moves: ${move}`;
    if (move === 1) {
        time();
    }
    if (move === 10) {
        stars.removeChild(stars.lastElementChild);
    }
    if (move === 16) {
        stars.removeChild(stars.lastElementChild);
    }
};

/**
 @description Track time of a game.
 */
const time = () => {
    timing = setInterval(function () {
        timer.innerHTML = `Time: ${h}h : ${m}m : ${s}s`;
        s++;
        if (s === 60) {
            m++;
            s = 0;
        }

        if (m === 60) {
            h++;
            m = 0;
        }
    }, 1000);
};

/**
 @description When all cards are matched, display a congratulations popup window.
 */
const finished = () => {

    const finalTime = timer.innerHTML;
    timer.innerHTML = "Time: 0h : 0m : 0s";
    clearInterval(timing);
    modal.classList.add("show");

    document.getElementById("moves").innerHTML = move;
    document.getElementById("rating").innerHTML = stars.innerHTML;
    document.getElementById("time").innerHTML = finalTime;
};

/**
 @description Close popup window.
 */
const closeModal = () => {
    modal.classList.remove("show");
};
