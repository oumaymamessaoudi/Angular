 import { Board } from "./board.model";
import { Card } from "./card.model";

export interface ListE {
    id: number;
    name: string;
    board?: Board; // Optional if you don't always fetch boards with lists
    cards?: Card[]; // Optional if you don't always fetch cards with lists
  }