import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getCookie } from '../util/cookie.util';
import { Constants } from '../util/constants.util';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  apiPort = Constants.apiPort;
  apiUrl = Constants.apiUrl;
  steamCookieName = Constants.steamCookieName

  constructor(private http: HttpClient) {}

  steamSignIn(){
    //var steamID = getCookie(this.steamCookieName);
    
    //if(steamID == ""){
      window.location.href = this.apiUrl + ":" + this.apiPort + "/api/authentication/signin"
    //}

  }
}
