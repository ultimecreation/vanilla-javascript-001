////////////
// VARIABLES
const clearAllBtn = document.querySelector('#clearAllBtn');
const submitBtn = document.querySelector('#submitBtn');
const updateBtn = document.querySelector('#updateBtn');
const cancelBtn = document.querySelector('#cancelBtn');
const removeBtn = document.querySelector('#removeBtn');
const messageContainer = document.querySelector('#messageContainer');
const todosContainer = document.querySelector('#todosContainer');
let messages = new Set();
let todos;

/////////
// INPUTS
const nameInput = document.querySelector('#nameInput');
const descriptionInput = document.querySelector('#descriptionInput');
const dueDateInput = document.querySelector('#dueDate')



/////////////////
//EVENT LISTENERS
// load todos
document.addEventListener('DOMContentLoaded',displayTodos)
// submit event listener
submitBtn.addEventListener('click',createTodo);
// update event listener
updateBtn.addEventListener('click',updateTodo);
// cancel update event listener
cancelUpdateBtn.addEventListener('click',cancelUpdate)
// remove event listener
removeBtn.addEventListener('click',removeTodo);
// clear all event listener
clearAllBtn.addEventListener('click',clearAllTodos);

// LOCAL DB FUNCTIONS
//get todos from localStorage
function dbGetTodos(){
    todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : []
    return todos
}
// save or update todos
function dbSaveTodo(todo,index = null){
    console.log(index)
}
// delete to from localStorage
function dbRemoveTodo(idToRemove){

}


// UI FUNCTIONS
// display todos
function displayTodos(){
    changeCurrentState('startMode')
    
    console.log()
}
// create todo
function createTodo(e){
    e.preventDefault();
    // validate inputs
    if(nameInput.value === ''){
        messages.add(['danger',"le nom est requis"]);
    }
    if(descriptionInput.value === ''){
        messages.add(['danger',"la description est requise"]);
    }
    if(dueDateInput.value === ''){
        messages.add(['danger',"la date est requise"])
    }
    if(messages.size > 0){
        showAlert(messages)
        return false
    }
    if(messages.size === 0) {
        console.log('submitted')
    }  
}

// update todo
function updateTodo(e){
    e.preventDefault();
    console.log('update')
}

// cancel update
function cancelUpdate(e){
    e.preventDefault();
    console.log('cancel update')
}

function removeTodo(e){
    e.preventDefault();
    console.log('remove')
}

function clearAllTodos(e){
    e.preventDefault();
    console.log('clear all')
}
function showAlert(messages){
    let output = '';
    messages.forEach(message => {
        output += `
            <p class="alert alert-${message[0]}">${message[1]}</p>
        `;
    })
    messageContainer.innerHTML= output;
    messages.clear();
    setTimeout(() => {
        messageContainer.innerHTML = ''
    },3000);
}
function clearInputs(){
    nameInput.value = '';
    descriptionInput.value = '';
    dueDateInput.value = '';
}
function changeCurrentState(state){
    if(state === 'editMode'){
        submitBtn.style.display = 'none' 
    } 
    else if(state === 'startMode'){
        clearInputs()
        updateBtn.style.display = 'none';
        cancelUpdateBtn.style.display = 'none';
        removeBtn.style.display = 'none'
    }
}