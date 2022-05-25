using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication;
namespace Steam_App.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SteamController: ControllerBase{
    private readonly IConfiguration _config;
    private readonly string API_KEY;

    private readonly string API_URL;
    public SteamController(IConfiguration config){
        _config = config;
        API_KEY = _config.GetValue<string>("SteamKey");
        API_URL = "http://api.steampowered.com/";
    }

    [HttpPost]
    [Route("getuserinfo")]
    public IActionResult GetUserInfo([FromBody] JsonElement data)
    {
            var test = data.GetString("ID");
        if(Int64.TryParse(test, out long valid)){
            Console.WriteLine(valid);
            return Ok();
        }

        else return BadRequest();
    }
}