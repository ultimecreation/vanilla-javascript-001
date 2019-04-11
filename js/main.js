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
// INPUTS AND INDEXTOUPDATE VALUE
let nameInput = document.querySelector('#nameInput');
let descriptionInput = document.querySelector('#descriptionInput');
let dueDateInput = document.querySelector('#dueDate')
let todoIndexToUpdate = document.querySelector('#todoIndexToUpdate');


/////////////////
//EVENT LISTENERS
// load todos
document.addEventListener('DOMContentLoaded',displayTodos)
// submit event listener
submitBtn.addEventListener('click',submitTodo);
// edit event listener
todosContainer.addEventListener('click',editTodo)
// update event listener
updateBtn.addEventListener('click',submitTodo);
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
    if(todos.length>1){
        todos.sort(function (a, b) {
            return new Date(a.dueDate) - new Date(b.dueDate) ;
        });
    }
    return todos
}
// save or update todos
function dbSaveTodo(todo,id = null){
    todos = dbGetTodos()
    if(id === null ){
        todos.push(todo)
        localStorage.setItem('todos',JSON.stringify(todos))
        messages.add(['success',"todo enregistrée avec succès"])
        showAlert(messages)
    }
    if(id !== null){
        todos[id].name = todo.name
        todos[id].description = todo.description
        todos[id].dueDate = todo.dueDate
        todos[id].dueDateToDisplay = todo.dueDateToDisplay
        localStorage.setItem('todos',JSON.stringify(todos))
        messages.add(['success',"todo modifiée avec succès"])
        showAlert(messages)
    }
    
    
}
// delete to from localStorage
function dbRemoveTodo(idToRemove){

}


// UI FUNCTIONS
// display todos
function displayTodos(){
    changeCurrentState('startMode')
    todos = dbGetTodos()
    let output = '';
    todos.forEach((todo,index) => {
        if(new Date(todo.dueDate).toLocaleDateString() >= new Date().toLocaleDateString()){
        output += `
                <div class="card shadow p-2 my-4">
                    <div class="card-title d-flex">
                        <h3>${todo.name}</h3>
                        <span class="ml-auto "><strong>${todo.dueDateToDisplay}</strong></span>
                    </div>
                    <div class="card-body text-center">
                        <p>${todo.description}</p>
                    </div>
                    <div class="card-footer">
                        <button id="editBtn" value="${index}" class="btn btn-primary btn-block" >Modifier</button>
                        <input type="hidden" id="hiddenDueDate" value="${todo.dueDate}">
                    </div>
                </div>
            `;
        } 
    })
    todosContainer.innerHTML = output;
}
// create todo
function submitTodo(e){
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
        let dueDate = new Date(dueDateInput.value).toLocaleDateString("fr",{weekday: "long", year: "numeric", month: "long", day: "numeric"})
        let id = todoIndexToUpdate.value
        const todo = {
            "name": nameInput.value,
            "description": descriptionInput.value,
            "dueDate": dueDateInput.value,
            "dueDateToDisplay": dueDate
            
        }
        if(!id) dbSaveTodo(todo)
        else dbSaveTodo(todo,id)
        clearInputs()
        displayTodos()
        
    }  
}
// edit todo
function editTodo(e){
    e.preventDefault();
    if(e.target.id === 'editBtn'){
        nameInput.value = e.target.parentElement.previousElementSibling.previousElementSibling.children[0].textContent
        descriptionInput.value = e.target.parentElement.previousElementSibling.children[0].textContent
        dueDateInput.value = e.target.nextElementSibling.value
        todoIndexToUpdate.value  = e.target.value
        changeCurrentState('editMode')
        window.scrollTo({top: 0, behavior: 'smooth'})
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
    setTimeout(() => messageContainer.innerHTML = '',3000);
}
function clearInputs(){
    nameInput.value = '';
    descriptionInput.value = '';
    dueDateInput.value = '';
}
function changeCurrentState(state){
    if(state === 'editMode'){
        submitBtn.style.display = 'none' 
        updateBtn.style.display = 'block';
        cancelUpdateBtn.style.display = 'block';
        removeBtn.style.display = 'block'
    } 
    else if(state === 'startMode'){
        
        submitBtn.style.display = 'block' 
        updateBtn.style.display = 'none';
        cancelUpdateBtn.style.display = 'none';
        removeBtn.style.display = 'none'
    }
}