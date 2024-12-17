import "./styles.css";
import listEditIcon from "./img/pencil_edited.svg";

const dom = (function () {
    const cache = {
        newTaskButton : document.querySelector("#new_task_button"),
        newListButton : document.querySelector("#new_list_button"),
        sideBar : document.querySelector(".sidebar"),
        lists : document.querySelector(".lists"),
        currentListHeading : document.querySelector("h2"),
        taskContent : document.querySelector(".task_content"),
        newTaskForm : document.querySelector(".task_form_container"),
        taskTitleInput : document.querySelector("#title"),
        taskDescriptionInput : document.querySelector("#description"),
        taskPriorityInput : document.querySelector("input[list]"),
        taskDueDateInput : document.querySelector("#due_date"),
        taskSubmitButton : document.querySelector("#form_submit_button"),
        formOverlay : document.querySelector(".form_overlay"),
        taskCloseButton : document.querySelector("#form_close_button"),
        newListForm : document.querySelector(".list_form_container"),
        listTitleInput : document.querySelector("#list_name"),
        listCloseButton : document.querySelector("#list_close_button"),
        listSubmitButton : document.querySelector("#list_submit_button"),
        listFormTitle : document.querySelector("#list_form_title"),
    }

    const bindEvents = function () {
        cache.newListButton.addEventListener('click', () => {
            cache.newListForm.style.display = "flex";
            cache.formOverlay.style.display = "flex";
            cache.listFormTitle.textContent = "New List";
            const listSubmitButton = document.createElement('button');
            listSubmitButton.setAttribute('id', 'list_submit_button');
            listSubmitButton.textContent = "Submit";
            cache.newListForm.append(listSubmitButton);
            listSubmitButton.addEventListener('click', () => {
                const newList = new List(cache.listTitleInput.value);
                newList.publishList();
                cache.newListForm.style.display = "none";
                cache.formOverlay.style.display = "none";
                cache.listTitleInput.value = "";
                cache.listFormTitle.textContent = "";
                cache.newListForm.removeChild(listSubmitButton);
            })
        })
        cache.listCloseButton.addEventListener('click', () => {
            cache.newListForm.style.display = "none";
            cache.formOverlay.style.display = "none";
            cache.listTitleInput.value = "";
            cache.newListForm.removeChild(cache.newListForm.lastChild);
        })
        cache.newTaskButton.addEventListener('click', () => {
            cache.newTaskForm.style.display = "flex";
            cache.formOverlay.style.display = "flex";
        })
        cache.taskSubmitButton.addEventListener('click', () => {
            const newTask = new Task(cache.taskTitleInput.value, cache.taskDescriptionInput.value, cache.taskPriorityInput.value, cache.taskDueDateInput.value);
            taskManager.addTaskToList(newTask);
            cache.newTaskForm.style.display = "none";
            cache.formOverlay.style.display = "none";
            cache.taskTitleInput.value = "";
            cache.taskDescriptionInput.value = "";
            cache.taskPriorityInput.value = "";
            cache.taskDueDateInput.value = "";
            cache.taskDueDateInput.type = 'text';
        })
        cache.taskCloseButton.addEventListener('click', () => {
            cache.newTaskForm.style.display = "none";
            cache.formOverlay.style.display = "none";
            cache.taskTitleInput.value = "";
            cache.taskDescriptionInput.value = "";
            cache.taskPriorityInput.value = "";
            cache.taskDueDateInput.value = "";
            cache.taskDueDateInput.type = 'text';
        })
    }

    const addListToSidebar = function (list) {
        const listContainer = document.createElement('div');
        listContainer.setAttribute('class', 'list_container');
        const newList = document.createElement('div');
        newList.setAttribute('class', 'list');
        listContainer.append(newList);
        if (list.listTitle !== "All Tasks") {
        const editIcon = document.createElement('img');
        editIcon.src = listEditIcon;
        editIcon.setAttribute('class', 'list_edit_icon'); 
        listContainer.append(editIcon);
        editIcon.addEventListener('click', () => {
            cache.newListForm.style.display = "flex";
            cache.formOverlay.style.display = "flex";
            cache.listFormTitle.textContent = `Edit ${list.listTitle}`;
            const editListSubmitButton = document.createElement('button');
            editListSubmitButton.setAttribute('id', 'list_submit_button');
            editListSubmitButton.textContent = "Submit";
            editListSubmitButton.addEventListener('click', () => {
                list.listTitle = cache.listTitleInput.value;
                newList.textContent = list.listTitle;
                cache.newListForm.style.display = "none";
                cache.formOverlay.style.display = "none";
                cache.listTitleInput.value = "";
                cache.newListForm.removeChild(buttonContainer);
            })
            const removeButton = document.createElement('button');
            removeButton.textContent = "Delete";
            removeButton.setAttribute('class', 'list_remove_button');
            removeButton.addEventListener('click', () => {
                listManager.removeList(list);
                cache.lists.removeChild(listContainer);
                cache.newListForm.style.display = "none";
                cache.formOverlay.style.display = "none";
                cache.listTitleInput.value = "";
                cache.newListForm.removeChild(buttonContainer);
            })
            const buttonContainer = document.createElement('div');
            buttonContainer.setAttribute('class', 'button_container');
            buttonContainer.append(removeButton, editListSubmitButton);
            cache.newListForm.append(buttonContainer);
        })
        }
        newList.textContent = list.listTitle;
        newList.addEventListener('click', () => {
            listManager.changeCurrentList(list);
            cache.currentListHeading.textContent = list.listTitle;
            addTasksToContent(list);
        })
        cache.lists.appendChild(listContainer);
    }

    const addTasksToContent = function (list) {
        cache.taskContent.innerHTML = "";
        for (const task in list) {
            if (task !== "listTitle") {
                const newTask = document.createElement('div');
                newTask.textContent = `Title: ${list[task].title} Description: ${list[task].description} Priority: ${list[task].priority} Due date: ${list[task].dueDate}`;
                cache.taskContent.appendChild(newTask);}}       
    }

    bindEvents();

    return{cache, addListToSidebar, addTasksToContent};
})();

class List {
    constructor(listTitle) {
        this.listTitle = listTitle;
    }

    publishList() {
        listManager.addList(this);
    }

}

const listManager = (function () {
    const allTasks = new List ("All Tasks");
    dom.addListToSidebar(allTasks);
    let currentList = allTasks;
    const lists = [allTasks];

    const addList = function(list) {
        lists.push(list);
        dom.addListToSidebar(list);
    }

    const getCurrentList = function () {
        return(currentList);
    }

    const changeCurrentList = function (list) {
        currentList = list;
    }

    const removeList = function (list) {
        for (let i = 0; i < lists.length; i++) {
            if (lists[i] === list) {
                lists.splice(i, 1);
            }
        }
    }

    return{addList, getCurrentList, changeCurrentList, removeList}
 })();

 const taskManager = (function () {
    let i = 1;

    const addTaskToList = function(task) {
        const currentList = listManager.getCurrentList();
        currentList["task" + i] = task;
        i++;
        dom.addTasksToContent(currentList);
        console.log(currentList);
    }

    const removeTask = function (task) {
        const currentList = listManager.getCurrentList();
        for (const key in currentList) {
            if (currentList[key].title === task.title) {
                delete currentList[key];
                console.log(currentList);
            }
        }
        dom.addTasksToContent(currentList);
    }

    return {addTaskToList, removeTask}
 })();

class Task {
    constructor(title, description, priority, dueDate) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }

    publishTask() {
        taskManager.addTaskToList(this);
    }

}

