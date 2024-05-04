import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AfterViewChecked, Component, OnInit } from '@angular/core';
 import { Board } from '../../entities/board.model';
import { ListE } from '../../entities/ListE.model';
import { BoardService } from '../../services2/board.service';
import { Card } from '../../entities/card.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Todo } from '../../entities/todo.model';
import { Relative } from '../../entities/relative.model';
import {  AssigneeType, TodoStatus } from '../../entities/todo.model';
import { TodoService } from '../../services2/todo.service';
declare var webkitSpeechRecognition: any;
 import {  Router } from '@angular/router';
 
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})

export class BoardComponent implements  OnInit ,AfterViewChecked{
  isPopupVisible = false;
  todoData: Todo = { title: '', description: '', status: TodoStatus.PENDING, assignees: [],  assignee: AssigneeType.SELF // Default assignee is SELF
};
  board: Board | undefined;
  targetList: ListE | undefined;
  addCardForm: FormGroup; // Form group to handle new card details
  addingTo: ListE | undefined; // The list to which we're adding the card
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

  constructor(
    private boardService: BoardService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder, // Initialize FormBuilder
    private todoService: TodoService) {
    this.addCardForm = this.formBuilder.group({
      title: [''] // Default value for new card's title
    });
  }

  ngOnInit(): void {    this.fetchTodos(); // Fetch todos when the component initializes

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

       this.boardService.getBoardById(this.elderlyId).subscribe({
        next: (board) => {
          this.board = board;
          if (this.board?.lists?.length > 0) {
            this.targetList = this.board.lists[0];
          }
        },
        error: (err) => console.error('Error fetching board:', err)
      });
    });    this.fetchRelatives(); // Fetch relatives after obtaining the ID
    this.fetchTodos(); // Fetch todos when the component initializes
  }

  onAddCardClick(list: ListE): void {
    this.addingTo = list; // Store the list to which we'll add the card
  }

 
  
  onAddCardSubmit(): void {
    if (this.addingTo) {
      const newCard: Card = {
        id: 1, // You can assign a unique ID here or modify as needed
        title: 'New Card Title',
        content: 'New Card Content',
        priority: 'Low',
        listId: 1, // Provide the appropriate list ID
        todo: {
          // Initialize a Todo object or modify as needed
          title: 'New Todo',
          description: 'Description of new todo',
          status: TodoStatus.PENDING,
          assignees: [],
          assignee: AssigneeType.SELF
        }
      };
      
      
      this.boardService.addCardToList(newCard, this.addingTo.id).subscribe({
        next: (createdCard) => {
          if (this.addingTo && Array.isArray(this.addingTo.cards)) {
            this.addingTo.cards.push(createdCard);
          }          this.addCardForm.reset(); // Reset form
          this.addingTo = undefined; // Reset target list
        },
        error: (err) => console.error('Error adding card:', err)
      });
    }
  }
  onDrop(event: CdkDragDrop<Card[]>, fromList: ListE, toList: ListE): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
  
      const movedCard = event.container.data[event.currentIndex];
      const todoId = movedCard.id;
      let status: string;
      
      // Determine status based on the destination list
      switch (toList.name) {
        case 'To Do':
          status = 'PENDING';
          break;
        case 'In Progress':
          status = 'IN_PROGRESS';
          break;
        case 'Done':
          status = 'COMPLETED';
          break;
        default:
          throw new Error('Invalid list name');
      }
  
      const listId = toList.id;
  
      this.boardService.updateCardStatus(todoId, status, listId).subscribe();
    }
  }
   






  fetchTodos(): void {
    this.todoService.getTodosByElderlyId(this.elderlyId).subscribe(
      todos => {
        this.todos = todos;
    
        // Map todos to cards based on status and assign to lists
        this.board?.lists?.forEach(list => {
          switch (list.name) {
            case 'To Do':
              list.cards = todos
                .filter(todo => todo.status === TodoStatus.PENDING)
                .map(todo => ({
                  id: todo.id,
                  title: todo.title,
                  content: todo.description,
                  priority: 'Low',
                  listId: list.id, // Assuming you have list ID in your list object
                  todo: todo // Assign the actual todo to the card
                }));
              break;
            case 'In Progress':
              list.cards = todos
                .filter(todo => todo.status === TodoStatus.IN_PROGRESS)
                .map(todo => ({
                  id: todo.id,
                  title: todo.title,
                  content: todo.description,
                  priority: 'Medium',
                  listId: list.id,
                  todo: todo
                }));
              break;
            case 'Done':
              list.cards = todos
                .filter(todo => todo.status === TodoStatus.COMPLETED)
                .map(todo => ({
                  id: todo.id,
                  title: todo.title,
                  content: todo.description,
                  priority: 'High',
                  listId: list.id,
                  todo: todo
                }));
              break;
            default:
              list.cards = [];
              break;
          }
        });
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
        status: TodoStatus.PENDING, // Default status is Pending
        assignees: this.todoData.assignees,
        assignee: AssigneeType.SELF
      };

      if (todoData.assignees.length > 0) {
        todoData.assignee = AssigneeType.RELATIVE;
        todoData.status = TodoStatus.IN_PROGRESS; // If assigned, status is In Progress
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



  todoss = [
    { id: 1, title: 'Task 1', description: 'Description for Task 1', status: 'TO_DO', assignee: 'John Doe' },
    { id: 2, title: 'Task 2', description: 'Description for Task 2', status: 'IN_PROGRESS', assignee: 'Jane Doe' },
    { id: 3, title: 'Task 3', description: 'Description for Task 3', status: 'DONE', assignee: 'James Smith' },
    // Other tasks...
  ];

  onDragStart(event: DragEvent, todo: any) {
    event.dataTransfer!.setData('text/plain', JSON.stringify(todo));
  }

  onDropp(event: DragEvent, newStatus: TodoStatus) {
    const droppedData = JSON.parse(event.dataTransfer!.getData('text/plain')) as Todo;
    const index = this.todos.findIndex(todo => todo.id === droppedData.id);
    if (index !== -1) {
      this.todos[index].status = newStatus;
      // You may need to update the status in your backend/database here
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
}
