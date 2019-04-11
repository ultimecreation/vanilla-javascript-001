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
    todos.sort(function (a, b) {
        return new Date(a.dueDate) - new Date(b.dueDate) ;
    });
    return todos
}
// save or update todos
function dbSaveTodo(todo){
    todos = dbGetTodos()
    todos.push(todo)
    localStorage.setItem('todos',JSON.stringify(todos))  
}
// save or update todos
function dbUpdateTodo(todo,id){
    todos = dbGetTodos()
    console.log(todos[id])
    todos[id].name = todo.name
    todos[id].description = todo.description
    todos[id].dueDate = todo.dueDate
    todos[id].dueDateToDisplay = todo.dueDateToDisplay
    localStorage.setItem('todos',JSON.stringify(todos))        
}
// delete to from localStorage
function dbRemoveTodo(idToRemove){
    todos = dbGetTodos()
    todos.splice(idToRemove,1)
    localStorage.setItem('todos',JSON.stringify(todos))
}
//delete all todos
function dbClearAllTodos(){
    localStorage.removeItem('todos')
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
    messages.clear()
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
    if(new Date(dueDateInput.value).toLocaleDateString() < new Date().toLocaleDateString()){
        messages.add(['danger',"la date est antérieur à celle d'aujourd'hui"])
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
        
        messages.clear()
        if(e.target.id === 'submitBtn'){
            dbSaveTodo(todo)
            messages.add(['success',"todo enregistrée avec succès"]) 
        }
        if(e.target.id === 'updateBtn'){
            dbUpdateTodo(todo,id)
            messages.add(['success',"todo modifiée avec succès"])
        }
        showAlert(messages)
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
// cancel update
function cancelUpdate(e){
    e.preventDefault();
    messages.clear()
    changeCurrentState('startMode')
    messages.add(['success',"modification abandonéé"])
    showAlert(messages)
    clearInputs()
}

function removeTodo(e){
    e.preventDefault();
    if(e.target.id === 'removeBtn'){
        const idToRemove = e.target.parentElement.previousElementSibling.previousElementSibling.value
        dbRemoveTodo(idToRemove)
        messages.clear()
        changeCurrentState('startMode')
        messages.add(['success',"todo supprimée avec succès"])
        showAlert(messages)
        clearInputs()
        displayTodos() 
    }
    
}

function clearAllTodos(e){
    e.preventDefault();
    dbClearAllTodos()
    messages.clear()
    messages.add(['success',"todos supprimées avec succès"])
    showAlert(messages)
    displayTodos() 
}
function showAlert(messages){
    let output = '';
    messages.forEach(message => {
        output += `
            <p class="alert alert-${message[0]}">${message[1]}</p>
        `;
    })
    messageContainer.innerHTML= output;
    setTimeout(() => {
        messageContainer.innerHTML = ''
    },2000);
    
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