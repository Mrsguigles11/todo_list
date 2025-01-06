function localStorageSetList(list) {
  localStorage[list.listTitle] = JSON.stringify(list);
}

function localStorageRemoveList(list) {
  localStorage.removeItem(list.listTitle);
}

export { localStorageSetList, localStorageRemoveList };
