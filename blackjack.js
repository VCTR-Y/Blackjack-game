document.addEventListener("DOMContentLoaded", function() {
  createDeck();
  document.querySelector('.bal').innerHTML = "Balance: $" +  balance;
  disableButtons();
  document.getElementById('split').disabled = true;
})

const val = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
const suit = ["clubs","spades","diamonds","hearts"];
let deck = [];
let dealerSum = 0;
let dealerHand = [];
let playerSum = 0;
let playerHand = [];
let dealerDrawInterval;
let doubleTimeout;
let balance = 1000;
let bet = 0;
const audio = new Audio('music.mp3');
audio.loop = true;

function createDeck() {
  for (let i = 0; i < suit.length; i++) {
    for (let j = 0; j < val.length; j++) {
      deck.push(val[j] + "_of_" + suit[i]);
    }
  }
  shuffle();
}

function shuffle() {
  for (let i = 0; i < deck.length; i++) {
    let a = Math.floor(Math.random() * deck.length);
    let curr = deck[i];
    deck[i] = deck[a];
    deck[a] = curr;
  }
}

function startGame() {
  for (let i = 0; i < 2; i++) {
    nextCard = deck.pop();
    playerHand.push(nextCard);
    playerSum = calculateSum(playerHand);
    let cardImg = document.createElement("img");
    cardImg.src = "PNG-cards-1.3/"+ nextCard + ".png";
    document.getElementById("player-cards").append(cardImg);
  }
    nextCard = deck.pop();
    dealerHand.push(nextCard);
    dealerSum = calculateSum(dealerHand);
    let dealerSumHidden = dealerSum;
    let cardImg = document.createElement('img');
    cardImg.src = "PNG-cards-1.3/" + nextCard + ".png";
    document.getElementById('dealer-cards').append(cardImg);

    nextCard = deck.pop();
    dealerHand.push(nextCard);
    dealerSum = calculateSum(dealerHand);
    cardImg = document.createElement('img');
    cardImg.src = "PNG-cards-1.3/BACK.png";
    document.getElementById('dealer-cards').append(cardImg);

    document.querySelector('.dealer-sum').innerHTML = dealerSumHidden;
    document.querySelector('.player-sum').innerHTML = playerSum;
}

function placeBet() {
  bet = parseInt(document.getElementById('input').value, 10);
  console.log(bet);
  if (balance === 0) {
    alert("You're out of money");
    return;
  } else if (bet < 0) {
    alert("Your bet can't be negative!");
    return;
  } else if (bet === '') {
    alert("Please place a bet first!");
    return;
  } else if (bet > balance) {
    alert("You can't bet more than your balance!");
    return;
  } 
  reset();
  balance = balance - bet;
  document.querySelector('.bal').innerHTML = "Balance: $" + balance;
  if (bet > balance) {
    document.getElementById('double').disabled = true;
  } else {
    document.getElementById('double').disabled = false;
  }
  document.getElementById('bet').disabled = true
}

function calculateSum(hand) {
  let sum = 0;
  let aces = 0;

  for (let card of hand) {
    let cardVal = getVal(card);
    sum += cardVal;

    if (cardVal === 11) {
      aces++;
    }
  }

  while (sum > 21 && aces > 0) {
    sum -= 10;
    aces--;
  }
  
  return sum;
}

function getVal(card) {
  let c = card.split('_of_');
  let val = c[0];
  if ((val == 'J') || (val == 'Q') || (val == 'K')) {
    return 10;
  } else if (val == 'A') {
    return 11;
  } else {
    return parseInt(val);
  }
}

function double() {
  hit();
  balance -= bet;
  bet = bet * 2;
  document.querySelector('.bal').innerHTML = "Balance: $" +  balance;
  disableButtons();
  doubleTimeout = setTimeout(() => {
    if (playerSum <= 21) {
      stand();
    }
  }, 750);
}

function hit() {
  if (playerSum < 21) {
    let nextCard = deck.pop();
    playerHand.push(nextCard);
    playerSum = calculateSum(playerHand);
    let cardImg = document.createElement('img');
    cardImg.src = "PNG-cards-1.3/" + nextCard + ".png";
    document.getElementById("player-cards").append(cardImg);
    document.querySelector('.player-sum').innerHTML = playerSum;

    if (playerSum > 21) {
      document.querySelector('.result').innerHTML = "BUST! You lose";
      disableButtons();
      document.getElementById('bet').disabled = false;
    }
  }
}

function stand() {
  let backCard = document.getElementById("dealer-cards");
  document.getElementById("dealer-cards").removeChild(backCard.lastChild);
  let hiddenCard = document.createElement("img");
  hiddenCard.src = "PNG-cards-1.3/" + dealerHand[1] + ".png";
  document.getElementById("dealer-cards").append(hiddenCard)
  document.querySelector('.dealer-sum').innerHTML = dealerSum;

  if (dealerSum < 17) {
    dealerDrawInterval = setInterval(dealerDraw, 750);
  } else {
    getResult();
  }
  disableButtons();
  document.getElementById('bet').disabled = false;
}

function split() {
  // TODO
}

function dealerDraw() {
  let nextCard = deck.pop();
  dealerHand.push(nextCard);
  dealerSum = calculateSum(dealerHand);
  let cardImg = document.createElement("img");
  cardImg.src = "PNG-cards-1.3/" + nextCard + ".png";
  document.getElementById("dealer-cards").append(cardImg);
  document.querySelector('.dealer-sum').innerHTML = dealerSum;

  if (dealerSum >= 17) {
    clearInterval(dealerDrawInterval);
    getResult();
  }
}

function getResult() {
  if (dealerSum > 21) {
    document.querySelector('.result').innerHTML = "Dealer busts, you win!";
    if (checkBlackJack()) {
      balance += bet * 2.5;
    } else {
      balance += bet * 2;
    }
    document.querySelector('.bal').innerHTML = "Balance: $" +  balance;
  } else if ((dealerSum == 21) && (dealerHand.length == 2)) {
    if ((playerSum == 21) && (playerHand.length == 2)) {
      document.querySelector('.result').innerHTML = "Dealer has Blackjack! Push!";
      balance += bet;
      document.querySelector('.bal').innerHTML = "Balance: $" + balance;
    } else {
      document.querySelector('.result').innerHTML = "Dealer has Blackjack! You lose!";
    }
  } else if (playerSum > dealerSum) {
    document.querySelector('.result').innerHTML = "You win!";
    if (checkBlackJack()) {
      balance += bet * 2.5;
    } else {
      balance += bet * 2;
    }
    document.querySelector('.bal').innerHTML = "Balance: $" + balance;
  } else if (playerSum < dealerSum) {
    document.querySelector('.result').innerHTML = "You lose!";
  } else {
    document.querySelector('.result').innerHTML = "Push!";
    balance += bet;
    document.querySelector('.bal').innerHTML = "Balance: $" + balance;
  }
}

function checkBlackJack() {
  if (playerSum == 21 && playerHand.length == 2) {
    return true;
  }
}

function reset() {
  clearInterval(dealerDrawInterval);
  clearTimeout(doubleTimeout);
  document.getElementById('player-cards').innerHTML = '';
  document.getElementById('dealer-cards').innerHTML = '';
  document.querySelector('.result'). innerHTML = '';
  dealerSum = 0;
  dealerHand = [];
  playerSum = 0;
  playerHand = [];
  deck = [];
  createDeck();
  startGame();
  enableButtons();
}

function disableButtons() {
  document.getElementById('double').disabled = true;
  document.getElementById('hit').disabled = true;
  document.getElementById('stand').disabled = true;
}

function enableButtons() {
  document.getElementById('double').disabled = false;
  document.getElementById('hit').disabled = false;
  document.getElementById('stand').disabled = false;
}

function playMusic() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

