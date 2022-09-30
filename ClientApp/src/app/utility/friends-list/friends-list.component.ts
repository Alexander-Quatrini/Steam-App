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
      return this.friendList = data.slice(0, this.maxFriendsToShow);
      
    }).then(() => {
        this.steamService.getSteamUsersFromIDs(this.friendList.map(x => {return x.steamid ?? ""})).then(data =>
      {
        this.friendListInfo = data;
      })
    });
  }

  addFriendToGameList(friend: IUserInfo): void {
    
    var gameList: IGameList = {};
    

    this.steamService.getGameListFromID(friend.steamid).then(data => {
      gameList = data;
      gameList.games?.map(x => {
        x.owners = [];
      })
      this.listService.addUser(friend, gameList);
    });
  }

}
