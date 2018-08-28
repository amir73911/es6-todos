class Auth {
  constructor() {
    this.elements = {
      $userBlock: document.querySelector('.user'),
      $userName: document.querySelector('.user__name'),
      $userIcon: document.querySelector('.user__icon'),
      $usersBtn: document.querySelector('.users-link'),
      $loginBtn: document.querySelector('.user-login'),
      $logoutBtn: document.querySelector('.user-logout'),
      $todoList: todoList,
      $form: document.forms.addTodo,
      $showFormBtn: document.querySelector('.show-form-btn'),
    };

    this.anotherUser = false;

    this.authorized = false;

    this.appId = '1289797177817715';
    this.userId = null;

    window.onload = this.init();
  }

  init() {
    window.fbAsyncInit = () => {
      FB.init({
        appId      : this.appId,
        cookie     : true,
        xfbml      : true,
        version    : 'v3.1'
      });
      FB.AppEvents.logPageView();
    };

    setTimeout(() => {
      FB.getLoginStatus((response) => {
        if (response.status === 'connected') {
          this.authorized = true;
          this.getUserData();
        } else {
          this.onLogout();
        }
      });
    }, 500);

    app.setTitle(app.messages.UNAUTHORIZED_TITLE);
  }

  login() {
    FB.login((response) => {
      if (response.status === 'connected') {
        this.authorized = true;
        this.getUserData();
      }
    });
  }

  logout() {
    FB.logout((response) => {
      this.onLogout();
    });
  }

  getUserData() {
    this.userId = FB.getUserID();

    FB.api(`/${this.userId}/?fields=name,picture`, 'GET', {}, (response) => {
      this.onLogin({
        name: response.name,
        icon: response.picture.data.url
      });
      storage.saveUser({ userId: this.userId, name: response.name, icon: response.picture.data.url });
    });
  }

  onLogin(userData) {
    this.elements.$userBlock.style.display = 'flex';
    this.elements.$userName.textContent = userData.name;
    this.elements.$userIcon.style.backgroundImage = `url('${userData.icon}')`;
    this.elements.$usersBtn.style.display = 'block';
    this.elements.$loginBtn.style.display = 'none';
    this.elements.$logoutBtn.style.display = 'block';
    this.elements.$todoList.style.display = 'block';
    this.elements.$showFormBtn.style.display = 'block';
    app.setTitle(app.messages.DEFAULT_TITLE);

    router.go('/me');
  }

  onLogout() {
    this.elements.$userBlock.style.display = 'none';
    this.elements.$userName.textContent = '';
    this.elements.$userIcon.style.backgroundImage = '';
    this.elements.$usersBtn.style.display = 'none';
    this.elements.$loginBtn.style.display = 'block';
    this.elements.$logoutBtn.style.display = 'none';
    this.elements.$todoList.style.display = 'none';
    this.elements.$form.style.display = 'none';
    this.elements.$showFormBtn.style.display = 'none';
    app.setTitle(app.messages.UNAUTHORIZED_TITLE);

    router.go('/');
  }

};

let auth = new Auth();
