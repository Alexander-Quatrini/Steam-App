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
  maxFriendsToShow: number = 12;

  API_PORT = Constants.apiPort;
  API_URL = Constants.apiUrl;

  friendIDs: string[] = [];

  friendList: IUserInfo[] = [];
  friendListAbridged: IUserInfo[] = [];
  modalFriends: IUserInfo[] = [];
  friendsToRemove: IUserInfo[] = [];
  currentUsers: IUserInfo[] = [];

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
      this.friendListAbridged = users.slice(0, this.maxFriendsToShow);
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
        this.modalFriends.forEach(friend => {
          this.friendList.push(friend);
        });
      }
    })
  }

  showModal(): void{
    this.modal.show();
    this.modalFriends = this.currentUsers.filter(x => x.steamid != this.steamID);
  }

  modalAddFriend(user: IUserInfo, event: Event): void{
    event.stopPropagation();
    if(!this.modalFriends.includes(user)){
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
  }

  modalRemoveFriend(user: IUserInfo, event: Event): void{
    event.stopPropagation();
    let index = this.modalFriends.indexOf(user);

    if(index > -1){
      this.modalFriends.splice(index, 1);
      this.friendList.push(user);
      
      if(this.friendsToRemove.indexOf(user) == -1 && this.currentUsers.indexOf(user) > -1){
        this.friendsToRemove.push(user);
      }
    }
  }

  modalConfirmChanges(){
    this.modalFriends.forEach(user => this.addFriendToGameList(user));
    this.friendsToRemove.forEach(user => this.listService.removeUser(user));
    this.friendsToRemove = [];
    this.modal.hide();
  }

  addFriendToGameList(friend: IUserInfo): void {
    
    var gameList: IGameList = {};
    
    let index = this.friendList.indexOf(friend);

    if(index > -1){
      this.friendList.splice(index,1);
    }

    this.steamService.getGameListFromID(friend.steamid)
    .then(data => {
      gameList = data;
      gameList.games?.forEach(x => {
        x.owners = [];
      })
      this.listService.addUser(friend, gameList);
    });
  }

}
