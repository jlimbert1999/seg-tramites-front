export interface menu {
  icon: string;
  resource: string;
  routerLink: string;
  text: string;
  childred?: submenu[];
  actions?: string[];
}

export interface submenu {
  icon: string;
  resource: string;
  routerLink: string;
  text: string;
  actions: string[];
}
