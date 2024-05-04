import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services2/todo.service';

interface Card {
  value: string;
  flipped: boolean;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  cards: Card[] = [];
  flippedCards: Card[] = [];
  readonly cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  gameInProgress = true;
  gameOverMessage = '';

  selectedGame: string = ''; // Initially no game is selected

constructor(private gameService:TodoService){}
  ngOnInit(): void {
    this.initializeGame();    this.gameService.initializeSnakeGame();
    this.selectGame('rocket');

  }

  initializeGame(): void {
    this.cards = [];
    this.flippedCards = [];
    const values = [...this.cardValues, ...this.cardValues]; // Create pairs of card values

    // Shuffle the values
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }

    // Create cards with shuffled values
    values.forEach(value => {
      this.cards.push({ value, flipped: false });
    });
  }

  flipCard(card: Card): void {
    if (this.gameInProgress && !card.flipped && this.flippedCards.length < 2) {
      card.flipped = true;
      this.flippedCards.push(card);
  
      if (this.flippedCards.length === 2) {
        setTimeout(() => {
          this.checkMatch();
        }, 1000);
      }
    }
  }
  
  checkMatch(): void {
    if (this.flippedCards[0].value === this.flippedCards[1].value) {
      this.flippedCards.forEach(card => card.flipped = true);
    } else {
      this.flippedCards.forEach(card => card.flipped = false);
    }
  
    this.flippedCards = [];
    this.checkGameStatus();
  }

  checkGameStatus(): void {
    const flippedCount = this.cards.filter(card => card.flipped).length;
    if (flippedCount === this.cards.length) {
      this.gameInProgress = false;
      this.gameOverMessage = 'Congratulations! You have completed the game.';
    }
  }

  playAgain(): void {
    this.gameInProgress = true;
    this.gameOverMessage = '';
    this.initializeGame();
  }
     selectGame(game) {
      const memoryContainer = document.getElementById('memory-game-container');
      const rocketContainer = document.getElementById('rocket-game-container');
      const snakeContainer = document.getElementById('snake-game-container');

      memoryContainer.classList.remove('active');
      rocketContainer.classList.remove('active');
      snakeContainer.classList.remove('active');

      switch (game) {
          case 'memory':
              memoryContainer.classList.add('active');
              break;
          case 'rocket':
              rocketContainer.classList.add('active');
              break;
          case 'snake':
              snakeContainer.classList.add('active');
              
              break;
          default:
              break;
      }
  }

  // Initialize the page with the Memory game active
  }
