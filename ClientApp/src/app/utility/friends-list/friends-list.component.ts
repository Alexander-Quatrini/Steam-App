import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { GameListService } from 'src/app/services/game-list-service.service';
import { PersonaService } from 'src/app/services/persona.service';
import { Constants } from 'src/app/util/constants.util';
import { IFriend } from 'src/models/IFriend.model';
import { IGameList, IGetGameListResponse } from 'src/models/IGameList.model';
import { IGetUserInfoResponse, IUserInfo } from 'src/models/IUserInfo.model';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css'],
  providers:[]
})
export class FriendsListComponent implements OnInit {

  @Input()
  steamID: string = "";

  @Input()
  sessionID: string = "";

  @Input()
  maxFriendsToShow: number = 12;

  API_PORT = Constants.apiPort;
  API_URL = Constants.apiUrl;

  friendList: IFriend[] = [];
  friendListInfo: IUserInfo[] = [];

  constructor(private http: HttpClient, private listService: GameListService, private personaService: PersonaService) { }

  ngOnInit(): void {

    var id = this.steamID.substring(this.steamID.lastIndexOf('/') + 1);

    this.http.post<IFriendListResponse>(this.API_URL+":"+this.API_PORT+"/api/steam/getfriendlist", {ID: id, SessionID: this.sessionID}).toPromise().then(data =>
    {
      this.friendList = data.friendslist.friends.slice(0, this.maxFriendsToShow);
      
    }).then(data=>
      
      {
        this.http.post<IGetUserInfoResponse>(this.API_URL+":"+this.API_PORT+"/api/steam/getuserinfo", {ID: id, SessionID: this.sessionID, AdditionalIDs: this.friendList.map(x =>{
          return x.steamid;
        })}).toPromise().then(data =>
      {
        this.friendListInfo = data.response.players;
      })
    })
  }

  addFriendToGameList(friendID?: string, name?: string): void {
    
    var id = this.steamID.substring(this.steamID.lastIndexOf('/') + 1);
    var gameList: IGameList = {};

    this.http.post<IGetGameListResponse>(this.API_URL+":"+this.API_PORT+"/api/steam/getgamelist", {ID: id, SessionID: this.sessionID, gameListID: friendID})
    .toPromise().then(data => {
      gameList.game_count = data.response.game_count;
      gameList.games = data.response.games;
      gameList.games?.map(entry => {entry.owner = friendID; entry.playtime_forever = Math.trunc((entry.playtime_forever ?? 0) / 60 * 10) / 10});

      this.personaService.getSteamUserFromID(friendID ?? "", this.sessionID, id).then(x => {
        this.listService.addUser(x, gameList);
      }).catch(err => console.log(err));
    });
  }

}

interface IFriendListResponse{
  friendslist: {
    friends: IFriend[];
  }
}
