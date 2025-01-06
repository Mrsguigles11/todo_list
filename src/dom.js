import listEditIcon from "./img/pencil_edited.svg";
import taskEditIcon from "./img/pencil.svg";
import taskDeleteIcon from "./img/delete.svg";
import { List, removeList, changeCurrentList, getCurrentList } from "./lists";
import { Task, removeTask } from "./tasks";
import { localStorageRemoveList, localStorageSetList } from "./localStorage";

const cache = {
  newTaskButton: document.querySelector("#new_task_button"),
  newListButton: document.querySelector("#new_list_button"),
  sideBar: document.querySelector(".sidebar"),
  lists: document.querySelector(".lists"),
  currentListHeading: document.querySelector("h2"),
  taskContent: document.querySelector(".content"),
  taskForm: document.querySelector(".task_form_container"),
  taskFormHeading: document.querySelector("#task_form_heading"),
  taskTitleInput: document.querySelector("#title"),
  taskDescriptionInput: document.querySelector("#description"),
  taskPriorityInput: document.querySelector("input[list]"),
  taskDueDateInput: document.querySelector("#due_date"),
  taskSubmitButton: document.querySelector("#form_submit_button"),
  formOverlay: document.querySelector(".form_overlay"),
  taskCloseButton: document.querySelector("#form_close_button"),
  newListForm: document.querySelector(".list_form_container"),
  listTitleInput: document.querySelector("#list_name"),
  listCloseButton: document.querySelector("#list_close_button"),
  listSubmitButton: document.querySelector("#list_submit_button"),
  listFormTitle: document.querySelector("#list_form_title"),
};

const bindEvents = (function () {
  cache.newListButton.addEventListener("click", () => {
    renderForm.newListForm();
  });
  cache.listCloseButton.addEventListener("click", () => {
    toggleFormOff(cache.newListForm);
    cache.newListForm.removeChild(cache.newListForm.lastChild);
  });
  cache.newTaskButton.addEventListener("click", () => {
    renderForm.newTaskForm();
  });
  cache.taskCloseButton.addEventListener("click", () => {
    toggleFormOff(cache.taskForm);
    cache.taskForm.removeChild(cache.taskForm.lastChild);
  });
})();

function toggleFormOn(form) {
  form.style.display = "flex";
  cache.formOverlay.style.display = "flex";
}

const renderForm = (function () {
  const newListForm = function () {
    toggleFormOn(cache.newListForm);
    cache.listFormTitle.textContent = "New List";
    const listSubmitButton = document.createElement("button");
    listSubmitButton.setAttribute("id", "list_submit_button");
    listSubmitButton.textContent = "Submit";
    cache.newListForm.append(listSubmitButton);
    listSubmitButton.addEventListener("click", () => {
      const newList = new List(cache.listTitleInput.value);
      newList.publishList();
      toggleFormOff(cache.newListForm);
      cache.newListForm.removeChild(listSubmitButton);
    });
  };

  const editListForm = function (list, container, listHeading) {
    toggleFormOn(cache.newListForm);
    cache.listFormTitle.textContent = `Edit ${list.listTitle}`;
    const editListSubmitButton = document.createElement("button");
    editListSubmitButton.setAttribute("id", "list_submit_button");
    editListSubmitButton.textContent = "Submit";
    editListSubmitButton.addEventListener("click", () => {
      list.listTitle = cache.listTitleInput.value;
      listHeading.textContent = list.listTitle;
      toggleFormOff(cache.newListForm);
      cache.newListForm.removeChild(buttonContainer);
    });
    const removeButton = document.createElement("button");
    removeButton.textContent = "Delete";
    removeButton.setAttribute("class", "list_remove_button");
    removeButton.addEventListener("click", () => {
      removeList(list);
      localStorageRemoveList(list);
      cache.lists.removeChild(container);
      toggleFormOff(cache.newListForm);
      cache.newListForm.removeChild(buttonContainer);
      cache.currentListHeading.textContent = getCurrentList().listTitle;
      addTasksToContent(getCurrentList());
    });
    const buttonContainer = document.createElement("div");
    buttonContainer.setAttribute("class", "button_container");
    buttonContainer.append(removeButton, editListSubmitButton);
    cache.newListForm.append(buttonContainer);
  };

  const newTaskForm = function () {
    toggleFormOn(cache.taskForm);
    cache.taskFormHeading.textContent = "New Task";
    const newTaskSubmitButton = Object.assign(
      document.createElement("button"),
      { id: "task_submit_button" },
    );
    newTaskSubmitButton.textContent = "Submit";
    newTaskSubmitButton.addEventListener("click", () => {
      const newTask = new Task(
        cache.taskTitleInput.value,
        cache.taskDescriptionInput.value,
        cache.taskPriorityInput.value,
        cache.taskDueDateInput.value,
      );
      newTask.publishTask();
      toggleFormOff(cache.taskForm);
      cache.taskForm.removeChild(cache.taskForm.lastChild);
    });
    cache.taskForm.append(newTaskSubmitButton);
  };

  const editTaskForm = function (task) {
    toggleFormOn(cache.taskForm);
    cache.taskFormHeading.textContent = `Edit Task ${task.title}`;
    cache.taskTitleInput.value = task.title;
    cache.taskDescriptionInput.value = task.description;
    cache.taskPriorityInput.value = task.priority;
    cache.taskDueDateInput.value = task.dueDate;
    const editTaskSubmitButton = Object.assign(
      document.createElement("button"),
      { id: "task_submit_button" },
    );
    editTaskSubmitButton.textContent = "Submit";
    editTaskSubmitButton.addEventListener("click", () => {
      task.title = cache.taskTitleInput.value;
      task.description = cache.taskDescriptionInput.value;
      task.priority = cache.taskPriorityInput.value;
      task.dueDate = cache.taskDueDateInput.value;
      toggleFormOff(cache.taskForm);
      cache.taskForm.removeChild(cache.taskForm.lastChild);
      addTasksToContent(getCurrentList());
      localStorageSetList(getCurrentList());
    });
    cache.taskForm.append(editTaskSubmitButton);
  };

  return { newListForm, editListForm, editTaskForm, newTaskForm };
})();

function toggleFormOff(form) {
  form.style.display = "none";
  cache.formOverlay.style.display = "none";
  cache.listTitleInput.value = "";
  cache.listFormTitle.textContent = "";
  cache.taskTitleInput.value = "";
  cache.taskDescriptionInput.value = "";
  cache.taskPriorityInput.value = "";
  cache.taskDueDateInput.value = "";
  cache.taskDueDateInput.type = "text";
}

function addListToSidebar(list) {
  const listContainer = document.createElement("div");
  listContainer.setAttribute("class", "list_container");
  const newList = document.createElement("div");
  newList.setAttribute("class", "list");
  listContainer.append(newList);
  if (list.listTitle !== "All Tasks") {
    const editIcon = document.createElement("img");
    editIcon.src = listEditIcon;
    editIcon.setAttribute("class", "list_edit_icon");
    listContainer.append(editIcon);
    editIcon.addEventListener("click", () => {
      renderForm.editListForm(list, listContainer, newList);
    });
  }
  newList.textContent = list.listTitle;
  newList.addEventListener("click", () => {
    changeCurrentList(list);
    cache.currentListHeading.textContent = list.listTitle;
    addTasksToContent(list);
  });
  cache.lists.appendChild(listContainer);
}

function addTasksToContent(list) {
  cache.taskContent.innerHTML = "";
  for (const task in list) {
    if (task !== "listTitle") {
      const newTask = document.createElement("div");
      newTask.setAttribute("class", "task");
      cache.taskContent.appendChild(newTask);
      const taskTitle = Object.assign(document.createElement("div"), {
        classList: "task_title",
      });
      taskTitle.textContent = list[task].title;
      const taskDescription = Object.assign(document.createElement("div"), {
        classList: "task_description",
      });
      taskDescription.textContent = list[task].description;
      const titleDescriptionContainer = Object.assign(
        document.createElement("div"),
        { classList: "task_description_container" },
      );
      titleDescriptionContainer.append(taskTitle, taskDescription);
      const taskPriority = document.createElement("div");
      taskPriority.textContent = list[task].priority;
      if (taskPriority.textContent === "High") {
        taskPriority.style.color = "rgb(190, 21, 21)";
      } else if (taskPriority.textContent === "Medium") {
        taskPriority.style.color = "#fbbf24";
      } else {
        taskPriority.style.color = "#a3e635";
      }
      const taskDueDate = document.createElement("div");
      taskDueDate.textContent = list[task].dueDate;
      const editTask = Object.assign(document.createElement("img"), {
        classList: "task_icon",
      });
      editTask.src = taskEditIcon;
      editTask.addEventListener("click", () => {
        renderForm.editTaskForm(list[task]);
      });
      const deleteTask = Object.assign(document.createElement("img"), {
        classList: "task_icon",
      });
      deleteTask.src = taskDeleteIcon;
      deleteTask.addEventListener("click", () => {
        cache.taskContent.removeChild(newTask);
        removeTask(list[task]);
      });
      const checkTask = document.createElement("input");
      checkTask.setAttribute("type", "checkbox");
      checkTask.setAttribute("class", "task_check_box");
      checkTask.checked = false;
      checkTask.addEventListener("click", () => {
        if (checkTask.checked == true) {
          taskTitle.style.textDecoration = "line-through";
          taskDescription.style.textDecoration = "line-through";
        } else {
          taskTitle.style.textDecoration = "none";
          taskDescription.style.textDecoration = "none";
        }
      });
      const taskInfoContainer = Object.assign(document.createElement("div"), {
        classList: "task_info_container",
      });
      taskInfoContainer.append(
        taskPriority,
        taskDueDate,
        editTask,
        deleteTask,
        checkTask,
      );
      newTask.append(titleDescriptionContainer, taskInfoContainer);
    }
  }
}

export { addListToSidebar, addTasksToContent };
