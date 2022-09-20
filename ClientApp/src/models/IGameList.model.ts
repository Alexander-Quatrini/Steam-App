export interface IGameList{
    game_count?: number;
    games?: Array<{
        appid?: string,
        img_icon_url?: string,
        name?: string,
        playtime_forever?: number,

    }>;
} 