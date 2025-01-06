import { getCurrentList } from "./lists";
import { addTasksToContent } from "./dom";
import { localStorageSetList } from "./localStorage";

class Task {
  static #i = 0;

  key;

  constructor(title, description, priority, dueDate) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.key = ++Task.#i;
  }

  publishTask() {
    const currentList = getCurrentList();
    currentList["task" + this.key] = this;
    addTasksToContent(currentList);
    localStorageSetList(currentList);
  }
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

export { removeTask, Task };
