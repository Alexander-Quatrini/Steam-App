import { IGame } from "./IGame.model";

export interface IGameList{
    game_count?: number;
    games?: Array<IGame>;
}

export interface IGetGameListResponse{
    response: IGameList;
}