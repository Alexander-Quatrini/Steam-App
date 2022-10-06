import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUserInfo } from 'src/models/IUserInfo.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private everyone: BehaviorSubject<IUserInfo[]>;

  constructor() {
    this.everyone = new BehaviorSubject<IUserInfo[]>([]);
   }

   setEveryone(next: IUserInfo[]): void{
    this.everyone.next(next);
   }

   getFilters(): Observable<IUserInfo[]>{
    return this.everyone.asObservable();
   }
}
