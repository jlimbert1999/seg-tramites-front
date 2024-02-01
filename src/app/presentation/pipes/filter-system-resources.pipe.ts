import { Pipe, type PipeTransform } from '@angular/core';
import { systemResource } from '../../infraestructure/interfaces';

@Pipe({
  name: 'appFilterSystemResources',
  standalone: true,
})
export class FilterSystemResourcesPipe implements PipeTransform {
  transform(systemResources: systemResource[], term: string): systemResource[] {
    if (term === '') return systemResources;
    return systemResources.filter(
      (resource) =>
        resource.label.toLowerCase().indexOf(term.toLowerCase()) > -1
    );
  }
}
