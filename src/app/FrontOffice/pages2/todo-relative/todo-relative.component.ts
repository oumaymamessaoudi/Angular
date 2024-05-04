import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TodoService } from '../../services2/todo.service';
import { Todo, TodoStatus } from '../../entities/todo.model';
import { Relative } from '../../entities/relative.model';
import {  Router } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
declare var webkitSpeechRecognition: any;
import {  moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AssigneeType } from '../../entities/todo.model';

@Component({
  selector: 'app-todo-relative',
  templateUrl: './todo-relative.component.html',
  styleUrls: ['./todo-relative.component.css']
})
export class TodoRelativeComponent implements OnInit {
  todos: any[] = [];
  relatives: Relative[] = [];
  elderlyId: number;
  relativeId: number;
  todoStatuses: TodoStatus[] = [
    TodoStatus.PENDING,
    TodoStatus.IN_PROGRESS,
    TodoStatus.COMPLETED,
  ]; 
  constructor(
    private route: ActivatedRoute,
    private todoService: TodoService
  ) {
    this.todos = [
    { id: 1, title: 'Sample Todo 1', description: 'Description 1', status: TodoStatus.PENDING, assignees: [], assignee: AssigneeType.SELF },
    { id: 2, title: 'Sample Todo 2', description: 'Description 2', status: TodoStatus.IN_PROGRESS, assignees: [], assignee: AssigneeType.SELF },
    { id: 3, title: 'Sample Todo 3', description: 'Description 3', status: TodoStatus.COMPLETED, assignees: [], assignee: AssigneeType.SELF },
  ];

}


boardIds = this.todoStatuses.map(status => `todo-${status.toLowerCase()}`);

allowDropPredicate = (drag: any, drop: any) => {
  // Allow dropping into an empty list
  if (drop.data.length === 0) {
    return true;
  }
  return drag.data.status !== drop.data.status;
};


  ngOnInit(): void {
    // Get the relative ID from the URL parameters
    this.route.params.subscribe(params => {
      this.relativeId = +params['relativeId']; // Store relativeId in a separate variable
      console.log('Relative ID:', this.relativeId);

      this.getTodosByRelativeId(this.relativeId);
      this.fetchElderlyIdByRelativeId(this.relativeId);
    });
  }

  fetchElderlyIdByRelativeId(relativeId: number): void {
    this.todoService.getElderlyIdByRelativeId(relativeId).subscribe(
      elderlyId => {
        this.elderlyId = elderlyId;
        this.fetchRelatives(this.elderlyId);
      },
      error => {
        console.error('Error fetching elderly ID:', error);
      }
    );
  }
  isTodoInProgress(todo: Todo): boolean {
    // Assuming you have a property 'status' in your Todo model
    return todo.status === 'IN_PROGRESS'; // Adjust based on your actual status property
  }
  getTodosByRelativeId(relativeId: number): void {
    this.todoService.getTodosByRelativeId(relativeId).subscribe(
      (data: any) => {
        this.todos = data;
      },
      error => {
        console.error('Error fetching todos:', error);
      }
    );
  }

  getAssignedNames(todo: Todo): string {
    const assignedNames = todo.assignees.map(assigneeId => {
      const assignedRelative = this.relatives.find(relative => relative.idRelative === assigneeId);
      return assignedRelative ? assignedRelative.firstName : '';
    });
    return assignedNames.join(', ');
  }

  fetchRelatives(elderlyId: number): void {
    this.todoService.getRelativesByElderlyId(elderlyId).subscribe(
      relatives => {
        this.relatives = relatives.map(relative => ({ ...relative, selected: false }));
      },
      error => {
        console.error('Error fetching relatives:', error);
      }
    );
  }

  isTodoAssignedToRelative(todo: Todo): boolean {
    console.log('Todo Assignees:', todo.assignees);
    console.log('Relative ID:', this.relativeId);
    return todo.assignees.includes(this.relativeId);
  }
  isTodoCompleted(todo: Todo): boolean {
    return todo.status === 'COMPLETED'; // Adjust based on your Todo model
  }

  markTodoAsCompleted(todoId: number): void {
    this.todoService.markTodoAsCompleted(todoId).subscribe(
      updatedTodo => {
        const index = this.todos.findIndex(todo => todo.id === updatedTodo.id);
        if (index !== -1) {
          this.todos[index] = updatedTodo; // Update the todo in the todos array
        }
      },
      error => {
        console.error('Error marking todo as completed:', error);
      }
    );
  }
  getTodosByStatus(status: string) {
    return this.todos.filter(todo => todo.status === status);
  }

  onDrop(event: CdkDragDrop<any[]>, status: TodoStatus) {
    const movedTodo = event.item.data;
    movedTodo.status = status; // Update the status locally
  
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {

      
      this.todoService.updateTodoStatus(movedTodo.id, status).subscribe(
        (updatedTodo) => {
          // Handle success response if needed
          console.log('Todo status updated successfully in the database.');
        },
        (error) => {
          // Handle error response if needed
          console.error('Error updating todo status:', error);
          // Rollback the status change locally if update failed
          movedTodo.status = event.previousContainer.data.find((todo) => todo.id === movedTodo.id).status;
        }
      );
    
    }
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      // Update the status of the dropped item
      const droppedTodo = event.container.data[event.currentIndex];
      droppedTodo.status = status;
    }
}
