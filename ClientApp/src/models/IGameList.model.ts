import { IUserInfo } from "./IUserInfo.model";

export interface IGameList{
    game_count?: number,
    games?: Array<IGame>,
}

export interface IGetGameListResponse{
    response: IGameList;
}

export interface IGame{
    appid?: string,
    img_icon_url?: string,
    name?: string,
    playtime_forever?: number,
    owners: {name: IUserInfo, playtime: number}[],
    total_playtime: number,
    expanded: boolean,
}