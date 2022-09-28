export interface IFriend{
    steamid?: string;
}

export interface IFriendListResponse{
    friendslist: {
      friends: IFriend[];
    }
  }