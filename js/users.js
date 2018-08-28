class Users {
  constructor() {
    this.elements = {
      $userList: usersList
    };
    this.list = storage.getUsers();
  }

  get() {
    this.list = storage.getUsers();
    return this.list;
  }

  render() {
    this.elements.$userList.innerHTML = '';

    for (let user of this.list) {
      let li = document.createElement('li');
      li.innerHTML = `
        <div class="users-list__item" onclick="router.go('/user/${user.userId}')">
          <div class="user">
            <div class="user__icon" style="background-image: url('${user.icon}')"></div>
            <div class="user__name">${user.name}</div>
          </div>
        </div>
      `;
      this.elements.$userList.appendChild(li);
    }
  }
}

let users = new Users();
