import { AssigneeType } from "./assigneeType.model";
import { TodoStatus } from "./todoStatus.model";

export interface Todo {
    id?: number; // Optional as it will be assigned by the backend
    title: string;
    description: string;
     status: TodoStatus;
    assignees: number[]; // Array to store selected relative IDs
  assignee: AssigneeType; // New property for assignee
  createdAt?: Date; // Optional creation timestamp
  color?: string,

  }

export { AssigneeType, TodoStatus };
  