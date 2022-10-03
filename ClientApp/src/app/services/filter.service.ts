import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private everyone: BehaviorSubject<boolean>;

  constructor() {
    this.everyone = new BehaviorSubject<boolean>(false);
   }

   setEveryone(next: boolean): void{
    this.everyone.next(next);
   }

   getFilters(): Observable<boolean>{
    return this.everyone.asObservable();
   }
}
