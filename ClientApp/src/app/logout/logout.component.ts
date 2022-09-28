import { Component, OnInit } from '@angular/core';
import { Constants } from '../util/constants.util';
import { getCookie } from '../util/cookie.util';
import { SteamService } from '../services/steam.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  apiPort = Constants.apiPort;
  apiUrl = Constants.apiUrl;

  constructor(private steamService: SteamService) { }

  ngOnInit(): void {
    var steamID = getCookie(Constants.steamCookieName);
    var sessionID = getCookie(Constants.sessionIdName);
    console.log(steamID + " " + sessionID);

    this.steamService.logout().finally(() => {
      window.location.href = '/';
      document.cookie = Constants.steamCookieName+"=;expires=" + new Date(0).toUTCString();
      document.cookie = Constants.sessionIdName+"=;expires=" + new Date(0).toUTCString();
    })

  }

}
