using Microsoft.AspNetCore.Mvc;
using Steam_App.Services;
namespace Steam_App.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SteamController: ControllerBase{
    private readonly IConfiguration _config;
    private readonly string API_KEY;
    public SteamController(IConfiguration config){
        _config = config;
        API_KEY = _config.GetValue<string>("SteamKey");
    }
}