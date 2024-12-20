import "./styles.css";
import listEditIcon from "./img/pencil_edited.svg";
import taskEditIcon from "./img/pencil.svg";
import taskDeleteIcon from "./img/delete.svg";

const dom = (function () {
    const cache = {
        newTaskButton : document.querySelector("#new_task_button"),
        newListButton : document.querySelector("#new_list_button"),
        sideBar : document.querySelector(".sidebar"),
        lists : document.querySelector(".lists"),
        currentListHeading : document.querySelector("h2"),
        taskContent : document.querySelector(".content"),
        taskForm : document.querySelector(".task_form_container"),
        taskFormHeading : document.querySelector('#task_form_heading'),
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
            renderForm.newListForm();
        })
        cache.listCloseButton.addEventListener('click', () => {
            toggleFormOff(cache.newListForm);
            cache.newListForm.removeChild(cache.newListForm.lastChild);
        })
        cache.newTaskButton.addEventListener('click', () => {
            renderForm.newTaskForm();
        })
        cache.taskCloseButton.addEventListener('click', () => {
            toggleFormOff(cache.taskForm);
            cache.taskForm.removeChild(cache.taskForm.lastChild);
        })
    }

    const toggleFormOn = function (form) {
        form.style.display = "flex";
        cache.formOverlay.style.display = "flex";
    } 

    const renderForm = (function () {
        const newListForm = function () {
            toggleFormOn(cache.newListForm);
            cache.listFormTitle.textContent = "New List";
            const listSubmitButton = document.createElement('button');
            listSubmitButton.setAttribute('id', 'list_submit_button');
            listSubmitButton.textContent = "Submit";
            cache.newListForm.append(listSubmitButton);
            listSubmitButton.addEventListener('click', () => {
                const newList = new List(cache.listTitleInput.value);
                newList.publishList();
                toggleFormOff(cache.newListForm);
                cache.newListForm.removeChild(listSubmitButton);
            })
        }

        const editListForm = function (list, container, listHeading) {
            toggleFormOn(cache.newListForm);
            cache.listFormTitle.textContent = `Edit ${list.listTitle}`;
            const editListSubmitButton = document.createElement('button');
            editListSubmitButton.setAttribute('id', 'list_submit_button');
            editListSubmitButton.textContent = "Submit";
            editListSubmitButton.addEventListener('click', () => {
                list.listTitle = cache.listTitleInput.value;
                listHeading.textContent = list.listTitle;
                toggleFormOff(cache.newListForm);
                cache.newListForm.removeChild(buttonContainer);
            })
            const removeButton = document.createElement('button');
            removeButton.textContent = "Delete";
            removeButton.setAttribute('class', 'list_remove_button');
            removeButton.addEventListener('click', () => {
                listManager.removeList(list);
                cache.lists.removeChild(container);
                toggleFormOff(cache.newListForm);
                cache.newListForm.removeChild(buttonContainer);
                })
            const buttonContainer = document.createElement('div');
            buttonContainer.setAttribute('class', 'button_container');
            buttonContainer.append(removeButton, editListSubmitButton);
            cache.newListForm.append(buttonContainer);
        }

        const newTaskForm = function () {
            toggleFormOn(cache.taskForm);
            cache.taskFormHeading.textContent = "New Task";
            const newTaskSubmitButton = Object.assign(document.createElement('button'), {id : "task_submit_button"});
            newTaskSubmitButton.textContent = "Submit";
            newTaskSubmitButton.addEventListener('click', () => {
                const newTask = new Task(cache.taskTitleInput.value, cache.taskDescriptionInput.value, cache.taskPriorityInput.value, cache.taskDueDateInput.value);
                taskManager.addTaskToList(newTask);
                toggleFormOff(cache.taskForm);
                cache.taskForm.removeChild(cache.taskForm.lastChild);
            });
            cache.taskForm.append(newTaskSubmitButton);
        } 

        const editTaskForm = function (task) {
            toggleFormOn(cache.taskForm);
            cache.taskFormHeading.textContent = `Edit Task ${task.title}`;
            cache.taskTitleInput.value = task.title;
            cache.taskDescriptionInput.value = task.description;
            cache.taskPriorityInput.value = task.priority;
            cache.taskDueDateInput.value = task.dueDate;
            const editTaskSubmitButton = Object.assign(document.createElement('button'), {id : "task_submit_button"});
            editTaskSubmitButton.textContent = "Submit";
            editTaskSubmitButton.addEventListener('click', () => {
                task.title = cache.taskTitleInput.value;
                task.description = cache.taskDescriptionInput.value;
                task.priority = cache.taskPriorityInput.value;
                task.dueDate = cache.taskDueDateInput.value;
                toggleFormOff(cache.taskForm);
                cache.taskForm.removeChild(cache.taskForm.lastChild);
                addTasksToContent(listManager.getCurrentList());
            })
            cache.taskForm.append(editTaskSubmitButton);
        }

        return {newListForm, editListForm, editTaskForm, newTaskForm}

    })();

    const toggleFormOff = function (form) {
        form.style.display = "none";
        cache.formOverlay.style.display = "none";
        cache.listTitleInput.value = "";
        cache.listFormTitle.textContent = "";
        cache.taskTitleInput.value = "";
        cache.taskDescriptionInput.value = "";
        cache.taskPriorityInput.value = "";
        cache.taskDueDateInput.value = "";
        cache.taskDueDateInput.type = 'text';
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
                renderForm.editListForm(list, listContainer, newList);
            })}
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
                newTask.setAttribute('class', 'task');
                cache.taskContent.appendChild(newTask);
                const taskTitle = Object.assign(document.createElement('div'), {classList:"task_title"});
                taskTitle.textContent = list[task].title;
                const taskDescription = Object.assign(document.createElement('div'), {classList:'task_description'});
                taskDescription.textContent = list[task].description;
                const titleDescriptionContainer = Object.assign(document.createElement('div'), {classList:'task_description_container'});
                titleDescriptionContainer.append(taskTitle, taskDescription);
                const taskPriority = Object.assign(document.createElement('div'));
                taskPriority.textContent = list[task].priority;
                const taskDueDate = Object.assign(document.createElement('div'));
                taskDueDate.textContent = list[task].dueDate;
                const editTask = Object.assign(document.createElement('img'), {classList:'task_icon'});
                editTask.src = taskEditIcon;
                editTask.addEventListener('click', () => {
                    renderForm.editTaskForm(list[task]);
                })
                const deleteTask = Object.assign(document.createElement('img'), {classList:'task_icon'});
                deleteTask.src = taskDeleteIcon;
                deleteTask.addEventListener('click', () => {
                    cache.taskContent.removeChild(newTask);
                    taskManager.removeTask(list[task]);
                })
                const checkTask = document.createElement('input');
                checkTask.setAttribute('type', 'checkbox');
                checkTask.setAttribute('class', 'task_check_box');
                checkTask.checked = false;
                checkTask.addEventListener('click', () => {
                    if (checkTask.checked == true) {
                        taskTitle.style.textDecoration = "line-through";
                        taskDescription.style.textDecoration = "line-through";
                    }
                    else {
                        taskTitle.style.textDecoration = "none";
                        taskDescription.style.textDecoration = "none";
                    }
                })
                const taskInfoContainer = Object.assign(document.createElement('div'), {classList:'task_info_container'});
                taskInfoContainer.append(taskPriority, taskDueDate, editTask, deleteTask, checkTask);
                newTask.append(titleDescriptionContainer, taskInfoContainer);
                }}       
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
                currentList = lists[i-1];
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

const testTask = new Task("Homework", "Maths", "High", "03/07/1996");
testTask.publishTask();
