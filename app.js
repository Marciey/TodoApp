const todoForm = document.querySelector('form'); // The form is used to handle the submission of new to-do items. This allows you to attach an event listener to the form for handling user input.
const todoInput = document.getElementById('todo-input'); //  This is the input field where users type their to-do items. The script needs to access its value to add new tasks to the list.
const todoListUL = document.getElementById('todo-list');
let allTodos = getTodos(); // when a todo is added in the input field, it is pushed to this array, This array acts as a central data structure to keep track of all the to-do items. It can be used for operations like adding, removing, or updating tasks. By calling getTodos(), the app restores the saved state of the to-do list, allowing the user to continue where they left off.
updateTodoList(); // to display them on the page
todoForm.addEventListener('submit', function (event) { // this callback function is executed whenever the submit event is triggered on the todoForm (e.g., when the user clicks the "ADD" button or presses Enter). It handles the event by preventing the default behavior and calling the addTodo function.
    event.preventDefault(); // prevent the form from refreshing or page from reloading 
    addTodo();
});
function addTodo() { // this function is responsible for adding a new to-do item to the list. It retrieves the value from the input field, creates a new object representing the to-do item
    const todoText = todoInput.value.trim(); // get the value of the input field
    if (todoText.length > 0) {
        const todoObj = {
            text: todoText,
            completed: false // this property is used to track as the todo can be completed immediately
        }
    allTodos.push(todoObj); 
    updateTodoList(); // Without createTodoItem, the new to-do item would only exist in the allTodos array but wouldn’t appear in the UI.It ensures that the app remains interactive and visually updates the list whenever a new task is added.
    saveTodos(); //To save the updated state of the allTodos array to localStorage whenever a new to-do item is added.
    todoInput.value = ''; // clear the input field after adding the todo
}
}
function updateTodoList(){
    todoListUL.innerHTML = ""; // empty string as we are recreating the todo-list everytime
    // foreach method takes a function as its parameter so it will be executed once for each element in the array
    allTodos.forEach((todo, todoIndex)=>{ // 1st represents the current todo that is processsed in the array, 2nd is the index of the current todo-item in the array- It can be used to uniquely identify each to-do item (e.g., for assigning unique IDs to elements like checkboxes or for implementing delete functionality).
        const todoItem = createTodoItem(todo, todoIndex);
        todoListUL.append(todoItem);
    });
}
function createTodoItem(todo, todoIndex){ //Since todo is now an object, you need to extract the text property to display the to-do text in the UI.
    const todoId = "todo-" + todoIndex; 
    const todoLi = document.createElement('li'); // create a new list item element
    const todoText = todo.text; 
    todoLi.className = "todo";// it parses and renders HTML tags,  treats everything as plain text- textContent is safer and prevents XSS attacks
    todoLi.innerHTML = ` 
        <input type="checkbox" id="${todoId}"> <!-- id of the checkbox and for has to be identical for this to work-->
        <label for="${todoId}" class="custom-checkbox"> <!-- self-design checkbox and use for attr to connect label with our checkbox todo 1-->
             <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg> <!-- to make the checkmark not visible -->
        </label>
        <label for="${todoId}" class="todo-text"> <!-- improve user exp when txt is clicked-->
             ${todoText}
        </label>
        <button class="delete-button">
           <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--secondary)"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
        </button>
        ` // to import code 
    const deleteButton = todoLi.querySelector(".delete-button"); // It is not directly accessible within the createTodoItem function.The delete button is created and attached to the <li> element (todoLi) inside the createTodoItem function, so it makes sense to use todoLi in this context.
    deleteButton.addEventListener("click", () =>{ // The event listener for deleting to-dos is required to handle the click event on the delete button for each to-do item. Without this event listener, clicking the delete button would not trigger any action, and the to-do item would remain in the list as the callback function wont be executed
        deleteTodoItem(todoIndex); 
    });
    const checkbox = todoLi.querySelector("input"); // Using document.querySelector("input") would search for the first <input> element in the entire document, which is not specific to the current to-do item.By using todoLi.querySelector("input"), the search is scoped to the current todoLi element, ensuring that the correct checkbox is selected, even if there are multiple input elements in the DOM. 
    checkbox.addEventListener("change", () => { // change as the event tag
         allTodos[todoIndex].completed = checkbox.checked; // this will update the completed property of the todo object in the allTodos array- true if the checkbox is checked and false if unchecked
            saveTodos(); // marked as completed (property) in the local storage
    });
    checkbox.checked = todo.completed; // this will check the checkbox if the todo is completed before the list is returned 
    return todoLi; // append the new list item to the unordered list
} // its better if we always display the current state of the array so that any changes to the array will result in change of the todo list so change in the array will update the todo-list 
// to save the data of our todolists using a database like mysql or firebase will be unnecessarily complicated
function deleteTodoItem(todoIndex){ 
    allTodos = allTodos.filter((_, i) => i !== todoIndex); // _ is a placeholder for the unused element parameter that is part of filter alongside index and the array, indicating that it is intentionally ignored in the logic. This improves code readability and clarity.
    saveTodos();
    updateTodoList();
} 
function saveTodos(){
    const todosJson = JSON.stringify(allTodos);
    localStorage.setItem("todos", todosJson); //since only string values can be stored here we need to convert our array into a json string
}
// we should call the saveTodos(); to see the key and value we have to go to inspect-> application, so the string will stay there even if we leave or reload the page; best in the addTodos function after updating the todo-list
function getTodos(){
    const todos = localStorage.getItem("todos") || "[]"; // ensures that if the value on the right side is null we get an empty array so that it doesnt return null 
    return JSON.parse(todos);
}