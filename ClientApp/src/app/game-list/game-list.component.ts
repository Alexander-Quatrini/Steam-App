import { Component, OnInit, Input } from '@angular/core';
import { IGameList } from 'src/models/IGameList.model';
import { IUserInfo } from 'src/models/IUserInfo.model';
import { GameListService } from '../services/game-list-service.service';
import { PaginationService } from '../services/pagination.service';
import { SteamService } from '../services/steam.service';
import { Constants } from '../util/constants.util';

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

  API_PORT = Constants.apiPort;
  API_URL = Constants.apiUrl;

  numberOfPages: number = 0;
  gameListObject: IGameList = {};
  filteredGameListObject: IGameList = {};
  unFilteredGameListObject: IGameList = {};
  noGameList: boolean = false;
  gamesPerPage: number = 15;
  currentPage: number = 1;
  currentGameList: IGameList = {games: [], game_count: 0};
  loading: boolean = true;
  appIDString: string = "App ID";
  gameNameString: string = "Game Title";
  playtimeString: string = "Hours Played";
  previousKey: string = Constants.GAME_NAME_KEY;
  descendingToggle: boolean = true;
  currentUsers: IUserInfo[] = [];
  math = Math;
  filter: boolean = false;
  linkArray: number[] = [];
  gameListActive: boolean = false;

  constructor(private pagination: PaginationService, private listService: GameListService, private steamService: SteamService) {}

  ngOnInit(): void {
    var n = this.steamID.lastIndexOf('/');
    var IDSub = this.steamID.substring(n + 1);

    this.listService.getUserList().subscribe((y => {
        this.currentUsers = y;
      }
    ));

    this.steamService.getGameListFromID(IDSub).then(data => {
      this.gameListObject = data;
      this.steamService.getSteamUserFromID(IDSub)
      .then((id) => {
        this.listService.init(id, this.gameListObject);
      })
      .then(() =>{
        this.updateGameList();
        this.gameListActive = true;
      })
      .catch(reject => {
        console.log(reject);
      });
    }).catch(error => {
      console.log(error);
      this.noGameList = true;
    });

    this.listService.getGameList().subscribe(gameList => {
        this.unFilteredGameListObject = gameList; 

        if(!this.filter && this.gameListActive){
          this.updateGameList();
        }
    });

    this.listService.getFilteredGameList().subscribe(filteredGameList => {

        let games = Array.from(filteredGameList.keys());
        this.filteredGameListObject.games = games;
        this.filteredGameListObject.game_count = this.filteredGameListObject.games.length;

        if(this.filter && this.gameListActive){
          this.updateGameList();
        }
    });

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

  updateGameList(event?: Event): void{
    this.loading = true;
    
    if(typeof event === 'object'){
      this.filter = (event.target as HTMLInputElement).checked;
    }
    if(this.filter){
      this.gameListObject = this.filteredGameListObject;
    } else {
      this.gameListObject = this.unFilteredGameListObject;
    }

    this.pagination.update(5, this.gamesPerPage, this.gameListObject.game_count ?? 0);
    this.numberOfPages = this.pagination.getNumberPages();
    this.currentPage = 1;
    this.sortList(undefined, false);
    this.loading = false;
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