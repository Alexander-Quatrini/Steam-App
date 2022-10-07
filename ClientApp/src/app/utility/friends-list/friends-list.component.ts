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
  modalFriendsList: IUserInfo[] = [];
  friendsToRemove: IUserInfo[] = [];
  friendsToAdd: IUserInfo[] = [];
  currentUsers: IUserInfo[] = [];
  added: IUserInfo[] = [];

  modal: any;
  ready: boolean = true;

  constructor(private listService: GameListService, private steamService: SteamService) { }

  ngOnInit(): void {

    let searchBar = document.getElementById('search-bar') as HTMLInputElement;

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
      this.friendList = this.modalFriendsList = users.sort((a,b)=> a.personaname!.localeCompare(b.personaname!));
      this.ready = true;
    })
    .catch(error => {
      console.log(error);
    });

    

    this.modal = new Modal(
      document.getElementById('friend-modal') ?? ""
    );

    document.getElementById('friend-modal')?.addEventListener('hide.bs.modal', event=> {
    let scrollElement = document.getElementById('scroll');
        if(scrollElement){
          scrollElement.scrollTop = 0
        }
    });

    document.getElementById('friend-modal')?.addEventListener('hidden.bs.modal', event=> {
      let eventTarget = event.target as HTMLElement;
      if(eventTarget && (eventTarget.id != 'save-button')){
        this.friendsToAdd.forEach(friend => {this.modalFriendsList.push(friend);})
        searchBar.value = "";
        this.modalFriends = [];
        this.friendsToRemove = [];
        this.friendsToAdd = [];
      }
    })

    searchBar?.addEventListener('keyup', event=> {
      let eventTarget = event.target as HTMLInputElement;
      let searchTerm = eventTarget.value.toLocaleLowerCase();

      this.modalFriendsList = this.friendList.filter(friend => friend.personaname?.toLocaleLowerCase().includes(searchTerm))
    })
  }

  showModal(): void{
    if(this.ready){
    this.modal.show();
    this.currentUsers.map(user => {
      if(!this.modalFriends.includes(user)){
        this.modalFriends.push(user);
        let fIndex = this.modalFriendsList.indexOf(user);
        if(fIndex > -1){
          this.modalFriendsList.splice(fIndex,1);
        }
      }
      });
  }
}

  modalAddFriend(user: IUserInfo, event: Event): void{
    event.stopPropagation();
    if(!this.modalFriends.includes(user)){
      this.friendsToAdd.push(user);
      this.modalFriends.push(user);
      let index = this.modalFriendsList.indexOf(user);

      if(index > -1){
        this.modalFriendsList.splice(index, 1);
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

      if(!this.modalFriendsList.includes(user)){
        this.modalFriendsList.unshift(user);
      }

      console.log(this.modalFriendsList);

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
    this.listService.isReady(false);
    this.ready = false;
    this.modal.hide();
    this.addFriendToGameList(this.friendsToAdd);
    this.removeFriendFromGameList(this.friendsToRemove);
    this.friendsToRemove = [];
    this.friendsToAdd = [];
    this.ready = true;
    this.listService.isReady(true);
  }

  addFriendToGameList(friends: IUserInfo[]): void {
    var gameList: IGameList = {};
    
    friends.map(friend => {
      let index = this.friendListAbridged.indexOf(friend);

  
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
      });
      this.added.push(friend);
    });
  }

  removeFriendFromGameList(friends: IUserInfo[]){
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

      if(!this.modalFriendsList.includes(friend)){
        this.modalFriendsList.unshift(friend);
      }

      let mIndex = this.modalFriends.indexOf(friend);
      if(mIndex > -1){
        this.modalFriends.splice(mIndex, 1);
      }
    });
  }

}
