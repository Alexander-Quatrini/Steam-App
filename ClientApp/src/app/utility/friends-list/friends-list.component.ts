import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Constants } from 'src/app/util/constants.util';
import { IFriend } from 'src/models/IFriend.model';
import { IGetUserInfoResponse, IUserInfo } from 'src/models/IUserInfo.model';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
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

  constructor(private http: HttpClient) { }

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

}

interface IFriendListResponse{
  friendslist: {
    friends: IFriend[];
  }
}
