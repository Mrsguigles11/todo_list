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

    addTask(task) {
        this.task = task;
    }

}

const listManager = (function () {
    const lists = [];

    const addList = function(list) {
        lists.push(list);
        dom.addNewList(list);
        console.log(lists);
    }

    return{addList}
 })();

class Task {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority
    }


}