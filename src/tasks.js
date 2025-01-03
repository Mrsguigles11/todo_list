import { getCurrentList } from "./lists";
import { addTasksToContent } from "./dom";
import { localStorageSetList } from "./localStorage";


class Task {
    constructor(title, description, priority, dueDate) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }

    publishTask() {
        addTaskToList(this);
    }

}

let i = 1;

function addTaskToList(task) {
        const currentList = getCurrentList();
        currentList["task" + i] = task;
        i++;
        addTasksToContent(currentList);
        localStorageSetList(currentList);
    }

function removeTask(task) {
        const currentList = getCurrentList();
        for (const key in currentList) {
            if (currentList[key].title === task.title) {
                delete currentList[key];
                localStorageSetList(currentList);
            }
        }
        addTasksToContent(currentList);
    }

    export {addTaskToList, removeTask, Task};


