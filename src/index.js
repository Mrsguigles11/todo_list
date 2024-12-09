import "./styles.css";

const dom = (function () {
    const cache = {
        newTaskButton : document.querySelector("#new_task_button"),
        newListButton : document.querySelector("#new_list_button"),
        sideBar : document.querySelector(".sidebar"),
    }

    const bindEvents = function () {
        cache.newListButton.addEventListener('click', () => {
            const listName = prompt("Enter new list name");
            const newList = new List(listName);
            newList.publishList();
        })
        cache.newTaskButton.addEventListener('click', () => {
            const taskTitle = prompt("Enter new task name");
            const newTask = new Task(taskTitle);
            newTask.publishTask();
        })
    }

    const addNewList = function (list) {
        const newList = document.createElement('div');
        newList.textContent = list.list;
        cache.sideBar.appendChild(newList);
    }

    bindEvents();

    return{cache, addNewList};
})();

class List {
    constructor(list) {
        this.list = list;
    }

    publishList() {
        listManager.addList(this);
    }

    addTask(taskTitle, task) {
        this[taskTitle] = task;
    }

}

const listManager = (function () {
    const lists = [];

    const addList = function(list) {
        lists.push(list);
        dom.addNewList(list);
        console.log(lists);
    }

    const getCurrentList = function () {
        return(lists[0]);
    }

    return{addList, getCurrentList, lists}
 })();

class Task {
    constructor(title) {
        this.title = title;
        // this.description = description;
        // this.dueDate = dueDate;
        // this.priority = priority
    }

    publishTask() {
        const currentList = listManager.getCurrentList();
        currentList.addTask(this.title, this);
        console.log(listManager.lists);
    }

}