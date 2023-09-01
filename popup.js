document.addEventListener('DOMContentLoaded', function() {
  const taskInput = document.getElementById('task');
  const addTaskButton = document.getElementById('addTask');
  const taskList = document.getElementById('taskList');
  const removeAllTasksButton = document.getElementById('removeAllTasks');

  function saveTasks(tasks) {
    chrome.storage.local.set({ tasks: tasks }, function() {
      if (chrome.runtime.lastError) {
        console.error("Error saving tasks:", chrome.runtime.lastError);
        return;
      }
      // Update the user interface here
    });
  }

  function loadTasks(callback) {
    chrome.storage.local.get(['tasks'], function(result) {
      const tasks = result.tasks || [];
      callback(tasks);
    });
  }

  loadTasks(function(tasks) {
    taskList.innerHTML = tasks
      .map((task, index) => {
        return `<li><input type="checkbox" class="task-checkbox" data-index="${index}"><span>${task}</span></li>`;
      })
      .join('');
  });

  addTaskButton.addEventListener('click', function() {
    const taskText = taskInput.value.trim();
    if (taskText) {
      loadTasks(function(tasks) {
        tasks.push(taskText);
        saveTasks(tasks);

        const taskItem = document.createElement('li');
        taskItem.innerHTML = `<input type="checkbox" class="task-checkbox" data-index="${tasks.length - 1}"><span>${taskText}</span>`;
        taskList.appendChild(taskItem);

        taskInput.value = '';
      });
    }
  });
  taskList.addEventListener('click', function(event) {
    const target = event.target;
    if (target.classList.contains('task-checkbox')) {
      const index = target.getAttribute('data-index');
      const taskItem = target.parentElement;
  
      loadTasks(function(tasks) {
        tasks.splice(index, 1);
        saveTasks(tasks);
  
        taskItem.classList.add('removing');
  
        setTimeout(function() {
          taskItem.remove();
        }, 3000); // Attendre 3 secondes avant de supprimer définitivement
  
        // Retirez la classe "removing" après 3 secondes
        setTimeout(function() {
          taskItem.classList.remove('removing');
        }, 300); // Correspond à la durée de l'animation (300 ms)
      });
    }
  });

  removeAllTasksButton.addEventListener('click', function() {
    saveTasks([]);
    taskList.innerHTML = '';
  });

  let pomodoroInterval; // Variable to store Pomodoro interval
});
