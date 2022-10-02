import { Injectable } from '@angular/core';
import { IUserInfo } from 'src/models/IUserInfo.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { IGameList, IGame } from 'src/models/IGameList.model';

@Injectable({
  providedIn: 'root'
})
export class GameListService {

  private users: BehaviorSubject<IUserInfo[]>;
  private gameList: BehaviorSubject<IGameList>;
  private map: BehaviorSubject<Map<IGame,string[]>>;
  private updatedList: Map<string,IGame> = new Map<string,IGame>();
  constructor() { 
    this.users = new BehaviorSubject<IUserInfo[]>([]);
    this.gameList = new BehaviorSubject<IGameList>({});
    this.map = new BehaviorSubject<Map<IGame,string[]>>(new Map<IGame, string[]>());
  }

  init(steamuser: IUserInfo, list: IGameList): void{
    list.games?.map(game => {
      game.owners = [];
    })
    this.addUser(steamuser, list);
  }

  addUser(steamuser: IUserInfo, list: IGameList): void{
    if(this.users.value.includes(steamuser) == false){
      this.users.value.push(steamuser);
    
    list.games?.map(game => {
      game.owners.push({name: steamuser, playtime: game.playtime_forever ?? 0});
    })

    //this.fullGameList.games = this.fullGameList.games?.concat(list.games ?? []);

    //https://stackoverflow.com/questions/33850412/merge-javascript-objects-in-array-with-same-key 
    list.games?.forEach(originalGame =>{
      if(typeof originalGame.appid !== 'undefined'){
      let existingGame = this.updatedList.get(originalGame.appid ?? "");
      if(typeof existingGame !== 'undefined'){
          let existingOwners = existingGame.owners;
          let playtime = existingGame.playtime_forever ?? 0;
          originalGame.owners.forEach(original => {
            existingOwners.push(original);
            playtime += original.playtime;
          })
          if(existingOwners.length > 0){
            this.updatedList.set(originalGame.appid, {...existingGame, owners: existingOwners, playtime_forever: playtime});
          } else {
            this.updatedList.delete(originalGame.appid);
          }
      } else{
        this.updatedList.set(originalGame.appid, originalGame);
      }
    }
  });
    this.gameList.next(
      {
        game_count: this.updatedList.size,
        games: Array.from(this.updatedList.values()),
      })
    
    console.log(this.gameList.value);


    this.filterList();
    }
  }

  removeUser(steamuser: IUserInfo): void{
    
    let index = this.users.value.indexOf(steamuser);
    let newGames: IGame[] = [];

    if(index > -1){
      this.users.value.splice(index, 1)
      this.users.next(this.users.value);
    }
    
    newGames = this.gameList.value.games?.filter((game) => {
      let owners = game.owners.filter(owner => owner.name != steamuser);
      game.owners = owners;
      game.total_playtime = 0;
      game.owners.forEach(owner => game.total_playtime += owner.playtime);

      return (game.owners.length > 0);
    }) ?? [];

    this.updatedList.clear();
    newGames.forEach(game => {
      this.updatedList.set(game.appid ?? "null", game);
    });

    this.gameList.next(
    {
        game_count: newGames.length,
        games: newGames,
    })

  }

  filterList(): void{

    let tempMap = new Map<IGame,string[]>();

    this.gameList.value.games?.forEach(entry => {
      if(typeof entry.name === 'string' && typeof entry.owners !== 'undefined'){
        let owners = entry.owners.map(x => {return x.name.steamid;});
        tempMap.set(entry, owners);
      }

      tempMap.forEach((value, key) => {
        if(value.length != this.users.value.length)
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

  getFilteredGameList(): Observable<Map<IGame,string[]>>{
    return this.map.asObservable();
  }
}
