import { AfterViewChecked, Component, HostListener, OnInit } from '@angular/core';
import { TodoService } from '../../services2/todo.service';
import { Todo, AssigneeType, TodoStatus } from '../../entities/todo.model';
import { Relative } from '../../entities/relative.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
declare var webkitSpeechRecognition: any;
import {  moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit ,AfterViewChecked{
  showNotification = false;

  isPopupVisible = false;
  todoData: Todo = { title: '', description: '', status: TodoStatus.PENDING, assignees: [],  assignee: AssigneeType.SELF // Default assignee is SELF
};websiteUrl = 'http://localhost:4200/';


  relativeChecked = false; // Initialize properties
  volunteerChecked = false;
  selfChecked = false;
  elderlyId: number;
  todos: Todo[] = []; // Array to store todos
  firstName: string = '';
  lastName: string = '';
  relatives: Relative[] = []; // Array to store relatives
  currentPage = 1; // Initialize current page
  pageSize = 10; // Number of todos per page
  totalTodos = 0; // Total number of todos
  totalPages = 0; // Total number of pages
   todoStatuses: TodoStatus[] = [
    TodoStatus.PENDING,
    TodoStatus.IN_PROGRESS,
    TodoStatus.COMPLETED,
  ]; // Enum representing todo statuses
  //boardIds: string[] = ['todo-pending', 'todo-in-progress', 'todo-completed'];
  colors: string[] = ['#FF5733', '#45a049', '#3282ce', '#9c7de0', '#3e8e41', '#16b1ff']; // Add or modify colors as needed
  inactivityTimer: any;

  constructor(private todoService: TodoService,
    private router: Router,
    private route: ActivatedRoute){
      this.todos = [
      { id: 1, title: 'Sample Todo 1', description: 'Description 1', status: TodoStatus.PENDING, assignees: [], assignee: AssigneeType.SELF },
      { id: 2, title: 'Sample Todo 2', description: 'Description 2', status: TodoStatus.IN_PROGRESS, assignees: [], assignee: AssigneeType.SELF },
      { id: 3, title: 'Sample Todo 3', description: 'Description 3', status: TodoStatus.COMPLETED, assignees: [], assignee: AssigneeType.SELF },
    ];

  }
 

  boardIds = this.todoStatuses.map(status => `todo-${status.toLowerCase()}`);
  sortByEarliestFirst = true; // Boolean flag to track sorting direction

  toggleSortDirection() {
    this.sortByEarliestFirst = !this.sortByEarliestFirst;
    this.sortTodosByCreatedAt();
  }
  isTodoInProgress(todo: Todo): boolean {
    // Assuming you have a property 'status' in your Todo model
    return todo.status === 'IN_PROGRESS'; // Adjust based on your actual status property
  }
  sortTodosByCreatedAt() {
    this.todos.sort((a, b) => {
      const createdAtA = this.parseCreatedAt(a);
      const createdAtB = this.parseCreatedAt(b);

      if (createdAtA && createdAtB) {
        return this.sortByEarliestFirst ? (createdAtA.getTime() - createdAtB.getTime()) : (createdAtB.getTime() - createdAtA.getTime());
      } else {
        return 0; // Return 0 if createdAt is null or undefined
      }
    });
  }

  private parseCreatedAt(todo: Todo): Date | null {
    if (todo.createdAt instanceof Date) {
      return todo.createdAt; // Return createdAt if it's already a Date object
    } else if (typeof todo.createdAt === 'string') {
      return new Date(todo.createdAt); // Parse createdAt as a Date if it's a string
    } else {
      return null; // Return null if createdAt is not a valid Date
    }
  }

  allowDropPredicate = (drag: any, drop: any) => {
    // Allow dropping into an empty list
    if (drop.data.length === 0) {
      return true;
    }
    return drag.data.status !== drop.data.status;
  };

  redirectToGame(): void {
    // Assuming this.elderlyId contains the ID of the elderly
    if (this.elderlyId) {
      this.router.navigateByUrl(`/game/${this.elderlyId}`);
    } else {
      console.error('Elderly ID is not available.');
      // Handle the case where the elderly ID is not available
    }
  }
  
  ngOnInit(): void {
     this.route.params.subscribe(params => {
      this.elderlyId = +params['elderlyId']; // Add this line
      console.log('Elderly ID:', this.elderlyId);
      this.fetchRelatives(); // Fetch relatives after obtaining the ID
      this.todoService.getElderlyById(this.elderlyId).subscribe(
        elderly => {
          this.firstName = elderly.firstName; // Assign the first name
          this.lastName = elderly.lastName; // Assign the last name
        },
        error => {
          console.error('Error fetching elderly data:', error);
          // Handle error as needed
        }
      );

    });   
    this.fetchRelatives(); // Fetch relatives after obtaining the ID
    this.fetchTodos(); // Fetch todos when the component initializes
    this.startInactivityTimer();

   }
   startInactivityTimer(): void {
    this.inactivityTimer = setTimeout(() => {
      this.showNotification = true;
    }, 1000); // 1 seconds
  }

  @HostListener('document:mousemove')
  @HostListener('document:keypress')
  resetInactivityTimer(): void {
    clearTimeout(this.inactivityTimer);
    this.showNotification = false;
    this.startInactivityTimer();
  }

   fetchTodos(): void {
    // Assuming you have a method in TodoService to fetch todos related to the elderly
    this.todoService.getTodosByElderlyId(this.elderlyId).subscribe(
      todos => {
        this.todos = todos;
      },
      error => {
        console.error('Error fetching todos:', error);
        // Handle error as needed
      }
    );
  }


  getAssignedNames(todo: Todo): string {
    // Get the names of assigned relatives for a todo
    const assignedNames = todo.assignees.map(assigneeId => {
      const assignedRelative = this.relatives.find(relative => relative.idRelative === assigneeId);
      return assignedRelative ? assignedRelative.firstName : '';
    });
    return assignedNames.join(', ');
  }
  fetchRelatives(): void {
 
    // Assuming you have a method in RelativeService to fetch relatives related to the elderly
    this.todoService.getRelativesByElderlyId(this.elderlyId).subscribe(
      relatives => {
        this.relatives = relatives.map(relative => ({ ...relative, selected: false }));
      },
      error => {
        console.error('Error fetching relatives:', error);
        // Handle error as needed
      }
    );
  }

  showPopup(): void {
    this.isPopupVisible = true;
  }

  hidePopup(): void {
    this.isPopupVisible = false;
  }
  ngAfterViewChecked(): void {
    this.getSelectedRelatives(); // Call getSelectedRelatives after view changes
  }
  
  saveTodo(): void {
    const confirmed = confirm("Are you sure you want to save the todo?");
    if (confirmed) {
      const todoData: Todo = {
        title: this.todoData.title,
        description: this.todoData.description,
        status: TodoStatus.PENDING,
        assignees: this.todoData.assignees, // Assign the selected relatives
        assignee: AssigneeType.SELF ,// Default assignee is SELF
        createdAt: new Date() // Set the createdAt property to the current date and time

      };
  
      if (todoData.assignees.length > 0) {
        todoData.assignee = AssigneeType.RELATIVE; // Set assignee to RELATIVE if relatives are selected
      }
  
      console.log('Request Payload:', todoData);
  
      this.todoService.saveTodo(this.elderlyId, todoData).subscribe(
        response => {
          console.log('Todo saved successfully:', response);
          this.hidePopup();
          window.location.reload(); // Reload the window after successful upload

        },
        error => {
          console.error('Error saving todo:', error);
          console.log('Error Response:', error.error);
        }
      );
    }
  }
 
  // Helper method to get selected relative IDs
  getSelectedRelatives(): number[] {
    const selectedRelatives: number[] = [];
    if (this.relativeChecked) {
      // Assuming each relative has an ID property
      this.relatives.forEach(relative => {
        if (relative.selected) {
          selectedRelatives.push(relative.idRelative);
        }
      });
    }
    return selectedRelatives;
  }updateAssignees(event: any): void {
    const checkboxValue = Number(event.target.value); // Convert value to number
    let updatedAssignees = [...this.todoData.assignees]; // Create a copy to maintain immutability
    if (event.target.checked) {
      // Add the relative to the assignees array if checked
      updatedAssignees.push(checkboxValue);
    } else {
      // Remove the relative from the assignees array if unchecked
      updatedAssignees = updatedAssignees.filter(id => id !== checkboxValue);
    }
    this.todoData = { ...this.todoData, assignees: updatedAssignees }; // Update todoData immutably
  
    // Update the relatives array to reflect the changes in todoData.assignees
    if (event.target.checked) {
      const relativeToAdd = this.relatives.find(relative => relative.idRelative === checkboxValue);
      if (relativeToAdd) {
        relativeToAdd.selected = true;
      }
    } else {
      const relativeToRemove = this.relatives.find(relative => relative.idRelative === checkboxValue);
      if (relativeToRemove) {
        relativeToRemove.selected = false;
      }
    }

    console.log('Updated Assignees:', this.todoData.assignees); // Log the assignees array
  }
  handleTodoCompletion(todo: Todo): void {
    this.todoService.markTodoAsCompleted(todo.id).subscribe(
      updatedTodo => {
        const index = this.todos.findIndex(t => t.id === updatedTodo.id);
        if (index !== -1) {
          this.todos[index] = updatedTodo;
        }
      },
      error => {
        console.error('Error marking todo as completed:', error);
      }
    );
  }
  isTodoCompleted(todo: Todo): boolean {
    return todo.status === 'COMPLETED'; // Adjust based on your todo model
  }startDictation() {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = true; // Set continuous to true for synchronous recognition
      recognition.interimResults = true; // Set interimResults to true for interim results
      recognition.lang = 'en-US';
  
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.todoData.title = transcript;
      };
  
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
  
      recognition.onend = () => {
        console.log('Speech recognition ended.');
      };
  
      recognition.start();
    } else {
      console.error('Speech recognition not supported.');
    }
  }
  removeTodo(todo: Todo): void {
    const confirmed = confirm("Are you sure you want to remove this task?");
    if (confirmed) {
      this.todoService.removeTodo(todo.id).subscribe(
        response => {
          console.log('Task removed successfully:', response);
          // Remove the task from the local array to update the UI
          this.todos = this.todos.filter(t => t.id !== todo.id);
        },
        error => {
          console.error('Error removing task:', error);
          // Handle error as needed
        }
      );
    }
  } 
   /*

  getTodosByStatus(status: TodoStatus): Todo[] {
    return this.todos.filter((todo) => todo.status === status);
  }

  onDrop(event: CdkDragDrop<Todo[]>, status: TodoStatus) {
    const movedTodo = event.item.data;
    movedTodo.status = status; // Update the status locally
  
    // Check if the target list is empty
    if (event.previousContainer === event.container) {
      // Add the moved todo to the list
  event.container.data = [...event.container.data, movedTodo];
    } else {
      // Call the service to update the status in the database
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
  }

  allowDropPredicate(item: CdkDrag<Todo>, list: CdkDropList<Todo[]>): boolean {
    // Example condition: Allow dropping only if the status is 'PENDING' or 'COMPLETED'
    const targetListId = list.id;
    const movedTodo = item.data;
  
    if (targetListId === 'todo-in_progress') {
      return movedTodo.status === TodoStatus.IN_PROGRESS || movedTodo.status === TodoStatus.COMPLETED;
    }
  
    return true; // Allow dropping for other lists
  }
  */
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

 
