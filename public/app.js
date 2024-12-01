document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = 'http://localhost:5000/api';
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskLink');
    const taskManager = document.getElementById('taskManager');
    const authSection = document.getElementById('auth');
    const logoutBtn = document.getElementById('logout');
    const tasksTable = document.querySelector('#tasksTable tbody');
    const usersTable = document.querySelector('#usersTable tbody');
    const searchInput = document.querySelector('#search');
    const filterPriority = document.querySelector('#filterPriority');
    let token = localStorage.getItem('token');
  
    // Toggle display based on auth
    if (token) {
      authSection.style.display = 'none';
      taskManager.style.display = 'block';
      loadTasks();
    }
    // Fetch tasks from the server and update dashboard
async function updateDashboard() {
  try {
    // Fetch all tasks from the backend
    const response = await fetch('/api/tasks');
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const tasks = await response.json();

    // Calculate counts for each priority level
    let lowCount = 0;
    let mediumCount = 0;
    let highCount = 0;

    tasks.forEach((task) => {
      if (task.priority === 'low') {
        lowCount++;
      } else if (task.priority === 'medium') {
        mediumCount++;
      } else if (task.priority === 'high') {
        highCount++;
      }
    });

    // Update the dashboard cards
    document.getElementById('availableTasks').textContent = `Low Tasks: ${lowCount}`;
    document.getElementById('pendingTasks').textContent = `Medium Tasks: ${mediumCount}`;
    document.getElementById('completedTasks').textContent = `High Tasks: ${highCount}`;
  } catch (error) {
    console.error('Error updating dashboard:', error);
  }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', updateDashboard);
    // Fetch and display tasks
async function fetchTasks() {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:5000/api/tasks', {
    headers: { 'x-auth-token': token },
  });
  const { tasks } = await res.json();
  displayTasks(tasks);
}
// Display tasks in table
function displayTasks(tasks) {
  tasksTable.innerHTML = tasks
    .map(
      (task) => `
    <tr>
      <td>${task.title}</td>
      <td>${task.description}</td>
      <td>${task.priority}</td>
      <td>${new Date(task.deadline).toLocaleDateString()}</td>
      <td>
        <button onclick="editTask('${task._id}')">Edit</button>
        <button onclick="deleteTask('${task._id}')">Delete</button>
      </td>
    </tr>`
    )
    .join('');
}
  
    /*Register user
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      };
      
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.token) {
        localStorage.setItem('token', result.token);
        authSection.style.display = 'none';
        taskManager.style.display = 'block';
        loadTasks();
      }
    });*/
    //Register
    document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
    
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
    
      try {
        const res = await fetch(`//localhost:5000/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        });
    
        const data = await res.json();
        if (res.ok) {
          alert('Registration successful! Please login.');
          window.location.href = 'login.html';
        } else {
          alert(data.message || 'Registration failed.');
        }
      } catch (err) {
        console.error(err);
        alert('An error occurred.');
      }
    });
  
    /* Login user
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
      };
      
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.token) {
        localStorage.setItem('token', result.token);
        authSection.style.display = 'none';
        taskManager.style.display = 'block';
        loadTasks();
      }
    });*/
    //Login
    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
    
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
    
      try {
        const res = await fetch(`//localhost:5000/api/auth/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
    
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('token', data.token);
          alert('Login successful!');
          window.location.href = 'task.html';
        } else {
          alert(data.message || 'Login failed.');
        }
      } catch (err) {
        console.error(err);
        alert('An error occurred.');
      }
    });
  
    // Load tasks
    async function loadTasks() {
      taskList.innerHTML = '';
      const res = await fetch(`//localhost:5000/api/auth/tasks`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      const tasks = await res.json();
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `${task.title} - ${task.priority} <button onclick="deleteTask('${task._id}')">Delete</button>`;
        taskList.appendChild(li);
      });
    }
  
    /*Add task
    taskForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        deadline: document.getElementById('taskDeadline').value,
        priority: document.getElementById('taskPriority').value
      };
      
      await fetch(`${apiUrl}/tasks/task`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(data)
      });
      loadTasks();
      taskForm.reset();
    });*/
   // Add a new task
document.getElementById('tasksLink').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const deadline = document.getElementById('deadline').value;
  const priority = document.getElementById('priority').value;
  const token = localStorage.getItem('token');

  await fetch('http://localhost:5000/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify({ title, description, deadline, priority }),
  });

  fetchTasks();
});
  
    // Delete a task
async function deleteTask(taskId) {
  const token = localStorage.getItem('token');
  await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
    method: 'DELETE',
    headers: { 'x-auth-token': token },
  });
  fetchTasks();
}
// Fetch and display users
async function fetchUsers() {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:5000/api/users', {
    headers: { 'x-auth-token': token },
  });
  const { users } = await res.json();
  displayUsers(users);
}

// Display users in table
function displayUsers(users) {
  usersTable.innerHTML = users
    .map(
      (user) => `
    <tr>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td><button onclick="deleteUser('${user._id}')">Delete</button></td>
    </tr>`
    )
    .join('');
}

// Delete a user
async function deleteUser(userId) {
  const token = localStorage.getItem('token');
  await fetch(`http://localhost:5000/api/users/${userId}`, {
    method: 'DELETE',
    headers: { 'x-auth-token': token },
  });
  fetchUsers();
}

// Initial fetch
fetchTasks();
fetchUsers();
  
    // Logout
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      authSection.style.display = 'block';
      taskManager.style.display = 'none';
    });
  });