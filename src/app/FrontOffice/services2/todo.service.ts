import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo, TodoStatus } from '../entities/todo.model';
import { Relative } from '../entities/relative.model';
import { Elderly } from '../entities/elderly.model';
 
@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private baseUrl = 'http://localhost:8081'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  saveTodo(elderlyId: number,todoData: Todo): Observable<any> {
    const url = `${this.baseUrl}/api/todos/${elderlyId}`;

    return this.http.post<Todo>(url, todoData);
  } 
  updateTodoStatus(todoId: number, status: TodoStatus): Observable<Todo> {
    const url = `${this.baseUrl}/${todoId}/status`; // Assuming your backend API endpoint is '/todos/:id/status'
    return this.http.put<Todo>(url, { status });
  }

  getRelativesByElderlyId(elderlyId: number): Observable<Relative[]> {
    const url = `${this.baseUrl}/api/todos/elderly/${elderlyId}`; // Update the URL according to your Spring Boot endpoint

    return this.http.get<Relative[]>(url);
  }
  getTodosByElderlyId(elderlyId: number): Observable<Todo[]> {
    const url = `${this.baseUrl}/api/todos/all/${elderlyId}`; // Assuming you have an endpoint to fetch todos for an elderly

    return this.http.get<Todo[]>(url);
  }
  getTodosByRelativeId(relativeId: number): Observable<Todo[]> {
    const url = `${this.baseUrl}/api/todos/relative/${relativeId}`;
    return this.http.get<Todo[]>(url);
  }
  getElderlyIdByRelativeId(relativeId: number): Observable<number> {
    const url = `${this.baseUrl}/api/todos/${relativeId}/elderlyId`;
    return this.http.get<number>(url);
  } 
  markTodoAsCompleted(todoId: number): Observable<Todo> {
    const url = `${this.baseUrl}/api/todos/${todoId}/complete`;
    return this.http.put<Todo>(url, {});
  }

  getElderlyById(elderlyId: number): Observable<Elderly> {
    const url = `${this.baseUrl}/api/todos/${elderlyId}`;
    return this.http.get<Elderly>(url);
  }
  removeTodo(todoId: number): Observable<any> {
    const url = `${this.baseUrl}/api/todos/delete/${todoId}`; // Assuming your API endpoint for removing tasks
    return this.http.delete(url);
  }
  getPaginatedTodos(elderlyId: number, page: number, pageSize: number): Observable<any> {
    const url = `${this.baseUrl}/api/todo/page/${elderlyId}?page=${page}&pageSize=${pageSize}`;
    return this.http.get<any>(url);
  }
  initializeSnakeGame() {
   /**
 * Namespace
 */
var Game      = Game      || {};
var Keyboard  = Keyboard  || {}; 
var Component = Component || {};

/**
 * Keyboard Map
 */
Keyboard.Keymap = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
};

/**
 * Keyboard Events
 */
Keyboard.ControllerEvents = function() {
  
  // Setts
  var self      = this;
  this.pressKey = null;
  this.keymap   = Keyboard.Keymap;
  
  // Keydown Event
  document.onkeydown = function(event) {
    self.pressKey = event.which;
  };
  
  // Get Key
  this.getKey = function() {
    return this.keymap[this.pressKey];
  };
};

/**
 * Game Component Stage
 */
Component.Stage = function(canvas, conf) {  
  
  // Sets
  this.keyEvent  = new Keyboard.ControllerEvents();
  this.width     = canvas.width;
  this.height    = canvas.height;
  this.length    = [];
  this.food      = {};
  this.score     = 0;
  this.direction = 'right';
  this.conf      = {
    cw   : 10,
    size : 5,
    fps  : 1000
  };
  
  // Merge Conf
  if (typeof conf == 'object') {
    for (var key in conf) {
      if (conf.hasOwnProperty(key)) {
        this.conf[key] = conf[key];
      }
    }
  }
  
};

/**
 * Game Component Snake
 */
Component.Snake = function(canvas, conf) {
  
  // Game Stage
  this.stage = new Component.Stage(canvas, conf);
  
  // Init Snake
  this.initSnake = function() {
    
    // Itaration in Snake Conf Size
    for (var i = 0; i < this.stage.conf.size; i++) {
      
      // Add Snake Cells
      this.stage.length.push({x: i, y:0});
		}
	};
  
  // Call init Snake
  this.initSnake();
  
  // Init Food  
  this.initFood = function() {
		
    // Add food on stage
    this.stage.food = {
			x: Math.round(Math.random() * (this.stage.width - this.stage.conf.cw) / this.stage.conf.cw), 
			y: Math.round(Math.random() * (this.stage.height - this.stage.conf.cw) / this.stage.conf.cw), 
		};
	};
  
  // Init Food
  this.initFood();
  
  // Restart Stage
  this.restart = function() {
    this.stage.length            = [];
    this.stage.food              = {};
    this.stage.score             = 0;
    this.stage.direction         = 'right';
    this.stage.keyEvent.pressKey = null;
    this.initSnake();
    this.initFood();
  };
};

/**
 * Game Draw
 */
Game.Draw = function(context, snake) {
  
  // Draw Stage
  this.drawStage = function() {
    
    // Check Keypress And Set Stage direction
    var keyPress = snake.stage.keyEvent.getKey(); 
    if (typeof(keyPress) != 'undefined') {
      snake.stage.direction = keyPress;
    }
    
    // Draw White Stage
		context.fillStyle = "white";
		context.fillRect(0, 0, snake.stage.width, snake.stage.height);
		
    // Snake Position
    var nx = snake.stage.length[0].x;
		var ny = snake.stage.length[0].y;
		
    // Add position by stage direction
    switch (snake.stage.direction) {
      case 'right':
        nx++;
        break;
      case 'left':
        nx--;
        break;
      case 'up':
        ny--;
        break;
      case 'down':
        ny++;
        break;
    }
    
    // Check Collision
    if (this.collision(nx, ny) == true) {
      snake.restart();
      return;
    }
    
    // Logic of Snake food
    if (nx == snake.stage.food.x && ny == snake.stage.food.y) {
      var tail = {x: nx, y: ny};
      snake.stage.score++;
      snake.initFood();
    } else {
      var tail: { x: any; y: any; } = snake.stage.length.pop();
      tail.x   = nx;
      tail.y   = ny;	
    }
    snake.stage.length.unshift(tail);
    
    // Draw Snake
    for (var i = 0; i < snake.stage.length.length; i++) {
      var cell = snake.stage.length[i];
      this.drawCell(cell.x, cell.y);
    }
    
    // Draw Food
    this.drawCell(snake.stage.food.x, snake.stage.food.y);
    
    // Draw Score
    context.fillText('Score: ' + snake.stage.score, 5, (snake.stage.height - 5));
  };
  
  // Draw Cell
  this.drawCell = function(x, y) {
    context.fillStyle = 'rgb(170, 170, 170)';
    context.beginPath();
    context.arc((x * snake.stage.conf.cw + 6), (y * snake.stage.conf.cw + 6), 4, 0, 2*Math.PI, false);    
    context.fill();
  };
  
  // Check Collision with walls
  this.collision = function(nx, ny) {  
    if (nx == -1 || nx == (snake.stage.width / snake.stage.conf.cw) || ny == -1 || ny == (snake.stage.height / snake.stage.conf.cw)) {
      return true;
    }
    return false;    
	}
};


/**
 * Game Snake
 */
Game.Snake = function(elementId, conf) {
  
  // Sets
  var canvas   = document.getElementById(elementId);
  var context = (canvas as HTMLCanvasElement).getContext("2d");
  var snake    = new Component.Snake(canvas, conf);
  var gameDraw = new Game.Draw(context, snake);
  
  // Game Interval
  setInterval(function() {gameDraw.drawStage();}, snake.stage.conf.fps);
};


/**
 * Window Load
 */
window.onload = function() {
  var snake = new Game.Snake('stage', {fps: 100, size: 4});
};
  }
}