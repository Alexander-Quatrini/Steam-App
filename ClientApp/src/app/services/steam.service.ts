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
      this.getSteamUserFromID(id).then(user=>{

        this.http.post<IGetGameListResponse>(this.apiUrl + ":" + this.apiPort + "/api/steam/getgamelist", {ID: this.steamID, SessionID: this.sessionID, gameListID: id})
        .toPromise().then(content => {
          content.response.games?.map(entry => {entry.owners?.push({name: user, playtime: entry.playtime_forever ?? 0})});
          content.response.games = content.response.games?.map(data => ({ ...data, playtime_forever: Number(Math.round
            (Number((data.playtime_forever ?? 0) / 60 + "e" + "1"))+ "e-" +"1")}));
          resolve(content.response);
        })
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
        let toReturn = content.response.players.filter(user => {
          return user.communityvisibilitystate == 3;
        })
        resolve(toReturn);
      }).catch(err =>{
        reject(err);
      })
    });
  }

  logout(): Promise<void>{
    return new Promise((resolve,reject) => {
      this.http.post(this.apiUrl + ":" + this.apiPort + "/api/steam/signout", {ID: this.steamID, SessionID: this.sessionID})
      .toPromise().then(content => {
        resolve();
      }).catch(error => {
        reject(error);
      })
    });
  }
}
