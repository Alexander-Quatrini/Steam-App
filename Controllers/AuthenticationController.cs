using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Steam_App.Services;

namespace Steam_App.Controllers;


[ApiController]
[Route("api/[controller]")]
public class AuthenticationController: ControllerBase{
    private AuthenticationProperties properties = new AuthenticationProperties {RedirectUri = "/"};

    private readonly AuthenticationHandler _handler;

    public AuthenticationController(AuthenticationHandler handler, IHttpContextAccessor contextAccessor)
    {
        _handler = handler;
    }

    [HttpGet]
    [Route("signin")]
    public IActionResult SignIn()
    {
        return Challenge(properties, "Steam");
    }
    
    [HttpPost]
    [Route("sessionvalid")]
    public IActionResult ValidateSession([FromBody] JsonElement data){
        var id = data.GetString("ID");
        var guid = data.GetString("sessionID");
        Console.WriteLine(guid);
        Guid.TryParse(guid, out Guid sessionID);
        
        if(!Object.Equals(id,null) && !Object.Equals(guid,null)){
            if(!_handler.ValidateSession(id, sessionID)){
                return Unauthorized();
            }
        }

        return Ok();
    }
}