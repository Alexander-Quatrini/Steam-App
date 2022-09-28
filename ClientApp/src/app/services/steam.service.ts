import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IFriend, IFriendListResponse } from 'src/models/IFriend.model';
import { IGameList, IGetGameListResponse } from 'src/models/IGameList.model';
import { IGetUserInfoResponse, IUserInfo } from 'src/models/IUserInfo.model';
import { Constants } from '../util/constants.util';

@Injectable({
  providedIn: 'root'
})


export class SteamService {

  apiPort = Constants.apiPort;
  apiUrl = Constants.apiUrl;

  steamID: string = "";
  sessionID: string = "";

  constructor(private http: HttpClient) {}

  init(steamID: string, sessionID: string): void{
    this.steamID = steamID;
    this.sessionID = sessionID;
  }

   //TODO: Refactor to use this service for all API calls.
  getSteamUserFromID(id: string): Promise<IUserInfo>{  
    return new Promise((resolve, reject) => {
      this.http.post<IGetUserInfoResponse>(this.apiUrl + ":" + this.apiPort + "/api/steam/getuserinfo", {ID: this.steamID, SessionID: this.sessionID, AdditionalIDs: [id]})
      .toPromise().then(content => {
        resolve(content.response.players[0]);
      }).catch(err =>{
        reject(err);
      })
    });
  }

  getGameListFromID(id: string): Promise<IGameList>{
    return new Promise((resolve,reject) => {
      this.http.post<IGetGameListResponse>(this.apiUrl + ":" + this.apiPort + "/api/steam/getgamelist", {ID: this.steamID, SessionID: this.sessionID})
      .toPromise().then(content => {
        resolve(content.response);
      }).catch(err =>{
        reject(err);
      })
    });
  }

  getFriendsListFromID(id: string): Promise<IFriend[]>{
    return new Promise((resolve,reject) => {
      this.http.post<IFriendListResponse>(this.apiUrl + ":" + this.apiPort + "/api/steam/getfriendlist", {ID: this.steamID, SessionID: this.sessionID})
      .toPromise().then(content => {
        resolve(content.friendslist.friends);
      }).catch(err =>{
        reject(err);
      })
    });
  }

  getSteamUsersFromIDs(id: string[]): Promise<IUserInfo[]>{
    return new Promise((resolve,reject) => {
      this.http.post<IGetUserInfoResponse>(this.apiUrl + ":" + this.apiPort + "/api/steam/getuserinfo", {ID: this.steamID, SessionID: this.sessionID, AdditionalIDs: id})
      .toPromise().then(content => {
        resolve(content.response.players);
      }).catch(err =>{
        reject(err);
      })
    });
  }
}
