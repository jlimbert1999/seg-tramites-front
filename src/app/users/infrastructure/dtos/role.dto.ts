import { resource } from "../interfaces/resource.interface";


interface permission {
  resource: string;
  actions: string[];
}

export class RoleDto {
  static toModel(name: string, resources: resource[]): RoleDto {
    const permissions: permission[] = resources
      .filter((resource) =>
        resource.actions.some((action) => action.isSelected)
      )
      .map((resource) => ({
        resource: resource.value,
        actions: resource.actions
          .filter((actions) => actions.isSelected)
          .map((action) => action.value),
      }));
    return new RoleDto(name, permissions);
  }

  constructor(public name: string, public permissions: permission[]) {}
}
