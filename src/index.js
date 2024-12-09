import "./styles.css";

(function () {
    const domCache = {
        newTaskButton : document.querySelector("#new_task_button"),
        newListButton : document.querySelector("#new_list_button"),
    }

    const bindEvents = function () {
        domCache.newListButton.addEventListener('click', () => {
            const newListName = prompt("Enter new list name");
            listManager.publishList(newListName);
        })
    }

    bindEvents();

    return{domCache};
})();

// class listManager {
//     constructor(list) {
//         this.list = list;
//     }

//     publishList(list) {
//         this.list = list
//     }

// }