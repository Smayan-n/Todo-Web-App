//Model--------------------------------------------------------------------------

//month names
const monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

//array of todo objects
//each object contains: title, data
let todos;

//when first loaded, todos in local storage are rendered
const loadTodos = () => {
	//if local storage contains todos, those are loaded insead of the empty arr
	const loadedTodos = JSON.parse(localStorage.getItem("stored-todos"));
	if (Array.isArray(loadedTodos)) {
		todos = loadedTodos;
		//then load
		todos.forEach((todo, index) => {
			renderAdd(index);
			UpdateButtonHandlers();
		});
		saveTodos();
	} else {
		todos = [];
	}
};

//saves todos to local storage
const saveTodos = () => {
	const stringifiedTodos = JSON.stringify(todos);
	localStorage.setItem("stored-todos", stringifiedTodos);
};

//append task function
const createTodo = (todoTitle, todoDate, todoDescription) => {
	//create new todo object
	let todoObject = {
		title: todoTitle,
		date: todoDate,
		description: todoDescription,
	};
	//adding new object to array
	todos.push(todoObject);

	//saving todos
	saveTodos();
};

//remove todo function
const removeTodo = (index) => {
	//removes the todo from the array at given index
	todos.splice(index, 1);
	//save todos
	saveTodos();
};

//returns date in string format
const convertDate = (date) => {
	const split = date.split("-");
	const year = split[0];
	const day = split[2];
	const month = monthNames[parseInt(split[1]) - 1];

	return month + " " + day + ", " + year;
};

//View--------------------------------------------------------------------------

const renderAdd = (index) => {
	//resetting input fields
	$("#add-todo-button")
		.text("Add Todo")
		.css({ "background-color": "rgb(110, 110, 110)" });
	$("#todo-title-input").val("");
	$("#todo-description-input").val("");
	$("#date-input").val("");

	//getting values from todos array
	const todoTitle = todos[index].title;
	const todoDate = todos[index].date;
	const todoDescription = todos[index].description;

	//converting date to string month day and year
	let stringDate = "";
	if (todoDate != "") {
		stringDate = convertDate(todoDate);
	}

	//creating the todo html element
	const todoMarkup = `
        <div class="todo">
            <div class="left-section">
                <div class="top-section">
                    <div class="todo-title">${todoTitle}</div>
                    <div class="todo-date">${stringDate}</div>
                </div>

                <div class="bottom-section">
                    <div class="todo-description">${todoDescription}</div>
                </div>
                
            </div>
        
            <div class="right-section">
                <button class="edit-button">Edit</button>
                <button class="delete-button">Delete</button>

            </div>
        </div>
        `;

	//appending the todoMarkup to the main container
	const todoBox = $(todoMarkup);
	$("#todo-container").append(todoBox);
};

const renderDelete = (todoBox) => {
	//animating todo box and then deleting it
	const animationTime = 800;

	todoBox.animate(
		{ left: +"" + todoBox.width() + "px", width: "0px" },
		animationTime,
		() => todoBox.remove()
	); //callback function
};

const renderEdit = (todoTitle, todoDate, todoDescription, todoBox) => {
	//setting values of input elements
	$("#todo-title-input").val(todoTitle);
	$("#date-input").val(todoDate);
	$("#todo-description-input").val(todoDescription);

	//changing the button text
	$("#add-todo-button").text("Update!").css({
		"background-color": "green",
	});
};

const renderWarning = (x, y, z) => {
	if (x) {
		$("#todo-title-input").css({ "border-color": "red" });
	}
	if (y) {
		$("#date-input").css({ "border-color": "red" });
	}
	if (z) {
		$("#todo-description-input").css({ "border-color": "red" });
	}
};

const resetInputs = () => {
	$("#todo-title-input").css({ "border-color": "rgb(110, 110, 110)" });
	$("#date-input").css({ "border-color": "rgb(110, 110, 110)" });
	$("#todo-description-input").css({ "border-color": "rgb(110, 110, 110)" });
};

//sets border to normal if focused
$("#todo-title-input").on("focus", function () {
	$(this).css({ "border-color": "rgb(110, 110, 110)" });
});
$("#date-input").on("focus", function () {
	$(this).css({ "border-color": "rgb(110, 110, 110)" });
});
$("#todo-description-input").on("focus", function () {
	$(this).css({ "border-color": "rgb(110, 110, 110)" });
});

//Controller--------------------------------------------------------------------------

//when the add todo button is clicked
$("#add-todo-button")
	.off()
	.on("click", function () {
		//get input values
		const inputTitle = $("#todo-title-input");
		const inputDate = $("#date-input");
		const inputDescription = $("#todo-description-input");

		//checking to see if the input fileds are empty
		if (
			inputTitle.val() == "" ||
			inputDate.val() == "" ||
			inputDescription.val() == ""
		) {
			renderWarning(
				inputTitle.val() == "",
				inputDate.val() == "",
				inputDescription.val() == ""
			);
			return;
		}

		//call create todo function
		createTodo(inputTitle.val(), inputDate.val(), inputDescription.val());
		renderAdd(todos.length - 1);
		UpdateButtonHandlers();
	});

//when a new todo is created, this method is called so the new buttons can be accessed by jquery
const UpdateButtonHandlers = () => {
	//so that the function is only called once

	//when delete button is clicked
	$(".delete-button")
		.off()
		.on("click", function () {
			//getting parent todo div of the button that was clicked
			const todoBox = $(this).parent().parent();
			removeTodo(todoBox.index());
			renderDelete(todoBox);
		});

	//when edit button is clicked
	$(".edit-button")
		.off()
		.on("click", function () {
			//saving current todo inside input before editing next todo
			$("#add-todo-button").click();
			resetInputs();

			//getting values from todos array
			const todoBox = $(this).parent().parent();
			const todoObject = todos[todoBox.index()];

			const todoTitle = todoObject.title;
			const todoDate = todoObject.date;
			const todoDescription = todoObject.description;

			removeTodo(todoBox.index());
			renderEdit(todoTitle, todoDate, todoDescription, todoBox);
			renderDelete(todoBox);
		});
};

//executing first code after page is finished loading
$(document).ready(function () {
	loadTodos();
});
