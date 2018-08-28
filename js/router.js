class Router {
  constructor() {
    this.hash = null;

    if (typeof(auth) !== 'undefined' && auth.authorized) {
      if (window.location.hash !== '') this.setRoute();
    } else {
      this.go('/');
    }

    window.onhashchange = () => {
      this.setRoute();
    }
  }

  go(to) {
    to = (to.charAt(0) === '/' || to.charAt(0) === '#') ? to.slice(1) : to;
    window.location.hash = `#${to}`;
  }

  setRoute() {
    this.setHash();
    this.routeWork();
  }

  setHash() {
    this.hash = window.location.hash;
  }

  parseHash() {
    let hash = window.location.hash.slice(1);
    let splitedHash = hash.split('/');

    return { page: splitedHash[0], param: splitedHash[1] };
  }

  showPage(page) {
    let $page = document.getElementById(`${page}Page`);
    let $pages = document.querySelectorAll('.page');

    $pages.forEach(($item) => {
      $item.style.display = 'none';
    });
    $page.style.display = 'block';
  }

  routeWork() {
    let { page, param } = this.parseHash();

    switch (page) {
      case 'user':
        todos.init(param);
        if (param !== auth.userId) {
          auth.anotherUser = true;
        } else {
          auth.anotherUser = false;
        }
        this.showPage('todos');
        break;
      case 'users':
        this.showPage('users');
        users.render();
        break;
      case 'me':
        todos.init();
        this.showPage('todos');
        break;
      default:
        this.showPage('todos');
        break;
    }
  }
};

let router = new Router();
