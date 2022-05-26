import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../util/constants.util';
import { getCookie } from '../util/cookie.util';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  apiPort = Constants.apiPort;
  apiUrl = Constants.apiUrl;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    var steamID = getCookie(Constants.steamCookieName);
    var sessionID = getCookie(Constants.sessionIdName);
    console.log(steamID + " " + sessionID);

    this.http.post(this.apiUrl + ":" + this.apiPort + "/api/authentication/signout", {ID: steamID, sessionID: sessionID})
    .toPromise().then(resp=> window.location.href = "/");

    document.cookie = Constants.steamCookieName+"=;expires=" + new Date(0).toUTCString();
    document.cookie = Constants.sessionIdName+"=;expires=" + new Date(0).toUTCString();

  }

}
