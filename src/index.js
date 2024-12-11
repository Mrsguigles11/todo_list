import "./styles.css";

const dom = (function () {
    const cache = {
        newTaskButton : document.querySelector("#new_task_button"),
        newListButton : document.querySelector("#new_list_button"),
        sideBar : document.querySelector(".sidebar"),
        lists : document.querySelector(".lists"),
        currentListHeading : document.querySelector("h2"),
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

    const addListToSidebar = function (list) {
        const newList = document.createElement('div');
        newList.textContent = list.listTitle;
        newList.addEventListener('click', () => {
            listManager.changeCurrentList(list);
            cache.currentListHeading.textContent = list.listTitle;
        })
        cache.lists.appendChild(newList);
    }

    bindEvents();

    return{cache, addListToSidebar};
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
    }

    return {addTaskToList, removeTask}
 })();

class Task {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority
    }

    publishTask() {
        taskManager.addTaskToList(this);
    }

}

const task1 = new Task("Do homework", "Get good grades", "Tommorow", "High");
task1.publishTask();
const task2 = new Task("1", "2", "3", "4");
task2.publishTask();
taskManager.removeTask(task1);