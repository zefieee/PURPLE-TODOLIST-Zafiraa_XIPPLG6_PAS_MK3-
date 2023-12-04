const input = document.querySelector("input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");
let filter = '';

showTodos();

function getTodoHtml(todo, index) {
  if (filter && filter != todo.status) {
    return '';
  }
  let checked = todo.status == "completed" ? "checked" : "";
  return /* html */ `
    <li class="todo">
      <label for="${index}">
        <input id="${index}" type="checkbox" ${checked}>
        <span class="${checked}">${todo.name}</span>
      </label>
      <button class="delete-btn" data-index="${index}"><i class="fa fa-times"></i></button>
    </li>
  `;
}

function showTodos() {
    if (todosJson.length == 0) {
      todosHtml.innerHTML = '';
      emptyImage.style.display = 'block';
    } else {
      todosHtml.innerHTML = todosJson.map(getTodoHtml).join('');
      emptyImage.style.display = 'none';
      // Add event listeners after rendering todos
      addEventListeners();
  }
}

function addTodo(todo) {
  input.value = "";
  todosJson.unshift({ name: todo, status: "pending" });
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

function updateStatus(todo) {
    let todoName = todo.parentElement.lastElementChild;
    if (todo.checked) {
      todoName.classList.add("checked");
      todosJson[todo.id].status = "completed";
    } else {
      todoName.classList.remove("checked");
      todosJson[todo.id].status = "pending";
    }
    localStorage.setItem("todos", JSON.stringify(todosJson));
}

function remove(todo) {
  const index = todo.dataset.index;
  todosJson.splice(index, 1);
  showTodos();
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

function addEventListeners() {
  const checkboxInputs = document.querySelectorAll('.todo input[type="checkbox"]');
  const deleteButtons = document.querySelectorAll('.delete-btn');

  checkboxInputs.forEach((checkbox, index) => {
    checkbox.addEventListener('change', function () {
      updateStatus({ id: index, checked: this.checked, parentElement: this.parentElement });
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener('click', function () {
      remove(this);
    });
  });
}

input.addEventListener("keyup", e => {
  let todo = input.value.trim();
  if (!todo || e.key != "Enter") {
    return;
  }
  addTodo(todo);
});

addButton.addEventListener("click", () => {
  let todo = input.value.trim();
  if (!todo) {
    return;
  }
  addTodo(todo);
});

filters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    if (el.classList.contains('active')) {
      el.classList.remove('active');
      filter = '';
    } else {
      filters.forEach(tag => tag.classList.remove('active'));
      el.classList.add('active');
      filter = e.target.dataset.filter;
    }
    showTodos();
  });
});

deleteAllButton.addEventListener("click", () => {
    // Remove only completed todos
    todosJson = todosJson.filter(todo => todo.status !== "completed");
    localStorage.setItem("todos", JSON.stringify(todosJson));
    showTodos();
  });
  
