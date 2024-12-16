import "./styles.css";

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
    }

    const bindEvents = function () {
        cache.newListButton.addEventListener('click', () => {
            cache.newListForm.style.display = "flex";
            cache.formOverlay.style.display = "flex";
        })
        cache.listSubmitButton.addEventListener('click', () => {
            const newList = new List(cache.listTitleInput.value);
            newList.publishList();
            cache.newListForm.style.display = "none";
            cache.formOverlay.style.display = "none";
        })
        cache.listCloseButton.addEventListener('click', () => {
            cache.newListForm.style.display = "none";
            cache.formOverlay.style.display = "none";
            cache.listTitleInput.value = "";
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
        const newList = document.createElement('div');
        newList.setAttribute('class', 'list');
        const listContainer = document.createElement('div');
        listContainer.setAttribute('class', 'list_container');
        const deleteIcon = document.createElement('img');
        deleteIcon.setAttribute('src', "./img/inbox_icon.svg");
        listContainer.append(newList, deleteIcon);
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

    return{addList, getCurrentList, changeCurrentList}
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


