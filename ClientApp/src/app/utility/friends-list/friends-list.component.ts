import { Component, OnInit, Input } from '@angular/core';
import { GameListService } from 'src/app/services/game-list-service.service';
import { SteamService } from 'src/app/services/steam.service';
import { Constants } from 'src/app/util/constants.util';
import { IGameList } from 'src/models/IGameList.model';
import { IUserInfo } from 'src/models/IUserInfo.model';
import { Modal } from 'bootstrap'
@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css'],
  providers:[]
})
export class FriendsListComponent implements OnInit {

  @Input()
  steamID: string = "";

  @Input()
  sessionID: string = "";

  @Input()
  maxFriendsToShow: number = 6;

  API_PORT = Constants.apiPort;
  API_URL = Constants.apiUrl;

  friendIDs: string[] = [];

  friendList: IUserInfo[] = [];
  friendListAbridged: IUserInfo[] = [];
  modalFriends: IUserInfo[] = [];
  friendsToRemove: IUserInfo[] = [];
  friendsToAdd: IUserInfo[] = [];
  currentUsers: IUserInfo[] = [];
  added: IUserInfo[] = [];

  modal: any;
  constructor(private listService: GameListService, private steamService: SteamService) { }

  ngOnInit(): void {


    var id = this.steamID.substring(this.steamID.lastIndexOf('/') + 1);

    this.listService.getUserList().subscribe(users => {
      this.currentUsers = users;
    });

    this.steamService.getFriendsListFromID(id).then(data =>
    {
      this.friendIDs = data.map(friend => friend.steamid);
      return this.friendIDs;
    })
    .then(friend => {
      return this.steamService.getSteamUsersFromIDs(friend);
    })
    .then(users => {
      this.friendList = users;
    })
    .catch(error => {
      console.log(error);
    });

    

    this.modal = new Modal(
      document.getElementById('exampleModal') ?? ""
    );

    document.getElementById('exampleModal')?.addEventListener('hide.bs.modal', event=> {
      let eventTarget = event.target as HTMLElement;
      if(eventTarget && (eventTarget.id != 'save-button')){
        this.friendsToAdd.forEach(friend => {this.friendList.push(friend);})
        this.modalFriends = [];
        this.friendsToRemove = [];
        this.friendsToAdd = [];
      }
    })
  }

  showModal(): void{
    this.modal.show();
    this.currentUsers.map(user => {
      if(!this.modalFriends.includes(user)){
        this.modalFriends.push(user)
        let fIndex = this.friendList.indexOf(user);
        if(fIndex > -1){
          this.friendList.splice(fIndex,1);
        }
      }
      });
  }

  modalAddFriend(user: IUserInfo, event: Event): void{
    event.stopPropagation();
    if(!this.modalFriends.includes(user)){
      this.friendsToAdd.push(user);
      this.modalFriends.push(user);
      let index = this.friendList.indexOf(user);

      if(index > -1){
        this.friendList.splice(index, 1);
        console.log("splice");
      }

      let rIndex = this.friendsToRemove.indexOf(user);
      if(rIndex > -1){
        this.friendsToRemove.splice(rIndex, 1);
      }
    }

    console.log(this.friendsToAdd);
  }

  modalRemoveFriend(user: IUserInfo, event: Event): void{
    event.stopPropagation();
    let index = this.modalFriends.indexOf(user);

    if(index > -1){
      this.modalFriends.splice(index, 1);

      if(!this.friendList.includes(user)){
        this.friendList.unshift(user);
      }

      let aIndex = this.friendsToAdd.indexOf(user);

      if(aIndex > -1){
        this.friendsToAdd.splice(aIndex,1);
      }
      
      if(this.friendsToRemove.indexOf(user) == -1 && this.currentUsers.indexOf(user) > -1){
        this.friendsToRemove.push(user);
      }
    }
  }

  modalConfirmChanges(){
    this.addFriendToGameList(this.friendsToAdd);
    this.removeFriendFromGameList(this.friendsToRemove);
    this.friendsToRemove = [];
    this.friendsToAdd = [];
    this.modal.hide();
  }

  addFriendToGameList(friends: IUserInfo[]): void {
    var gameList: IGameList = {};
    
    console.log("Called");

    friends.map(friend => {
      console.log(friend);
      let index = this.friendListAbridged.indexOf(friend);

      this.listService.isReady(false);
  
      if(index > -1){
          this.friendListAbridged.splice(index, 1);
      }

      this.steamService.getGameListFromID(friend.steamid)
      .then(data => {
        gameList = data;
        gameList.games?.forEach(x => {
          x.owners = [];
        })
        this.listService.addUser(friend, gameList);
        this.listService.isReady(true);
      });
      this.added.push(friend);
    });
  }

  removeFriendFromGameList(friends: IUserInfo[]){
    this.listService.isReady(false);
    friends.map(friend => {
      this.listService.removeUser(friend);
      let aIndex = this.added.indexOf(friend);
      if(aIndex > -1){
        this.added.splice(aIndex, 1);
        this.friendListAbridged.push(friend);
        if(this.friendListAbridged.length > this.maxFriendsToShow){
          this.friendListAbridged.shift();
        }
      }

      let mIndex = this.modalFriends.indexOf(friend);
      if(mIndex > -1){
        this.modalFriends.splice(mIndex, 1);
      }
    });
    this.listService.isReady(true);
  }

}
