import { ListE } from "./ListE.model";
import { Todo } from "./todo.model";

export interface Card {
  id: number; // Unique identifier for the card (if needed)
  title: string; // Title of the card
  content: string; // Content or description of the card
  priority: 'Low' | 'Medium' | 'High'; // Priority level of the card
  listId: number; // ID of the list the card belongs to
  todo: Todo; // The Todo item associated with this card
}
