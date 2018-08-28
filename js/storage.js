class Storage {
  getTodos(userId) {
    let todos = (window.localStorage.getItem(`todos_${userId}`)) ? JSON.parse(window.localStorage.getItem(`todos_${userId}`)) : [];

    return todos;
  }

  saveTodos(array) {
    let userId = auth.userId;

    window.localStorage.setItem(`todos_${userId}`, JSON.stringify(array));
  }

  getUsers() {
    return (window.localStorage.getItem('users')) ? JSON.parse(window.localStorage.getItem('users')) : [];
  }

  saveUser(userData) {
    let users = (window.localStorage.getItem('users')) ? JSON.parse(window.localStorage.getItem('users')) : [];

    for (let user of users) {
      if (user.userId === userData.userId) {
        return false;
      }
    }

    users.push(userData);
    window.localStorage.setItem('users', JSON.stringify(users));
  }
};

let storage = new Storage();
