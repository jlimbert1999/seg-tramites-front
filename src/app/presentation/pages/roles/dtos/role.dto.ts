import { systemResource } from '../interfaces';

interface permission {
  resource: string;
  actions: string[];
}

export class RoleDto {
  static toModel(name: string, systemResources: systemResource[]): RoleDto {
    const permissions: permission[] = systemResources
      .filter((resource) => resource.actions.some((action) => action.isSelected))
      .map((resource) => ({
        resource: resource.value,
        actions: resource.actions.filter((actions) => actions.isSelected).map((action) => action.value),
      }));
    return new RoleDto(name, permissions);
  }

  constructor(public name: string, public permissions: permission[]) {}
}
