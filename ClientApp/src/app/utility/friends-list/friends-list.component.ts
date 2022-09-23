import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Constants } from 'src/app/util/constants.util';

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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    var id = this.steamID.substring(this.steamID.lastIndexOf('/') + 1);

    this.http.post(this.API_URL+":"+this.API_PORT+"/api/steam/getfriendlist", {ID: id, SessionID: this.sessionID}).toPromise().then(data =>
    {
      console.log(data);
    });
  }

}
