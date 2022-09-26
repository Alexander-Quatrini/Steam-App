import { Injectable } from '@angular/core';
import { IUserInfo } from 'src/models/IUserInfo.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameListService {

  private users: BehaviorSubject<IUserInfo[]>;

  constructor() { 
    this.users = new BehaviorSubject<IUserInfo[]>([]);
  }

  addUser(steamuser: IUserInfo): void{
    if(this.users.value.find(x => {return x.steamid == steamuser.steamid;}) == undefined){
      this.users.value.push(steamuser);
      this.users.next(this.users.value);  
    }
  }

  removeUser(steamuser: IUserInfo): void{
    let index = this.users.value.findIndex(x => {return x.steamid == steamuser.steamid});
    if(index > -1){
      this.users.next(this.users.value.splice(index, 1));
    }
  }

  getList(): Observable<IUserInfo[]>{
    return this.users.asObservable();
  }
}
