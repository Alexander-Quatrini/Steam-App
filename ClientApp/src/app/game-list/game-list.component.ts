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
  noGameList: boolean = false;
  gamesPerPage: number = 15;
  currentPage: number = 1;
  currentGameList: IGameList = {};
  loading: boolean = true;
  appIDString: string = "App ID";
  gameNameString: string = "Game Title";
  playtimeString: string = "Hours Played";
  previousKey: string = "";
  descendingToggle: boolean = false;
  currentUsers: IUserInfo[] = [];
  math = Math;
  filter: boolean = false;
  linkArray: number[] = [];
  gameListActive: boolean = false;

  constructor(private pagination: PaginationService, private listService: GameListService, private steamService: SteamService) {}

  ngOnInit(): void {
    var n = this.steamID.lastIndexOf('/');
    var IDSub = this.steamID.substring(n + 1);
    this.steamService.getGameListFromID(IDSub).then(data => {
   
      this.gameListObject = data;
      this.gameListActive = true;
      this.steamService.getSteamUserFromID(IDSub).then(x => {
        this.listService.init(x, this.gameListObject);

        this.getPageOfItems(this.currentPage).then(data => {
          this.sortList(Constants.APP_ID_KEY, false);
          this.currentGameList = data;
          this.loading = false;
        });
      });

      this.pagination.update(5, this.gamesPerPage, this.gameListObject.game_count ?? 0);
      this.numberOfPages = this.pagination.getNumberPages();
    }).catch(error => {
      console.log(error);
      this.noGameList = true;
    });

    this.listService.getUserList().subscribe((y => {
        this.currentUsers = y.map(z => {return z;});
        console.log(this.currentUsers);        
      }
    ));

    this.listService.getGameList().subscribe(gameList => {
      this.loading = true;
      this.gameListObject = gameList; 
      this.pagination.update(5, this.gamesPerPage, this.gameListObject.game_count ?? 0);
      this.numberOfPages = this.pagination.getNumberPages();
      this.getPageOfItems(this.currentPage).then(data => {
        this.currentGameList = data;
        this.loading = false;
      });
    });
  }

  redirectToStorePage(appid: string | undefined)
  {
    if(typeof appid == undefined){
      window.alert("Store page could not be found.");
    }
    window.open("https://store.steampowered.com/app/" + appid, "_blank");
  }

  sortList(key: string, descending: boolean): void{

    this.appIDString = "App ID";
    this.gameNameString = "Game Title";
    this.playtimeString = "Hours Played";

    if(this.previousKey == key){                  //TODO: Find better implementation, too confusing.
      descending = !this.descendingToggle;
      this.descendingToggle = !this.descendingToggle;
    }
    else
      descending = false;
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
          this.getPageOfItems(this.currentPage).then(data => {
            this.currentGameList = data;
          });
        }
        break;
      case Constants.GAME_NAME_KEY:
        if(!Object.is(this.gameListObject, {})){
          this.gameNameString = "Game Title \u25B2";
          this.gameListObject.games?.sort((a,b) => 
          {
            let first = a.name ?? "";
            let second = b.name ?? "";
            
            return first.localeCompare(second);
          });
          
          if(descending){
            this.gameListObject.games?.reverse();
            this.gameNameString = "Game Title \u25BC";
          }
          this.getPageOfItems(this.currentPage).then(data => {
            this.currentGameList = data;
          });
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
          this.getPageOfItems(this.currentPage).then(data => {
            this.currentGameList = data;
          });
        }

        break;

      default:
        break;
    }

    this.previousKey = key;
  }

  changePage(pageNumber: number): void{
    this.getPageOfItems(pageNumber).then(data => {
      this.currentGameList = data;
    })
  }

  getPageOfItems(pageNumber: number): Promise<IGameList>{
    return new Promise((resolve, reject) =>{
      if(this.gameListObject.games != undefined){
        var length = this.pagination.getTotalItems();
        var items = pageNumber * 15 - 1 >= length ? 
        this.gameListObject.games.slice((pageNumber - 1) * 15) : 
        this.gameListObject.games.slice((pageNumber - 1) * 15, pageNumber * 15);

        this.linkArray = this.pagination.updateLinkArray(pageNumber);

        resolve({game_count: length, games: items});
        }else{
          reject("Game list is undefined.");
        }
    })
  }
}