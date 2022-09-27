import { Injectable } from '@angular/core';
import { IUserInfo } from 'src/models/IUserInfo.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { IGameList } from 'src/models/IGameList.model';
import { IGame } from 'src/models/IGame.model';

@Injectable({
  providedIn: 'root'
})
export class GameListService {

  private users: BehaviorSubject<IUserInfo[]>;
  private gameList: BehaviorSubject<IGameList>;
  private fullGameList: IGameList;
  private map: BehaviorSubject<Map<string,string>>;

  constructor() { 
    this.users = new BehaviorSubject<IUserInfo[]>([]);
    this.gameList = new BehaviorSubject<IGameList>({});
    this.map = new BehaviorSubject<Map<string,string>>(new Map<string, string>());
    this.fullGameList = {};
    this.fullGameList.game_count = 0;
    this.fullGameList.games = [];
  }

  init(steamuser: IUserInfo, list: IGameList): void{
    if(this.users.value.length == 0){
      this.users.value.push(steamuser as IUserInfo);
      this.users.next(this.users.value);  
    }
    this.gameList.value.games = list.games;
    this.fullGameList = {game_count: list.games?.length, games: list.games};

  }

  addUser(steamuser: IUserInfo, list: IGameList): void{
    if(this.users.value.find(x => {return x.steamid == steamuser.steamid;}) == undefined){
      this.users.value.push(steamuser);
      this.users.next(this.users.value);  
    }

    this.fullGameList.games = this.fullGameList.games?.concat(list.games ?? []);

    //https://stackoverflow.com/questions/33850412/merge-javascript-objects-in-array-with-same-key
    let updatedList: IGame[] = [];
    this.fullGameList.games?.forEach(originalGame =>{

      var existing = updatedList.filter((value) => {
        return originalGame.appid == value.appid;
      });

      if(existing.length){
        var existingIndex = updatedList.indexOf(existing[0]);
        updatedList[existingIndex].owner += ", " + originalGame.owner;
      } else{
        updatedList.push(originalGame);
        
      }
    });

    this.gameList.next(
      {
        game_count: updatedList.length,
        games:updatedList,
      })
    
    this.filterList();

  }

  removeUser(steamuser: IUserInfo): void{
    let index = this.users.value.findIndex(x => {return x.steamid == steamuser.steamid});
    if(index > -1){
      this.users.next(this.users.value.splice(index, 1));
    }
  }

  filterList(): void{

    let tempMap = new Map<string,string>();

    this.fullGameList.games?.forEach(entry => {

      if(typeof entry.name === 'string'){
        if(!tempMap.has(entry.name)){
          tempMap.set(entry.name, entry.owner ?? "null");
        } else{
          let prevValue = tempMap.get(entry.name) ?? "";
          tempMap.set(entry.name, prevValue + ", " + entry.owner);
        }
      }

      tempMap.forEach((value, key) => {
        if(value.split(',').length != this.users.value.length)
        {
          tempMap.delete(key);
        }
      })
    })

    this.map.next(tempMap);
  }

  getUserList(): Observable<IUserInfo[]>{
    return this.users.asObservable();
  }

  getGameList(): Observable<IGameList>{
    return this.gameList.asObservable();
  }

  getFilteredGameList(): Observable<Map<string,string>>{
    return this.map.asObservable();
  }
}
