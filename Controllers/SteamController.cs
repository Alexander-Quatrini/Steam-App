using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication;
namespace Steam_App.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SteamController: ControllerBase{

    private readonly HttpClient _client;
    private readonly IConfiguration _config;
    private readonly string API_KEY;

    private readonly string API_URL;
    public SteamController(IConfiguration config, HttpClient client){
        _config = config;
        _client = client;
        API_KEY = _config.GetValue<string>("SteamKey");
        API_URL = "https://api.steampowered.com/";
    }

    [HttpPost]
    [Route("getuserinfo")]
    public async Task<IActionResult> GetUserInfo([FromBody] JsonElement data)
    {
            var test = data.GetString("ID");
        if(Int64.TryParse(test, out long valid)){
            var url = API_URL + "ISteamUser/GetPlayerSummaries/v0002/?key="+API_KEY+"&steamids="+valid;
            HttpResponseMessage message = await _client.GetAsync(url);
                if(message.IsSuccessStatusCode)
                {
                    var content = await message.Content.ReadAsStringAsync();
                    return Ok(content);
                }

            return StatusCode(500);
        }

        return BadRequest();
    }
}