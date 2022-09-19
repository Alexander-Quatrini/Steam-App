import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { IGameList } from 'src/models/IGameList.model';
import { Constants } from '../util/constants.util';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
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

  currentGameList: IGameList = {};

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    var n = this.steamID.lastIndexOf('/');
    var IDSub = this.steamID.substring(n + 1);
    this.http.post<IGetGameListResponse>(this.API_URL+":"+this.API_PORT+"/api/steam/getgamelist", {steamID: IDSub, sessionID: this.sessionID}).toPromise().then(data => {
      this.gameListObject = data.response;
      console.log(this.gameListObject);
      this.numberOfPages =  this.gameListObject.game_count == undefined ? 0 : Math.trunc(this.gameListObject.game_count / this.gamesPerPage) + 1;
      this.currentGameList = this.getPageOfItems(1);
    }).catch(error => {
      console.log(error);
      this.noGameList = true;
    });
  }

  getPageOfItems(pageNumber: number): IGameList{
    if(this.gameListObject.games != undefined){

    var length = this.gameListObject.games.length;
    var items = pageNumber * 15 - 1 >= length ? 
    this.gameListObject.games.slice((pageNumber - 1) * 15) : 
    this.gameListObject.games.slice((pageNumber - 1) * 15, pageNumber * 15 - 1);

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