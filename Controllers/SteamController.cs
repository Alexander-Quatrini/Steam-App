using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication;
using Steam_App.Services;
namespace Steam_App.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SteamController: ControllerBase{

    private readonly AuthenticationHandler _handler;
    private readonly HttpClient _client;
    private readonly IConfiguration _config;
    private readonly string API_KEY;

    private readonly string API_URL;
    public SteamController(IConfiguration config, HttpClient client, AuthenticationHandler handler){
        _config = config;
        _client = client;
        API_KEY = _config.GetValue<string>("SteamKey");
        API_URL = "https://api.steampowered.com/";
        _handler = handler;
    }


    /* GetUserInfo
    *
    *   Parameters: JsonElement with a Steam ID.
    *
    *   Returns: Response from Steam Web API. Get Player Summaries call.
    *   Notes: Steam Web API docs are found at: https://steamcommunity.com/dev 
    */
    [HttpPost]
    [Route("getuserinfo")]
    public async Task<IActionResult> GetUserInfo([FromBody] JsonElement data)
    {
        var ID = ValidateSession(data);

            if(!ID.Equals(string.Empty)){
            
                var url = API_URL + "ISteamUser/GetPlayerSummaries/v0002/?key="+API_KEY+"&steamids="+ID;

                HttpResponseMessage message = await _client.GetAsync(url);
                if(message.IsSuccessStatusCode)
                {
                    var content = await message.Content.ReadAsStringAsync();
                    return Ok(content);
                }

            return StatusCode(500);
            }

            return Unauthorized();
    }

    [HttpPost]
    [Route("getgamelist")]
    public async Task<IActionResult> GetGameList([FromBody] JsonElement data)
    {
        var ID = ValidateSession(data);

            if(!ID.Equals(string.Empty)){
            
                var url = API_URL + "/IPlayerService/GetOwnedGames/v0001/?key="+API_KEY+"&steamid="+ID+"&include_appinfo=true&include_played_free_games=true";

                HttpResponseMessage message = await _client.GetAsync(url);
                if(message.IsSuccessStatusCode)
                {
                    var content = await message.Content.ReadAsStringAsync();
                    return Ok(content);
                }

            return StatusCode(500);
            }

            return Unauthorized();
    }

    [HttpPost]
    [Route("getfriendlist")]
    public async Task<IActionResult> GetFriendList([FromBody] JsonElement data)
    {
         var ID = ValidateSession(data);

            if(!ID.Equals(string.Empty)){
            
                var url = API_URL + "/ISteamUser/GetFriendList/v0001/?key="+API_KEY+"&steamid="+ID+"&relationship=all";

                HttpResponseMessage message = await _client.GetAsync(url);
                if(message.IsSuccessStatusCode)
                {
                    var content = await message.Content.ReadAsStringAsync();
                    return Ok(content);
                }

            return StatusCode(500);
            }

            return Unauthorized();  
    }

    private string ValidateSession(JsonElement data)
    {
        var test = data.GetString("ID");
        var uuid = data.GetString("SessionID");
        
        if(!Object.Equals(test, null) && !Object.Equals(uuid, null)){
            Guid.TryParse(uuid, out Guid guid);
            return _handler.ValidateSession(test, guid) ? test : string.Empty;
        }

        return string.Empty;
    }
}