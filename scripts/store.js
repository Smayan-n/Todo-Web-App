//Model--------------------------------------------------------------------------

//array of todo objects
//each object contains: title, data, id
let todos;

//if local storage contains todos, those are loaded insead of the empty arr
const loadedTodos = JSON.parse(localStorage.getItem('stored-todos'));
if(Array.isArray(loadedTodos)) {
    todos = loadedTodos;
}
else{
    todos = [];
}

//rendering the todos on the screen when the page first loads
render();

//saves todos to local storage
function saveTodos(){
    const stringifiedTodos = JSON.stringify(todos);
    localStorage.setItem('stored-todos', stringifiedTodos);
}

//append task function
function createTodo(todoTitle, date){

    //this generates the current time in miliseconds so it will always be a unique iq
    let randomId = new Date().getTime();

    let todoObject = {
        "todoTitle": todoTitle,
        "date": date,
        "id": "" + randomId // convert to string
    }

    //adding new object to array
    todos.push(todoObject);
    //calling save func
    saveTodos();

}


//remove todo function
function removeTodo(buttonId){
    
    //loop through the todos array and remove the todo with the id of the button that was clicked

    //assiging output to todos again because .filer used a copy of the array
    todos = todos.filter(todoObject =>{
        if(buttonId === todoObject.id){
            return false; //when false is returned, the element is removed
        }
        else{
            return true; //when true is returned, the element is kept
        }

    });
    //save
    saveTodos();
}



//View--------------------------------------------------------------------------

function render(){
    const mainTodoContainer = document.getElementById('todo-container');
    //first clear the todos on the screen
    mainTodoContainer.innerHTML = '';
    
    //loop through the todos array and render each todo
    todos.forEach(todoObject => {

        //creating the divs for each todo
        const todoElement = document.createElement('div');
        const leftSection = document.createElement('div');
        const todoTitleElement = document.createElement('div');
        const todoDateElement = document.createElement('div');
        const rightSection = document.createElement('div');
        const editButton = document.createElement('button');
        const deleteButton = document.createElement('button');

        //adding classes to elements for styling
        todoElement.className = 'todo';

        //setting attributes for buttons button
        deleteButton.id = todoObject.id;
        deleteButton.className = 'delete-button';
        deleteButton.innerText = 'Delete';
        //adding event listener to delete button
        deleteButton.onclick = deleteTodo;

        editButton.id = todoObject.id;
        editButton.className = 'edit-button';
        editButton.innerText = 'Edit';
        //adding event listener to delete button

        //adding divs to main container(so they are displayed)
        mainTodoContainer.appendChild(todoElement);
        todoElement.appendChild(leftSection);
        leftSection.appendChild(todoTitleElement);
        leftSection.appendChild(todoDateElement);
        todoElement.appendChild(rightSection);
        rightSection.appendChild(editButton);
        rightSection.appendChild(deleteButton);
        

        //setting the content of the divs
        todoTitleElement.innerText = todoObject.todoTitle;
        todoDateElement.innerText = todoObject.date;


    });

}


//Controller--------------------------------------------------------------------------

//executing first code after page is finished loading
$(document).ready(function(){

});

//when the add todo button is clicked, the appendTodo function is called
const addTodoButton = document.getElementById('add-todo-button');
addTodoButton.onclick = addTodo; 
function addTodo(){

    const todoTitle = document.getElementById('todo-input').value;
    const date = document.getElementById('date-input').value;

    createTodo(todoTitle, date);
    render();
};

function deleteTodo(event){
    const buttonId = event.target.id;
    removeTodo(buttonId);
    render();
}
