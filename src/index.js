import "./styles.css";

const dom = (function () {
    const cache = {
        newTaskButton : document.querySelector("#new_task_button"),
        newListButton : document.querySelector("#new_list_button"),
        sideBar : document.querySelector(".sidebar"),
        lists : document.querySelector(".lists"),
        currentListHeading : document.querySelector("h2"),
        taskContent : document.querySelector(".task_content"),
        newTaskForm : document.querySelector(".form_container"),
        titleInput : document.querySelector("#title"),
        descriptionInput : document.querySelector("#description"),
        priorityInput : document.querySelector("#priority"),
        dueDateInput : document.querySelector("#due_date"),
        formSubmitButton : document.querySelector("#form_submit_button"),
    }

    const bindEvents = function () {
        cache.newListButton.addEventListener('click', () => {
            const listName = prompt("Enter new list name");
            const newList = new List(listName);
            newList.publishList();
        })
        cache.newTaskButton.addEventListener('click', () => {
            cache.newTaskForm.style.display = "block";
        })
        cache.formSubmitButton.addEventListener('click', () => {
            const newTask = new Task(cache.titleInput.value, cache.descriptionInput.value, cache.priorityInput.value, cache.dueDateInput.value);
            taskManager.addTaskToList(newTask);
            cache.newTaskForm.style.display = "none";
        })
    }

    const addListToSidebar = function (list) {
        const newList = document.createElement('div');
        newList.textContent = list.listTitle;
        newList.addEventListener('click', () => {
            listManager.changeCurrentList(list);
            cache.currentListHeading.textContent = list.listTitle;
            addTasksToContent(list);
        })
        cache.lists.appendChild(newList);
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

const task1 = new Task("Do homework", "Get good grades", "High", "Tommorow");
task1.publishTask();
