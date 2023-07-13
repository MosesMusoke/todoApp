// Render our lists and be able to identify which lists we are selecting.
// Being able to add lists to uur page

const listsContainer = document.querySelector('.task-list')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button')
const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')
const tasksContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompletedTaskButton = document.querySelector('[data-clear-completed-task-button]')

let LOCAL_STORAGE_LIST_KEY = 'task.lists'
let LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'tasks.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedId = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY))

listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li' ) {
    selectedId = e.target.dataset.listId
    saveAndRender()
  }
})

tasksContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input'){
    const selectedList = lists.find(list => list.id === selectedId)
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
    selectedTask.complete = e.target.checked
    saveToLocalstorage()
    renderTaskCount(selectedList)
  }
})

clearCompletedTaskButton.addEventListener('click', e => {
  const selectedList = lists.find(list => list.id === selectedId)
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
  saveAndRender()
})

deleteListButton.addEventListener('click', e => {
  lists = lists.filter(list => list.id != selectedId)
  selectedId = null
  saveAndRender()
})

newListForm.addEventListener('submit', e => {
  e.preventDefault()

  const listName = newListInput.value
  if (listName == null || listName === '') return
  const newList = createList(listName)
  newListInput.value = null
  lists.push(newList)
  saveAndRender()
})

newTaskForm.addEventListener('submit', e => {
  e.preventDefault()

  const taskname = newTaskInput.value
  if (taskname == null || taskname === '') return
  const newTask = createTask(taskname)
  newTaskInput.value = null
  const selectedList = lists.find(list => list.id === selectedId)
  selectedList.tasks.push(newTask)
  saveAndRender()
})

// Functions

function saveAndRender () {
  saveToLocalstorage()
  render()
}

function saveToLocalstorage () {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, JSON.stringify(selectedId))
}

function createList (name) {
  return {id: Date.now().toString(), name: name, tasks: []}
}

function createTask(name) {
  return {id: Date.now().toString(), name: name, complete: false}
}

function render () {
  clearElements(listsContainer)
  renderLists()

  const selectedList = lists.find(list => list.id === selectedId)
  if (selectedId == null) {
    listDisplayContainer.style.display = 'none'
  }else {
    listDisplayContainer.style.display = ''
    listTitleElement.innerText = selectedList.name
    renderTaskCount(selectedList)
    clearElements(tasksContainer)
    renderTasks(selectedList)
  }
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true)
    const checkbox = taskElement.querySelector('input')
    checkbox.checked = task.complete
    checkbox.id = task.id
    const label = taskElement.querySelector('label')
    label.htmlFor = task.id
    label.append(task.name)
    tasksContainer.appendChild(taskElement)
  })
}

function renderTaskCount (selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
  const taskString = incompleteTaskCount === 1? 'task' : 'tasks'
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`
}

function renderLists() {
  lists.forEach(list => {
    const listElement = document.createElement('li')
    listElement.dataset.listId = list.id
    listElement.classList.add('list-name')
    listElement.innerText = list.name
    
    if (list.id === selectedId) {
      listElement.classList.add('active-list')
    }
    listsContainer.appendChild(listElement)
  })
}

function clearElements (element) {
  while(element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

render()

