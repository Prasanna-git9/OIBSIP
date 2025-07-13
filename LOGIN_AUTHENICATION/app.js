// Show/hide pages
function showRegister() {
  document.getElementById('registerPage').style.display = 'block';
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('securedPage').style.display = 'none';
  clearMessages();
  clearInputs();
}
function showLogin() {
  document.getElementById('registerPage').style.display = 'none';
  document.getElementById('loginPage').style.display = 'block';
  document.getElementById('securedPage').style.display = 'none';
  clearMessages();
  clearInputs();
}
function showSecured(username) {
  document.getElementById('registerPage').style.display = 'none';
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('securedPage').style.display = 'block';
  document.getElementById('userDisplay').innerText = username;
}
function clearMessages() {
  document.getElementById('registerMessage').style.display = 'none';
  document.getElementById('loginMessage').style.display = 'none';
}
function clearInputs() {
  ['registerUsername', 'registerPassword', 'loginUsername', 'loginPassword'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

// localStorage helper functions
function getUsers() {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : {};
}
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// Show message helper
function showMessage(id, msg, success = false) {
  const el = document.getElementById(id);
  el.style.display = 'block';
  el.style.color = success ? 'green' : '#6b6b47';
  el.innerText = msg;
}

// Register function
function register() {
  clearMessages();
  const username = document.getElementById('registerUsername').value.trim();
  const password = document.getElementById('registerPassword').value;

  if (!username || !password) {
    showMessage('registerMessage', 'Please enter both username and password.');
    return;
  }

  let users = getUsers();
  if (users[username]) {
    showMessage('registerMessage', 'Username already exists. Choose another.');
    return;
  }

  // Simple password "hashing" substitute: btoa (base64) - NOTE: not secure for production
  users[username] = btoa(password);
  saveUsers(users);

  showMessage('registerMessage', 'Registration successful! You can now login.', true);
  setTimeout(() => {
    showLogin();
  }, 1500);
}

// Login function
function login() {
  clearMessages();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!username || !password) {
    showMessage('loginMessage', 'Please enter both username and password.');
    return;
  }

  const users = getUsers();
  if (!users[username]) {
    showMessage('loginMessage', 'User does not exist.');
    return;
  }

  if (atob(users[username]) === password) {
    localStorage.setItem('loggedInUser', username);
    showSecured(username);
  } else {
    showMessage('loginMessage', 'Incorrect password.');
  }
}

// Logout function
function logout() {
  localStorage.removeItem('loggedInUser');
  showLogin();
}

// Attach event listeners after DOM loads
window.onload = () => {
  document.getElementById('registerBtn').addEventListener('click', register);
  document.getElementById('loginBtn').addEventListener('click', login);
  document.getElementById('logoutBtn').addEventListener('click', logout);

  document.getElementById('toLoginLink').addEventListener('click', e => {
    e.preventDefault();
    showLogin();
  });
  document.getElementById('toRegisterLink').addEventListener('click', e => {
    e.preventDefault();
    showRegister();
  });

  const loggedInUser = localStorage.getItem('loggedInUser');
  if (loggedInUser) {
    showSecured(loggedInUser);
  } else {
    showLogin();
  }
};
