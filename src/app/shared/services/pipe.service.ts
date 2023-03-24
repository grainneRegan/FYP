import { Injectable } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
@Injectable({
  providedIn: 'root'
})
export class PipeService implements PipeTransform{

  constructor() { }

  transform(value: any[], args: string[]): any[] {
      const sortField = args[0];
      const sortOrder = args[1];

      const sorted = value.sort((b: any, a: any) => {
        if (a[sortField] > b[sortField]) {
          return sortOrder === 'asc' ? 1 : -1;
        } else if (a[sortField] < b[sortField]) {
          return sortOrder === 'asc' ? -1 : 1;
        } else {
          return 0;
        }
      });

      return sorted;
    }
}
