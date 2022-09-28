export interface IUserInfo{
    steamid: string,
    communityvisibilitystate?: number,
    profilestate?: number,
    personaname?: string,
    profileurl?: string,
    avatar?: string,
    avatarmedium?: string,
    avatarfull?: string
}

export interface IGetUserInfoResponse{
    response: {
      players: IUserInfo[];
    }
}