import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { IGameList } from 'src/models/IGameList.model';
import { IUserInfo } from 'src/models/IUserInfo.model';
import { GameListService } from '../services/game-list-service.service';
import { PaginationService } from '../services/pagination.service';
import { SteamService } from '../services/steam.service';
import { Constants } from '../util/constants.util';

import { FilterService } from '../services/filter.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css'],
  providers: 
  [
    PaginationService
  ]
})
export class GameListComponent implements OnInit {

  @Input()
  steamID: string = "";

  @Input()
  sessionID: string = "";

  @Input()
  personaname: string = "";

  filtered: Observable<IUserInfo[]>;

  API_PORT = Constants.apiPort;
  API_URL = Constants.apiUrl;

  searchTerm: string = "";
  numberOfPages: number = 0;
  gameListObject: IGameList = {};
  filteredGameListObject: IGameList = {};
  unFilteredGameListObject: IGameList = {};
  noGameList: boolean = false;
  gamesPerPage: number = 15;
  currentPage: number = 1;
  currentGameList: IGameList = {games: [], game_count: 0};
  appIDString: string = "App ID";
  gameNameString: string = "Game Title";
  playtimeString: string = "Hours Played";
  previousKey: string = Constants.GAME_NAME_KEY;
  descendingToggle: boolean = true;
  currentUsers: IUserInfo[] = [];
  math = Math;
  loading: boolean = true;
  ready: boolean = false;
  filter: boolean = false;
  linkArray: number[] = [];
  gameList: Observable<IGameList>;

  constructor(private pagination: PaginationService, private listService: GameListService, private steamService: SteamService, private filters: FilterService) {
    this.gameList = this.listService.getGameList();
    this.filtered = filters.getFilters();
  }

  ngOnInit(): void {

    var n = this.steamID.lastIndexOf('/');
    var IDSub = this.steamID.substring(n + 1);
    
    this.filtered.subscribe(value => {
      if(this.ready){
        this.filter = value.length > 1;
        if(value){
          Object.assign(this.gameListObject, this.filteredGameListObject);
        } else {
          Object.assign(this.gameListObject, this.unFilteredGameListObject);
        }

        if(this.searchTerm.length > 0){
          this.search(this.searchTerm);
        }

        this.updateDisplay();
      }
    });

    this.listService.getUserList().subscribe(users => {
      console.log(users);
      this.currentUsers = users;
    });
    
    this.gameList.subscribe(gameList => {
      this.unFilteredGameListObject = gameList
      this.listService.filterList()
      .then((filteredGameList) => {
        this.filteredGameListObject.games = Array.from(filteredGameList.keys());
        this.filteredGameListObject.game_count = this.filteredGameListObject.games.length;
        if(this.filter){
          this.gameListObject = Object.assign({}, this.filteredGameListObject);
        } else {
          this.gameListObject = Object.assign({}, this.unFilteredGameListObject);
        }

        if(this.searchTerm.length > 0){
          this.search(this.searchTerm);
        }

        this.updateDisplay();
      });
    });

      this.listService.getReadyState().subscribe(ready => {
        this.ready = ready;
      })

    this.steamService.getGameListFromID(IDSub)
    .then(data => {
      this.gameListObject = data;
      return IDSub;
      }).then((id) =>{
        return this.steamService.getSteamUserFromID(id);
      })
      .then((user) => {
        this.listService.init(user, this.gameListObject);
        return;
      })
      .then(() =>{
        this.updateDisplay();
        this.ready = true;
    
      })
      .catch(reject => {
        console.log(reject);
      })
      .catch(error => {
      console.log(error);
      this.noGameList = true;
    });

     /*this.listService.getReadyState().subscribe(ready => {
       this.ready = ready;
     });*/

    // this.listService.getGameList().pipe(observeOn(queueScheduler)).subscribe

    /*this.listService.getFilteredGameList().subscribe(filteredGameList => {

        let games = Array.from(filteredGameList.keys());
        this.filteredGameListObject.games = games;
        this.filteredGameListObject.game_count = this.filteredGameListObject.games.length;
    });*/
  }

  updateFilter(event: Event){
    let eventTarget = event.target as HTMLInputElement;
    if(eventTarget){
      this.filter = eventTarget.checked;
    }

    this.filters.setEveryone(this.currentUsers);
  }

  searchEvent(event: Event): void{
        let eventTarget = event.target as HTMLInputElement;
        this.searchTerm = eventTarget.value.toLocaleLowerCase();
        this.search(this.searchTerm);
  }

  search(searchTerm: string): void{
    if(this.filter){
      Object.assign(this.gameListObject, this.filteredGameListObject);
    } else {
      Object.assign(this.gameListObject, this.unFilteredGameListObject);
    }
    
    this.gameListObject.games = this.gameListObject.games?.filter(game => 
      game.name?.toLocaleLowerCase().includes(searchTerm));

    this.gameListObject.game_count = this.gameListObject.games?.length ?? 0;
    this.updateDisplay();
  }

  redirectToStorePage(appid: string | undefined)
  {
    if(typeof appid == undefined){
      window.alert("Store page could not be found.");
    }
    window.open("https://store.steampowered.com/app/" + appid, "_blank");
  }

  sortList(key: string = this.previousKey, toggle: boolean): void{

    this.appIDString = "App ID";
    this.gameNameString = "Game Title";
    this.playtimeString = "Hours Played";
    let descending = !this.descendingToggle;
    
    if(toggle){
      if(this.previousKey == key){
        descending = this.descendingToggle;
        this.descendingToggle = !this.descendingToggle;
      }
    }
    
    switch (key) {
      case Constants.APP_ID_KEY:
        if(!Object.is(this.gameListObject, {})){
          this.appIDString = "App ID \u25B2";
          this.gameListObject.games?.sort((a,b) =>{

            let first = parseInt(a.appid ?? "0");
            let second = parseInt(b.appid ?? "0");

            if(first < second)
              return -1;

            if(first > second)
              return 1;

            return 0;
          })

          if(descending){
            this.gameListObject.games?.reverse();
            this.appIDString = "App ID \u25BC";
          }
          this.currentGameList = this.getPageOfItems(this.currentPage);
        }
        break;
      case Constants.GAME_NAME_KEY:
        if(!Object.is(this.gameListObject, {})){
          this.gameNameString = "Game Title \u25B2";
          this.gameListObject.games?.sort((a,b) => 
          {
            let first: string = a.name ?? "";
            let second: string = b.name ?? "";
            
            return first.localeCompare(second);
          });
          
          if(descending){
            this.gameListObject.games?.reverse();
            this.gameNameString = "Game Title \u25BC";
          }
          this.currentGameList = this.getPageOfItems(this.currentPage);
        }
        break;
      case Constants.PLAYTIME_KEY:
        if(!Object.is(this.gameListObject, {})){
          this.playtimeString = "Hours Played \u25B2";
          this.gameListObject.games?.sort((a,b) =>{

            let first = a.playtime_forever ?? "0";
            let second = b.playtime_forever ?? "0";

            let firstName = a.name ?? "";
            let secondName = b.name ?? "";

            if(first < second)
              return -1;

            if(first > second)
              return 1;

            return firstName.localeCompare(secondName);
          })
          
          if(descending){
            this.gameListObject.games?.reverse();
            this.playtimeString = "Hours Played \u25BC";
          }
          this.currentGameList = this.getPageOfItems(this.currentPage);
        }

        break;

      default:
        this.sortList(this.previousKey, false);
        break;
    }

    this.previousKey = key;
  }

  changePage(pageNumber: number): void{
    this.currentGameList = this.getPageOfItems(pageNumber);
  }

  updateDisplay(): void{

    this.pagination.update(5, this.gamesPerPage, this.gameListObject.game_count ?? 0);
    this.numberOfPages = this.pagination.getNumberPages();
    this.currentPage = 1;
    this.sortList(undefined, false);
  }

  toggleExpanded(appid?: string){
    let game = this.currentGameList.games?.find(x => x.appid == appid ?? undefined)
    if(game){
      game.expanded = !game.expanded;
    }
  }

  getPageOfItems(pageNumber: number): IGameList{

      if(this.gameListObject.games != undefined){
        var length = this.gameListObject.game_count ?? 0;
        var items = pageNumber * 15 - 1 >= length ? 
        this.gameListObject.games.slice((pageNumber - 1) * 15) : 
        this.gameListObject.games.slice((pageNumber - 1) * 15, pageNumber * 15);
        this.linkArray = this.pagination.updateLinkArray(pageNumber);
        items = items.map(item => {return ({...item, expanded: false})});
        return{games: items, game_count: length}
    }
    return {games: [], game_count: 0};
  }
}