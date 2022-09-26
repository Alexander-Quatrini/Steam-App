import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IUserInfo } from 'src/models/IUserInfo.model';
import { Constants } from '../util/constants.util';
import { getCookie } from '../util/cookie.util';
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
  currentSteamUser: IUserInfo = {};
  loadingError: boolean = false;
  loading: boolean = false;

  constructor (private http: HttpClient)
  {
    
  }

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
          this.http.post<IGetUserInfoResponse>(this.apiUrl + ":" + this.apiPort + "/api/steam/getuserinfo", {ID: IDSub, SessionID: this.sessionID})
          .toPromise().then(content => 
          {
            var response = content.response.players[0];
            this.currentSteamUser.personaname = response.personaname;
            this.currentSteamUser.avatarfull = response.avatarfull;
            console.log(response);
            
          })
          .catch(err => {
            this.loadingError = true;
          }).finally(()=>{
            this.loading = false;
          })      
      } else{
        this.loggedIn = false;
      }
  }
 
  handleError(error: HttpErrorResponse): void{
    if(error.status == 401){
      this.loggedIn == false;
      window.location.href = this.apiUrl + ":" + this.apiPort + "/api/authentication/signin";
    } else{
      console.log(error.message);
    }
  }

}




interface IGetUserInfoResponse{
  response: {
    players: IUserInfo[];
  }
}
