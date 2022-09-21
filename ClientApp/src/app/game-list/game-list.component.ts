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

  linkArray: number[] = [];
  constructor(private http: HttpClient, private pagination: PaginationService) {
   }

  ngOnInit(): void {
    var n = this.steamID.lastIndexOf('/');
    var IDSub = this.steamID.substring(n + 1);
    this.http.post<IGetGameListResponse>(this.API_URL+":"+this.API_PORT+"/api/steam/getgamelist", {steamID: IDSub, sessionID: this.sessionID}).toPromise().then(data => {
      this.gameListObject = data.response;
      console.log(this.gameListObject);

      this.pagination.init(5, this.gamesPerPage, this.gameListObject.game_count ?? 0);
      this.numberOfPages = this.pagination.getNumberPages();
      this.currentGameList = this.getPageOfItems(this.currentPage);
    }).catch(error => {
      console.log(error);
      this.noGameList = true;
    });
  }

  getPageOfItems(pageNumber: number): IGameList{
    if(this.gameListObject.games != undefined){

    var length = this.pagination.getTotalItems();
    var items = pageNumber * 15 - 1 >= length ? 
    this.gameListObject.games.slice((pageNumber - 1) * 15) : 
    this.gameListObject.games.slice((pageNumber - 1) * 15, pageNumber * 15);

    const editedItems = items.map(data => ({ ...data, playtime_forever: Math.trunc((data.playtime_forever ?? 0) / 60 * 10) / 10 }));

    this.linkArray = this.pagination.updateLinkArray(pageNumber);

    return {game_count: length, games: editedItems};
    }

    else{
      return {};
    }
  }

}

interface IGetGameListResponse{
  response: IGameList;
}