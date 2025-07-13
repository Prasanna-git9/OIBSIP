const newTaskInput = document.getElementById('newTask');
const pendingList = document.getElementById('pendingList');
const completedList = document.getElementById('completedList');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString();
}

function render() {
  pendingList.innerHTML = '';
  completedList.innerHTML = '';

  tasks.forEach((task, i) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;
    span.title = 'Click to edit';
    span.contentEditable = false;

    // Edit on click
    span.addEventListener('click', () => {
      span.contentEditable = true;
      span.focus();
    });
    // Save edit on blur or enter key
    span.addEventListener('blur', () => {
      span.contentEditable = false;
      const newText = span.textContent.trim();
      if(newText) {
        task.text = newText;
        saveTasks();
      } else {
        // Remove if empty after edit
        tasks.splice(i,1);
        saveTasks();
      }
      render();
    });
    span.addEventListener('keydown', e => {
      if(e.key === 'Enter') {
        e.preventDefault();
        span.blur();
      }
    });

    const dateInfo = document.createElement('small');
    dateInfo.textContent = task.completed 
      ? `Completed: ${formatDate(task.completedAt)}`
      : `Added: ${formatDate(task.addedAt)}`;

    const btnComplete = document.createElement('button');
    btnComplete.textContent = task.completed ? 'Undo' : 'Done';
    btnComplete.title = task.completed ? 'Mark as pending' : 'Mark as completed';
    btnComplete.onclick = () => {
      task.completed = !task.completed;
      if(task.completed) {
        task.completedAt = new Date().toISOString();
      } else {
        delete task.completedAt;
      }
      saveTasks();
      render();
    };

    const btnDelete = document.createElement('button');
    btnDelete.textContent = '✕';
    btnDelete.title = 'Delete task';
    btnDelete.onclick = () => {
      tasks.splice(i, 1);
      saveTasks();
      render();
    };

    li.appendChild(span);
    li.appendChild(dateInfo);
    li.appendChild(btnComplete);
    li.appendChild(btnDelete);

    if(task.completed) {
      completedList.appendChild(li);
    } else {
      pendingList.appendChild(li);
    }
  });
}

newTaskInput.addEventListener('keydown', e => {
  if(e.key === 'Enter') {
    const text = newTaskInput.value.trim();
    if(text) {
      tasks.push({ text, completed: false, addedAt: new Date().toISOString() });
      saveTasks();
      newTaskInput.value = '';
      render();
    }
  }
});

// Initial render
render();
