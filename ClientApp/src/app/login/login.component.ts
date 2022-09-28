import { Component } from '@angular/core';
import { Constants } from '../util/constants.util';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  apiPort = Constants.apiPort;
  apiUrl = Constants.apiUrl;

  constructor() {}

  ngOnInit(): void{
    this.steamSignIn();
  }

  steamSignIn(){
    //var steamID = getCookie(this.steamCookieName);
    
    //if(steamID == ""){
      window.location.href = this.apiUrl + ":" + this.apiPort + "/api/authentication/signin"
    //}

  }
}
