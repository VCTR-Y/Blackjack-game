# Blackjack-game

The objective of the game is to beat the dealer, which can be done in the following ways:
* Get 21 points on the player's first two cards (called a blackjack), without a dealer blackjack;
* Reach a final score higher than the dealer without exceeding 21. If you exceed 21, you **bust**, meaning you automatically lose.
* Let the dealer draw additional cards until they bust (exceed 21).

### Card values
- An ace is worth 1 or 11. 
- Face cards are 10
- Any other card is its pip value

The game is implemented with standard 1 deck of cards. After placing a bet and receiving the two initial cards, the player can either: **Hit, Stand , Double (Double Down), and Split**. 

### The rules for each option is described below:

* **Hit**: Player draws another card.
* **Double Down**: After receiving the initial two cards, the player can double their bet for one more additional card before the dealer draws. You cannot double down after hitting.
* **Split**: If the player receives two cards with the same number, the player can split the card into two hands and must place an additional bet equal to theoriginal bet. The blackjack after split is considered as non-blackjack 21. Double cannot be played when split.
* **Stand**: Player takes no more cards and dealer draws the card.

### Following rules are implemented for the dealer in the game.
* Dealer draws until their cards total 17 or more points.

The player is paid according to the standard method. Player gets paid **3:2** for **BlackJack** and **1:1** for a regular win. 

### Additional Rules:
* A blackjack beats any hand that is not a blackjack, even one with a value of 21.
* In the case of a tied score, known as **push**, bets are returned without adjustment.
* An outcome of blackjack vs. blackjack results in a push.

You can play the game here: https://blackjackgameee.netlify.app/
