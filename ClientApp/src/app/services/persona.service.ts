import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGetUserInfoResponse, IUserInfo } from 'src/models/IUserInfo.model';
import { Constants } from '../util/constants.util';

@Injectable({
  providedIn: 'root'
})


export class PersonaService {

  apiPort = Constants.apiPort;
  apiUrl = Constants.apiUrl;

  constructor(private http: HttpClient) {

   }

   //TODO: Refactor to use this service for all API calls.
  getSteamUserFromID(id: string, sessionID: string, callingID: string): Promise<IUserInfo>{
    
    return new Promise((resolve, reject) => {
      this.http.post<IGetUserInfoResponse>(this.apiUrl + ":" + this.apiPort + "/api/steam/getuserinfo", {ID: callingID, SessionID: sessionID, AdditionalIDs: [id]})
      .toPromise().then(content => {
        resolve(content.response.players[0]);
      }).catch(err =>{
        reject(err);
      })
    });
  }
}
