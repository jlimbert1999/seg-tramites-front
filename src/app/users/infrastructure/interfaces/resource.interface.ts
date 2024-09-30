export interface resource {
  value: string;
  label: string;
  actions: action[];
  isSelected?: boolean;
}
export interface action {
  value: string;
  label: string;
  isSelected?: boolean;
}
