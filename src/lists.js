import { addListToSidebar } from "./dom";
import { localStorageSetList, localStorageRemoveList } from "./localStorage";

class List {
  constructor(listTitle) {
    this.listTitle = listTitle;
  }

  publishList() {
    lists.push(this);
    localStorageSetList(this);
    addListToSidebar(this);
  }
}

let currentList = "";
const lists = [];

function getCurrentList() {
  return currentList;
}

function changeCurrentList(list) {
  currentList = list;
}

function removeList(list) {
  for (let i = 0; i < lists.length; i++) {
    if (lists[i] === list) {
      lists.splice(i, 1);
      currentList = lists[i - 1];
      localStorageRemoveList(list);
    }
  }
}

function insertStorageList(list) {
  lists.push(list);
  addListToSidebar(list);
}

export {
  List,
  getCurrentList,
  changeCurrentList,
  removeList,
  insertStorageList,
};
