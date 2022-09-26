import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Constants } from 'src/app/util/constants.util';
import { IFriend } from 'src/models/IFriend.model';

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
  maxFriendsToShow: number = 10;

  API_PORT = Constants.apiPort;
  API_URL = Constants.apiUrl;

  friendList: IFriend[] = [];


  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    var id = this.steamID.substring(this.steamID.lastIndexOf('/') + 1);

    this.http.post<IFriendListResponse>(this.API_URL+":"+this.API_PORT+"/api/steam/getfriendlist", {ID: id, SessionID: this.sessionID}).toPromise().then(data =>
    {
      this.friendList = data.friendslist.friends.slice(0, this.maxFriendsToShow - 1);
    });
  }

}

interface IFriendListResponse{
  friendslist: {
    friends: IFriend[];
  }
}
