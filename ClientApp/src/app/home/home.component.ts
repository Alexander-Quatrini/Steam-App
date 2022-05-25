import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
  loggedIn: boolean = false;
  steamCookieName: string = Constants.steamCookieName;
  sessionIDCookieName: string = Constants.sessionIdName;
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
        this.loggedIn = true;
        console.log("Logged in as: " + this.steamID);
        
        var n = this.steamID.lastIndexOf('/');
        var IDSub = this.steamID.substring(n + 1);
        this.ValidateSession(this.steamCookieName, this.sessionIDCookieName);
        this.http.post(this.apiUrl + ":" + this.apiPort + "/api/steam/getuserinfo", {ID: IDSub}).toPromise().catch(err => {
          console.log(err);
        })
      } else{
        this.loggedIn = false;
      }
  }

  ValidateSession(idCookieName: string, sessionIDCookieName: string){

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    this.http.post(this.apiUrl + ":" + this.apiPort + "/api/authentication/sessionvalid/", 
    {ID: getCookie(idCookieName), sessionID: getCookie(sessionIDCookieName)}, 
    httpOptions).toPromise().catch(err => {
      if(err.status === 401)
      {
        this.loggedIn = false;
        window.location.href = this.apiUrl + ":" + this.apiPort + "/api/authentication/signin";
      }
    });
  }
}
