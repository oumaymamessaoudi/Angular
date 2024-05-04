import { ListE } from "./ListE.model";

export interface Board {
    id: number;
    name: string;
    lists?: ListE[]; // Optional if you don't always fetch lists with boards
  }
  