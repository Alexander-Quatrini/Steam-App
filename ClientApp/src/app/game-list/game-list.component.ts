import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { IGameList, IGetGameListResponse } from 'src/models/IGameList.model';
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

  constructor(private http: HttpClient, private pagination: PaginationService, private listService: GameListService, private personaService: SteamService) {}

  ngOnInit(): void {
    var n = this.steamID.lastIndexOf('/');
    var IDSub = this.steamID.substring(n + 1);
    this.http.post<IGetGameListResponse>(this.API_URL+":"+this.API_PORT+"/api/steam/getgamelist", {ID: IDSub, SessionID: this.sessionID}).toPromise().then(data => {
   
      this.gameListObject = data.response;
      this.gameListObject.games?.map(entry => {entry.owner = IDSub});
      this.loading = false;
      this.personaService.getSteamUserFromID(IDSub).then(x => {
        this.listService.init(x, this.gameListObject);
        
        //TODO: problems stem from not using one singular service to make API calls. 
    });

      console.log(this.gameListObject);

      this.gameListObject.games = this.gameListObject.games?.map(data => ({ ...data, playtime_forever: Math.trunc((data.playtime_forever ?? 0) / 60 * 10) / 10 }));

      this.pagination.update(5, this.gamesPerPage, this.gameListObject.game_count ?? 0);
      this.numberOfPages = this.pagination.getNumberPages();
      this.getPageOfItems(this.currentPage).then(data => {
        this.currentGameList = data;
      });
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
      this.gameListObject = gameList; 
      this.pagination.update(5, this.gamesPerPage, this.gameListObject.game_count ?? 0);
      this.numberOfPages = this.pagination.getNumberPages();
      this.getPageOfItems(this.currentPage).then(data => {
        this.currentGameList = data;
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
      if(this.gameListObject.games != undefined && !this.loading){
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