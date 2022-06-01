import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
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

  API_PORT = Constants.apiPort;
  API_URL = Constants.apiUrl;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.post(this.API_URL+":"+this.API_PORT+"/api/steam/getgamelist", {steamID: this.steamID, sessionID: this.sessionID}).toPromise().then(data => console.log(data));
  }

}
