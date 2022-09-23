import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { IGameList } from 'src/models/IGameList.model';
import { PaginationService } from '../services/pagination.service';
import { Constants } from '../util/constants.util';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css'],
  providers: 
  [
    PaginationService,
  ]
})
export class GameListComponent implements OnInit {

  @Input()
  steamID: string = "";

  @Input()
  sessionID: string = "";

  @Input()
  personaName?: string = "";

  API_PORT = Constants.apiPort;
  API_URL = Constants.apiUrl;

  numberOfPages: number = 0;
  gameListObject: IGameList = {};
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

  linkArray: number[] = [];
  constructor(private http: HttpClient, private pagination: PaginationService) {
   }

  ngOnInit(): void {
    var n = this.steamID.lastIndexOf('/');
    var IDSub = this.steamID.substring(n + 1);
    this.http.post<IGetGameListResponse>(this.API_URL+":"+this.API_PORT+"/api/steam/getgamelist", {steamID: IDSub, sessionID: this.sessionID}).toPromise().then(data => {
      this.loading = false;
      this.gameListObject = data.response;
      console.log(this.gameListObject);

      this.gameListObject.games = this.gameListObject.games?.map(data => ({ ...data, playtime_forever: Math.trunc((data.playtime_forever ?? 0) / 60 * 10) / 10 }));

      this.pagination.init(5, this.gamesPerPage, this.gameListObject.game_count ?? 0);
      this.numberOfPages = this.pagination.getNumberPages();
      this.currentGameList = this.getPageOfItems(this.currentPage);
    }).catch(error => {
      console.log(error);
      this.noGameList = true;
    });
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
            this.appIDString = "App ID \u25BE";
          }
          this.currentGameList = this.getPageOfItems(this.currentPage);
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
            this.gameNameString = "Game Title \u25BE";
          }
          this.currentGameList = this.getPageOfItems(this.currentPage);
        }
        break;
      case Constants.PLAYTIME_KEY:
        if(!Object.is(this.gameListObject, {})){
          this.playtimeString = "Hours Played \u25B2";
          this.gameListObject.games?.sort((a,b) =>{

            let first = a.playtime_forever ?? "0"
            let second = b.playtime_forever ?? "0"

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
            this.playtimeString = "Hours Played \u25BE";
          }
          this.currentGameList = this.getPageOfItems(this.currentPage);
        }

        break;

      default:
        break;
    }

    this.previousKey = key;
  }

  getPageOfItems(pageNumber: number): IGameList{
    if(this.gameListObject.games != undefined){

    var length = this.pagination.getTotalItems();
    var items = pageNumber * 15 - 1 >= length ? 
    this.gameListObject.games.slice((pageNumber - 1) * 15) : 
    this.gameListObject.games.slice((pageNumber - 1) * 15, pageNumber * 15);

    

    this.linkArray = this.pagination.updateLinkArray(pageNumber);

    return {game_count: length, games: items};
    }

    else{
      return {};
    }
  }

}

interface IGetGameListResponse{
  response: IGameList;
}