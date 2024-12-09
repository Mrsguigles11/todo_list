import "./styles.css";

const dom = (function () {
    const domCache = {
        newTaskButton : document.querySelector("#new_task_button"),
        newListButton : document.querySelector("#new_list_button"),
        sideBar : document.querySelector(".sidebar"),
    }

    const bindEvents = function () {
        domCache.newListButton.addEventListener('click', () => {
            const listName = prompt("Enter new list name");
            const newList = new List(listName);
            newList.publishList();
        })
    }

    const addNewList = function (list) {
        const newList = document.createElement('div');
        newList.textContent = list;
        domCache.sideBar.appendChild(newList);
    }

    bindEvents();

    return{domCache, addNewList};
})();

class List {
    constructor(list) {
        this.list = list;
    }

    publishList() {
        dom.addNewList(this.list);
    }

}

