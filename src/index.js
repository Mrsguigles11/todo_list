import "./styles.css";
import { insertStorageList, changeCurrentList, List } from "./lists";
import { addTasksToContent } from "./dom";
    
const onPageLoad = (function () {
    const lists = {...localStorage};

    const loadLists = function () {
    for (const list in lists) {
        const storageList = JSON.parse(localStorage.getItem(list));
        insertStorageList(storageList);
    }}

    const createDefaultList = function () {
    if ('All Tasks' in lists) {
        const allTasks = JSON.parse(localStorage.getItem("All Tasks"));
        addTasksToContent(allTasks);
        changeCurrentList(allTasks);
    } 
    else {
        const allTasks = new List("All Tasks");
        allTasks.publishList();
    } }

    createDefaultList();
    loadLists();
})();

