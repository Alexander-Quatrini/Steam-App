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


  paginationLinks: number = 5;
  numberOfPages: number = 0;
  gameListObject: IGameList = {};
  noGameList: boolean = false;
  gamesPerPage: number = 15;
  currentPage: number = 1;
  currentGameList: IGameList = {};

  linkArray: number[] = [];
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    var n = this.steamID.lastIndexOf('/');
    var IDSub = this.steamID.substring(n + 1);
    this.http.post<IGetGameListResponse>(this.API_URL+":"+this.API_PORT+"/api/steam/getgamelist", {steamID: IDSub, sessionID: this.sessionID}).toPromise().then(data => {
      this.gameListObject = data.response;
      console.log(this.gameListObject);
      this.numberOfPages = this.gameListObject.game_count == undefined ? 0 : Math.trunc(this.gameListObject.game_count / this.gamesPerPage) + 1;

      this.linkArray = [].constructor(this.numberOfPages <= this.paginationLinks ? this.numberOfPages : this.paginationLinks);

      this.currentGameList = this.getPageOfItems(this.currentPage);
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
    this.gameListObject.games.slice((pageNumber - 1) * 15, pageNumber * 15);

    const editedItems = items.map(data => ({ ...data, playtime_forever: Math.trunc((data.playtime_forever ?? 0) / 60 * 10) / 10 }));

    console.log(editedItems);

    if(this.numberOfPages <= this.paginationLinks){
      this.linkArray = [...Array(this.linkArray.length).keys()].map(x => ++x);
    }
    else{
      let half = Math.trunc(this.paginationLinks/2);

      let currentIndex = 0;
      for(let i = -half; currentIndex < this.linkArray.length; i++)
      {
      
        console.log(i);
        let numberForIndex = pageNumber + i;
        if( numberForIndex <= 0)
        {
          numberForIndex = this.linkArray.length + i + 1;
        } else

        if( numberForIndex > this.numberOfPages){
          numberForIndex = i - this.linkArray.length;
        }

        this.linkArray[currentIndex] = numberForIndex;
        currentIndex++;
      }

      this.linkArray.sort((a: number,b: number) => {
        if(a < b)
          return -1;
        if(a > b)
          return 1;
        return 0;
      });
    }
    console.log(this.linkArray);

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