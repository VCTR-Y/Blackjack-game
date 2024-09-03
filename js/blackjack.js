document.addEventListener("DOMContentLoaded", function() {
  createDeck();
  document.querySelector('.bal').innerHTML = "Balance: $" +  balance;
  disableButtons();
})

const val = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
const suit = ["clubs","spades","diamonds","hearts"];
let deck = [];
let dealerSum = 0;
let dealerHand = [];
let playerSum = 0;
let playerHand = [];
let splitHand1 = [];
let splitSum1 = 0;
let splitHand2 = [];
let splitSum2 = 0;
let dealerDrawInterval;
let doubleTimeout;
let balance = 1000;
let bet = 0;
let isSplit = false;
let splitStand2 = false;
let splitStand1 = false;
const audio = new Audio('audio/music.mp3');
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
    let nextCard = deck.pop();
    playerHand.push(nextCard);
    playerSum = calculateSum(playerHand);
    let cardImg = document.createElement("img");
    cardImg.src = "images/PNG-cards-1.3/"+ nextCard + ".png";
    document.getElementById("player-cards").append(cardImg);
  }
  nextCard = deck.pop();
  dealerHand.push(nextCard);
  dealerSum = calculateSum(dealerHand);
  let dealerSumHidden = dealerSum;
  let cardImg = document.createElement('img');
  cardImg.src = "images/PNG-cards-1.3/" + nextCard + ".png";
  document.getElementById('dealer-cards').append(cardImg);

  nextCard = deck.pop();
  dealerHand.push(nextCard);
  dealerSum = calculateSum(dealerHand);
  cardImg = document.createElement('img');
  cardImg.src = "images/PNG-cards-1.3/BACK.png";
  document.getElementById('dealer-cards').append(cardImg);

  document.querySelector('.dealer-sum').innerHTML = dealerSumHidden;
  document.querySelector('.player-sum').innerHTML = playerSum;
}

function placeBet() {
  bet = document.getElementById('input').value;
  if (bet === '') {
    alert("Please place a bet first!");
    return;
  }
  bet = parseInt(bet, 10);
  console.log(bet);
  if (balance === 0) {
    alert("You're out of money");
    return;
  } else if (bet < 0) {
    alert("Your bet can't be negative!");
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

  if (getVal(playerHand[0]) === getVal(playerHand[1]) && bet < balance) {
    document.getElementById('split').disabled = false;
  }
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
  if (isSplit) {
    if (splitStand2) {
      let nextCard = deck.pop();
      splitHand1.push(nextCard);
      splitSum1 = calculateSum(splitHand1);
      let cardImg = document.createElement("img");
      cardImg.src = "images/PNG-cards-1.3/" + nextCard + ".png";
      document.getElementById("split1-cards").append(cardImg);
      document.querySelector('.split1-sum').innerHTML = splitSum1;
      checkBust();
    } else {
      if (splitSum2 <= 21) {
        let nextCard = deck.pop();
        splitHand2.push(nextCard);
        splitSum2 = calculateSum(splitHand2);
        let cardImg = document.createElement("img");
        cardImg.src = "images/PNG-cards-1.3/" + nextCard + ".png";
        document.getElementById("split2-cards").append(cardImg);
        document.querySelector('.split2-sum').innerHTML = splitSum2;
        checkBust();
      }
    }
  } else {
    document.getElementById('double').disabled = true;
    document.getElementById('split').disabled = true;
    if (playerSum <= 21) {
      let nextCard = deck.pop();
      playerHand.push(nextCard);
      playerSum = calculateSum(playerHand);
      let cardImg = document.createElement('img');
      cardImg.src = "images/PNG-cards-1.3/" + nextCard + ".png";
      document.getElementById("player-cards").append(cardImg);
      document.querySelector('.player-sum').innerHTML = playerSum;
      checkBust();
    }
  }
}

function checkBust() {
  if (isSplit) {
    if (splitStand2 === false && splitSum2 > 21) {
      document.querySelector('.split2-result').innerHTML = "BUST!";
      splitStand2 = true;
      document.getElementById("split2-cards").style.setProperty("border", "none")
      document.getElementById("split1-cards").style.setProperty("border", "3px solid yellow")
    } else if (splitSum1 > 21) {
      document.querySelector('.split1-result').innerHTML = "BUST!";
      document.getElementById("split1-cards").style.setProperty("border", "none")
      if (document.querySelector('.split2-result').innerHTML === "BUST!" && document.querySelector('.split1-result').innerHTML === "BUST!") {
        document.querySelector('.main-result').innerHTML = "You Lose!";
        return;
      }
      stand();
    }
  } else {
    if (playerSum > 21) {
      document.querySelector('.main-result').innerHTML = "BUST! You lose";
      disableButtons();
      document.getElementById('bet').disabled = false;
    }
  }
}

function stand() {
  if (isSplit) {
    if (splitStand2 === false) {
      splitStand2 = true;
      document.getElementById("split2-cards").style.setProperty("border", "none")
      document.getElementById("split1-cards").style.setProperty("border", "3px solid yellow")
      return;
    } else if (splitStand1 === false) {
      document.getElementById("split1-cards").style.setProperty("border", "none")
    } 
  }
  let backCard = document.getElementById("dealer-cards");
  document.getElementById("dealer-cards").removeChild(backCard.lastChild);
  let hiddenCard = document.createElement("img");
  hiddenCard.src = "images/PNG-cards-1.3/" + dealerHand[1] + ".png";
  document.getElementById("dealer-cards").append(hiddenCard)
  document.querySelector('.dealer-sum').innerHTML = dealerSum;

  if (dealerSum < 17) {
    dealerDrawInterval = setInterval(dealerDraw, 750);
  } else {
    if (isSplit) {
      getSplitResult()
    } else {
      getResult();
    }
  }
  disableButtons();
}

function split() {
  isSplit = true;
  balance -= bet;
  bet *= 2;
  document.querySelector('.bal').innerHTML = "Balance: $" +  balance;

  removePlayerSumContainer("player");
  addSumContainer("split1");
  addSumContainer("split2");
  document.getElementById("split2-cards").style.setProperty("border", "3px solid yellow")

  document.querySelector(".player-sum").innerHTML= '';

  let secondCard = playerHand.pop();
  let firstCard = playerHand.pop();
  splitHand1.push(firstCard);
  splitHand2.push(secondCard);

  document.getElementById("player-cards").innerHTML = '';

  let cardImg = document.createElement('img');
  cardImg.src = "images/PNG-cards-1.3/" + firstCard + ".png";
  document.getElementById("split1-cards").append(cardImg);

  cardImg = document.createElement('img');
  cardImg.src = "images/PNG-cards-1.3/" + secondCard + ".png";
  document.getElementById("split2-cards").append(cardImg);

  splitSum1 = calculateSum(splitHand1);
  splitSum2 = calculateSum(splitHand2);
  document.querySelector('.split1-sum').innerHTML = splitSum1;
  document.querySelector('.split2-sum').innerHTML = splitSum2;

  disableButtons();
  dealSplitCards();
}

function dealSplitCards() {
  setTimeout(() => {
    let nextCard = deck.pop();
    splitHand2.push(nextCard);
    splitSum2 = calculateSum(splitHand2);
    cardImg = document.createElement("img");
    cardImg.src = "images/PNG-cards-1.3/" + nextCard + ".png";
    document.getElementById("split2-cards").append(cardImg);
    document.querySelector('.split2-sum').innerHTML = splitSum2;
  }, 750)

  setTimeout(() => {
    nextCard = deck.pop();
    splitHand1.push(nextCard);
    splitSum1 = calculateSum(splitHand1);
    cardImg = document.createElement("img");
    cardImg.src = "images/PNG-cards-1.3/" + nextCard + ".png";
    document.getElementById("split1-cards").append(cardImg);
    document.querySelector('.split1-sum').innerHTML = splitSum1;
    enableButtons();
    document.getElementById('double').disabled = true;
  }, 750)

}

function removePlayerSumContainer(name) {
  document.getElementById(name + "-sum-container").style.setProperty("width", 0);
  document.getElementById(name + "-sum-container").style.setProperty("height", 0);
  document.getElementById(name + "-sum-container").style.setProperty("border", "none");
}

function addSumContainer(name) {
  document.getElementById(name + "-sum-container").style.setProperty("width", "48px");
  document.getElementById(name + "-sum-container").style.setProperty("height", "48px");
  document.getElementById(name + "-sum-container").style.setProperty("border-radius", "25%");
  document.getElementById(name + "-sum-container").style.setProperty("border", "solid");
  document.getElementById(name + "-sum-container").style.setProperty("border-color", "white");
  document.getElementById(name + "-sum-container").style.setProperty("border-width", "2px");
  document.getElementById(name + "-sum-container").style.setProperty("margin-top", "10px");
  document.getElementById(name + "-sum-container").style.setProperty("background-color", "rgb(0, 0, 0, 0.5)");
  document.getElementById(name + "-sum-container").style.setProperty("color", "white");
}

function dealerDraw() {
  let nextCard = deck.pop();
  dealerHand.push(nextCard);
  dealerSum = calculateSum(dealerHand);
  let cardImg = document.createElement("img");
  cardImg.src = "images/PNG-cards-1.3/" + nextCard + ".png";
  document.getElementById("dealer-cards").append(cardImg);
  document.querySelector('.dealer-sum').innerHTML = dealerSum;

  if (dealerSum >= 17) {
    clearInterval(dealerDrawInterval);
    if (isSplit) {
      getSplitResult();
    } else {
      getResult();
    }
  }
}

function getResult() {
  if (dealerSum > 21) {
    document.querySelector('.main-result').innerHTML = "Dealer busts, you win!";
    if (checkBlackJack()) {
      balance += bet * 2.5;
    } else {
      balance += bet * 2;
    }
    document.querySelector('.bal').innerHTML = "Balance: $" +  balance;
  } else if (dealerSum === 21 && dealerHand.length === 2) {
    if (playerSum === 21 && playerHand.length === 2) {
      document.querySelector('.main-result').innerHTML = "Dealer has Blackjack! Push!";
      balance += bet;
      document.querySelector('.bal').innerHTML = "Balance: $" + balance;
    } else {
      document.querySelector('.main-result').innerHTML = "Dealer has Blackjack! You lose!";
    }
  } else if (playerSum > dealerSum) {
    document.querySelector('.main-result').innerHTML = "You win!";
    if (checkBlackJack()) {
      balance += bet * 2.5;
    } else {
      balance += bet * 2;
    }
    document.querySelector('.bal').innerHTML = "Balance: $" + balance;
  } else if (playerSum < dealerSum) {
    document.querySelector('.main-result').innerHTML = "You lose!";
  } else {
    if (checkBlackJack()) {
      balance += bet * 2.5;
      document.querySelector('.main-result').innerHTML = "You win!";
    } else {
      document.querySelector('.main-result').innerHTML = "Push!";
      balance += bet;
    }
    document.querySelector('.bal').innerHTML = "Balance: $" + balance;
  }
  document.getElementById('bet').disabled = false;
}

function getSplitResult() {
  if (document.querySelector('.split2-result').innerHTML === "BUST!") {
    if (dealerSum > 21) {
      document.querySelector('.split1-result').innerHTML = "Dealer busts, you win!";
      balance += bet;
    } else if (splitSum1 > dealerSum) {
      document.querySelector('.split1-result').innerHTML = "You win!";
      balance += bet;
    } else if (splitSum1 < dealerSum) {
      document.querySelector('.split1-result').innerHTML = "You lose!";
    } else if (dealerSum === 21 && dealerHand.length === 2) {
      document.querySelector('.split1-result').innerHTML = "Dealer has Blackjack! You lose!";
    } else {
      document.querySelector('.split1-result').innerHTML = "Push!";
      balance += bet / 2;
    }
    document.querySelector('.bal').innerHTML = "Balance: $" + balance;
  } else if (document.querySelector('.split1-result').innerHTML === "BUST!") {
    if (dealerSum > 21) {
      document.querySelector('.split2-result').innerHTML = "Dealer busts, you win!";
      balance += bet;
    } else if (splitSum2 > dealerSum) {
      document.querySelector('.split2-result').innerHTML = "You win!";
      balance += bet;
    } else if (splitSum2 < dealerSum) {
      document.querySelector('.split2-result').innerHTML = "You lose!";
    } else if (dealerSum === 21 && dealerHand.length === 2) {
      document.querySelector('.split2-result').innerHTML = "Dealer has Blackjack! You lose!";
    } else {
      document.querySelector('.split2-result').innerHTML = "Push!";
      balance += bet / 2;
    }
    document.querySelector('.bal').innerHTML = "Balance: $" + balance;
  } else {
    if (dealerSum > 21) {
      document.querySelector('.split2-result').innerHTML = "Dealer busts, you win!";
      document.querySelector('.split1-result').innerHTML = "Dealer busts, you win!";
      balance += bet * 2;
      document.querySelector('.bal').innerHTML = "Balance: $" + balance;
      return;
    }
    if (dealerSum === 21 && dealerHand.length === 2) {
      document.querySelector('.split2-result').innerHTML = "Dealer has Blackjack! You lose!";
      document.querySelector('.split1-result').innerHTML = "Dealer has Blackjack! You lose!";
      return;
    }
    if (splitSum2 > dealerSum) {
      document.querySelector('.split2-result').innerHTML = "You win!";
      balance += bet;
    }
    if (splitSum1 > dealerSum) {
      document.querySelector('.split1-result').innerHTML = "You win!";
      balance += bet;
    }
    if (splitSum2 < dealerSum) {
      document.querySelector('.split2-result').innerHTML = "You lose!";
    }
    if (splitSum1 < dealerSum) {
      document.querySelector('.split1-result').innerHTML = "You lose!";
    }
    if (splitSum2 == dealerSum) {
      document.querySelector('.split2-result').innerHTML = "Push!";
      balance += bet / 2;
    }
    if (splitSum1 == dealerSum) {
      document.querySelector('.split1-result').innerHTML = "Push!";
      balance += bet / 2;
    }
    document.querySelector('.bal').innerHTML = "Balance: $" + balance;
  }
  document.getElementById('bet').disabled = false;
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
  document.getElementById('split1-cards').innerHTML = '';
  document.getElementById('split2-cards').innerHTML = '';
  document.querySelector('.split1-result').innerHTML = '';
  document.querySelector('.main-result'). innerHTML = '';
  document.querySelector('.split2-result').innerHTML = '';
  document.querySelector('.split1-sum').innerHTML = '';
  document.querySelector('.player-sum'). innerHTML = '';
  document.querySelector('.split2-sum').innerHTML = '';
  removePlayerSumContainer('split1');
  removePlayerSumContainer('split2');
  addSumContainer('player');
  dealerSum = 0;
  dealerHand = [];
  playerSum = 0;
  playerHand = [];
  splitHand1 = [];
  splitHand2 = [];
  splitSum1 = 0;
  splitSum2 = 0;
  isSplit = false;
  splitStand2 = false;
  deck = [];
  createDeck();
  startGame();
  enableButtons();
}

function disableButtons() {
  document.getElementById('double').disabled = true;
  document.getElementById('hit').disabled = true;
  document.getElementById('stand').disabled = true;
  document.getElementById('split').disabled = true;
}

function enableButtons() {
  document.getElementById('double').disabled = false;
  document.getElementById('hit').disabled = false;
  document.getElementById('stand').disabled = false;
}

function playMusic() {
  const musicButton = document.querySelector('.music-button');
  if (audio.paused) {
    audio.play();
    musicButton.innerHTML = "Pause Music";
  } else {
    audio.pause();
    musicButton.innerHTML = "Play Music";
  }
}

