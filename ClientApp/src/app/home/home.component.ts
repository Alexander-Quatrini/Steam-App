import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IUserInfo } from 'src/models/IUserInfo.model';
import { SteamService } from '../services/steam.service';
import { Constants } from '../util/constants.util';
import { getCookie } from '../util/cookie.util';
import { handleError } from '../util/errorHandle.util';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  apiPort = Constants.apiPort;
  apiUrl = Constants.apiUrl;
  steamID: string = "";
  sessionID: string = "";
  loggedIn: boolean = false;
  steamCookieName: string = Constants.steamCookieName;
  sessionIDCookieName: string = Constants.sessionIdName;
  currentSteamUser: IUserInfo = {steamid: ""};
  loadingError: boolean = false;
  loading: boolean = false;
  filter: boolean = false;

  constructor (private steamService: SteamService)
  {};

  ngOnInit(): void {
    if(!this.loggedIn){
      this.checkForSteamLogon();
    }
  }

  checkForSteamLogon(){

      this.steamID = getCookie(this.steamCookieName);
    
      if(this.steamID != ""){
        console.log("Logged in as: " + this.steamID);
        
        var n = this.steamID.lastIndexOf('/');
        var IDSub = this.steamID.substring(n + 1);
          this.sessionID = getCookie(this.sessionIDCookieName);
          this.loading = true;
          this.loggedIn = true;
          this.steamService.init(IDSub, this.sessionID);
          this.steamService.getSteamUserFromID(IDSub).then(content =>{
            this.currentSteamUser = content;
          }).catch((error: HttpErrorResponse) => {
            this.loggedIn = false;
            handleError(error);
          }).finally(() => {
            this.loading = false;
          })     
      }else{
        this.loggedIn = false;
      }
  }

}
