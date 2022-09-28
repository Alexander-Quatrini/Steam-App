import { Component, OnInit, Input } from '@angular/core';
import { GameListService } from 'src/app/services/game-list-service.service';
import { SteamService } from 'src/app/services/steam.service';
import { Constants } from 'src/app/util/constants.util';
import { IFriend } from 'src/models/IFriend.model';
import { IGameList } from 'src/models/IGameList.model';
import { IUserInfo } from 'src/models/IUserInfo.model';

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

  constructor(private listService: GameListService, private steamService: SteamService) { }

  ngOnInit(): void {

    var id = this.steamID.substring(this.steamID.lastIndexOf('/') + 1);

    this.steamService.getFriendsListFromID(id).then(data =>
    {
      this.friendList = data.slice(0, this.maxFriendsToShow);
      
    }).then(() => {
        this.steamService.getSteamUsersFromIDs(this.friendList.map(x => {return x.steamid ?? ""})).then(data =>
      {
        this.friendListInfo = data;
      })
    });
  }

  addFriendToGameList(friendID: string, name?: string): void {
    
    var gameList: IGameList = {};

    this.steamService.getGameListFromID(friendID).then(data => {
      gameList = data;
      
      this.steamService.getSteamUserFromID(friendID ?? "").then(data => {
        this.listService.addUser(data, gameList);
      }).catch(err => console.log(err));
    });
  }

}
