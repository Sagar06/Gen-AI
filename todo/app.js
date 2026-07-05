function addTask() {
const taskInput = document.getElementById('task');
const task = taskInput.value.trim();
if (task === '') {
alert('Really? You forgot to type your task!');
return;
}
const list = document.getElementById('list');
const listItem = document.createElement('li');
listItem.textContent = task;
list.appendChild(listItem);
taskInput.value = '';
}
