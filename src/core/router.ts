export class Router {
  private _routes = [
    {
      path: /element\/(?<atomicNumber>[\d]+)/,
      component: 'app-element-page',
    },
    {
      path: /$/,
      component: 'app-home-page',
    },
  ];

  private constructor() {
    window.addEventListener('popstate', (event) => {
      setTimeout(() => {
        this.matchRoute();
      });
    });
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.matchRoute(true);
      });
    })
  }

  navigateTo(route: any[]) {
    history.pushState(null, '', `#${route.map((path) => encodeURI(String(path))).join('/')}`);
    this.matchRoute();
  }

  private matchRoute(skipTransition?: boolean) {
    const paths = (location.hash ?? '#').slice(1);
    const foundRoute = this._routes.find((route) => route.path.test(paths));
    if (foundRoute) {
      const data = foundRoute.path.exec(paths);
      const innerHTML = [
        `<${foundRoute.component}`,
        Object.entries(data?.groups ?? {}).map(([key, value]) => `${ key }="${ value }"`),
        `></${foundRoute.component}>`
      ].join('\n');
      if (!(document as any).startViewTransition || skipTransition) {
        this.updateBody(innerHTML);
      } else {
        (document as any).startViewTransition(async () => {
          this.updateBody(innerHTML);
          await new Promise(r => setTimeout(r, 0));
        })
      }
    } else {
      throw new Error(`No routing found for ${paths}`);
    }
  }

  private updateBody(innerHTML: string) {
    const body = document.querySelector('body')!;
    body.innerHTML = innerHTML;
  }

  private static singleton: Router;
  static getRouter() {
    if (this.singleton == null) this.singleton = new Router();
    return this.singleton;
  }
}
