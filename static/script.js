// Constants
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');

// Event listeners
document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', filterTodo)

// First function
function addTodo(event) {
	// Prevent the form we have from submitting
	event.preventDefault();
	// Our todo div
	const todoDiv = document.createElement('div');
	todoDiv.classList.add("todo");
	// Create list
	const newTodo = document.createElement('li');
	newTodo.innerText = todoInput.value;
	newTodo.classList.add('todo-item');
	todoDiv.appendChild(newTodo);
	// add to local storage
	saveLocalTodos(todoInput.value);
	// The check button
	const completedButton = document.createElement('button');
	completedButton.innerHTML = '<i class="fas fa-check"></i>';
	completedButton.classList.add("complete-btn");
	todoDiv.appendChild(completedButton);
	// The trash button
	const trashButton = document.createElement('button');
	trashButton.innerHTML = 'Delete';
	trashButton.classList.add("trash-btn");
	todoDiv.appendChild(trashButton);
	// Send to list
	todoList.appendChild(todoDiv);
	// Clear the form we have
	todoInput.value = "";
}

function deleteCheck(e){
	const item = e.target;
	// Delete Todo element
	if(item.classList[0] === 'trash-btn'){
		const todo = item.parentElement;
		// animation
		todo.classList.add("fall")
		removeLocalTodos(todo);
		todo.addEventListener('transitionend', function(){
			todo.remove();
		});
	}

	// Check the Todo element
	if(item.classList[0] === 'complete-btn'){
		const todo = item.parentElement;
		todo.classList.toggle('completed')
	}
}

function filterTodo(e){
	const todos = todoList.childNodes;
	todos.forEach(function(todo){
		switch(e.target.value){
			case "all":
				todo.style.display = "flex";
				break;
			case "completed":
				if(todo.classList.contains('completed')){
					todo.style.display = 'flex';
				} else {
					todo.style.display = "none";
				}
				break;
			case "uncompleted":
				if(!todo.classList.contains('completed')){
					todo.style.display = 'flex';
				} else {
					todo.style.display = "none";
				}
				break;
		}
	});
}

function saveLocalTodos(todo){
	// look for a todo list already existing
	let todos;
	if(localStorage.getItem('todos') === null){
		todos = [];
	} else {
		todos = JSON.parse(localStorage.getItem('todos'));
	}
	todos.push(todo);
	localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos(){
	let todos;
	if(localStorage.getItem('todos') === null){
		todos = [];
	} else {
		todos = JSON.parse(localStorage.getItem('todos'));
	}
	todos.forEach(function(todo){
		// Our todo div
		const todoDiv = document.createElement('div');
		todoDiv.classList.add("todo");
		// Create list
		const newTodo = document.createElement('li');
		newTodo.innerText = todo;
		newTodo.classList.add('todo-item');
		todoDiv.appendChild(newTodo);
		// The check button
		const completedButton = document.createElement('button');
		completedButton.innerHTML = '<i class="fas fa-check"></i>';
		completedButton.classList.add("complete-btn");
		todoDiv.appendChild(completedButton);
		// The trash button
		const trashButton = document.createElement('button');
		trashButton.innerHTML = '<i class="fas fa-trash"></i>';
		trashButton.classList.add("trash-btn");
		todoDiv.appendChild(trashButton);
		// Send to list
		todoList.appendChild(todoDiv);
	});
}

function removeLocalTodos(todo){
	let todos;
	if(localStorage.getItem('todos') === null){
		todos = [];
	} else {
		todos = JSON.parse(localStorage.getItem('todos'));
	}
	const todoIndex = todo.children[0].innerText;
	todos.splice(todos.indexOf(todoIndex), 1);
	localStorage.setItem('todos', JSON.stringify(todos));
}