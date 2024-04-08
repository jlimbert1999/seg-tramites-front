export interface menu {
  icon: string;
  resource: string;
  routerLink: string;
  text: string;
  childred?: submenu[];
}

export interface submenu {
  icon: string;
  resource: string;
  routerLink: string;
  text: string;
}
