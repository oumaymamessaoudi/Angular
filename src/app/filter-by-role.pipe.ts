import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByRole'
})
export class FilterByRolePipe implements PipeTransform {

  transform(users: any[], role: string): any[] {
    if (!users || !role) {
      return users;
    }
    
    return users.filter(user => user.role === role);
  }

}
