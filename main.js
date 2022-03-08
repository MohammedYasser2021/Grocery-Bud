// select items
const alert = document.querySelector('.alert')
const form = document.querySelector('.grocery-bud')
const todoInp = document.getElementById('grocery')
const addBtn = document.querySelector('.add-btn')
const groceryContainer = document.querySelector('.grocery-container')
const groceryList = document.querySelector('.grocery-list')
const clearBtn = document.querySelector('.clear-btn')

// edit options
let editElement
let editFlag = false
let editId = ''

// event listeners
// form submit
form.addEventListener('submit', addItem)
// clear items
clearBtn.addEventListener('click', clearItems)
// load items
window.addEventListener('DOMContentLoaded', setupItems)
// functions

// add item function
function addItem(e) {
  e.preventDefault()
  const value = grocery.value
  const id = new Date().getTime().toString()
  if (value && !editFlag) {
    createListItems(id, value)
    // show grocery container
    groceryContainer.classList.add('show-container')
    // display alert
    displayAlert('item added to the list', 'success')
    // add to local storage
    addToLocalStorage(id, value)
    // set back to default
    setBackToDefault()
  } else if (value && editFlag) {
    editElement.innerHTML = value
    displayAlert('item edited', 'success')
    // edit local storage
    editLocalStorage(editId, value)
    setBackToDefault()
  } else {
    displayAlert('please enter value', 'danger')
  }
}

// display alert function
function displayAlert(text, action) {
  alert.textContent = `${text}`
  alert.classList.add(`alert-${action}`)

  // remove alert
  setTimeout(() => {
    alert.textContent = ''
    alert.classList.remove(`alert-${action}`)
  }, 1500)
}
// clear items function
function clearItems() {
  groceryList.innerHTML = ''
  groceryContainer.classList.remove('show-container')
  displayAlert('Empty List', 'danger')
  setBackToDefault()
  localStorage.removeItem('lists')
}
// edit function
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling
  // set form value
  grocery.value = editElement.innerHTML
  editFlag = true
  editId = element.dataset.id
  addBtn.textContent = 'Edit'
}
// delete function
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement
  const id = element.dataset.id
  groceryList.removeChild(element)
  if (groceryList.children.length === 0) {
    groceryContainer.classList.remove('show-container')
  }
  displayAlert('item deleted', 'danger')
  setBackToDefault()
  // delete from localstorage
  removeFromLocalStorage(id)
}

// set back to default function
function setBackToDefault() {
  grocery.value = ''
  editFlag = false
  editId = ''
  addBtn.textContent = 'Add'
}

// local storage
// add to localstorage
function addToLocalStorage(id, value) {
  const grocery = { id, value }
  let items = getLocalStorage()
  items.push(grocery)
  localStorage.setItem('lists', JSON.stringify(items))
}
// remove from localstorage
function removeFromLocalStorage(id) {
  let items = getLocalStorage()
  items = items.filter((item) => {
    return item.id !== id
  })
  localStorage.setItem('lists', JSON.stringify(items))
}
// edit item from localstorage
function editLocalStorage(id, value) {
  let items = getLocalStorage()
  items = items.map((item) => {
    if (item.id === id) {
      item.value = value
    }
    return item
  })
  localStorage.setItem('lists', JSON.stringify(items))
}
// get items from localstorage
function getLocalStorage() {
  return localStorage.getItem('lists')
    ? JSON.parse(localStorage.getItem('lists'))
    : []
}

// setUpItems
function setupItems() {
  let items = getLocalStorage()
  if (items.length > 0) {
    items.forEach((item) => {
      createListItems(item.id, item.value)
    })
    groceryContainer.classList.add('show-container')
  }
}

function createListItems(id, value) {
  let element = document.createElement('article')
  element.classList.add('grocery-item')
  const attr = document.createAttribute('data-id')
  attr.value = id
  element.setAttributeNode(attr)
  element.innerHTML = `
              <p class="title">${value}</p>
              <div class="btn-container">
                  <button class="edit-btn">
                      <i class="fa fa-pencil-square"></i>
                  </button>
                  <button class="delete-btn">
                      <i class="fa fa-trash"></i>
                  </button>
              </div>
  `
  const deleteBtn = element.querySelector('.delete-btn')
  const editBtn = element.querySelector('.edit-btn')
  deleteBtn.addEventListener('click', deleteItem)
  editBtn.addEventListener('click', editItem)
  // append element to grocery list
  groceryList.appendChild(element)
}
