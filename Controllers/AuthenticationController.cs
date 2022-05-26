using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
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

    [HttpPost]
    [Route("signout")]
    public IActionResult SignOutUser([FromBody] JsonElement data){
        var id = data.GetString("ID");
        var guid = data.GetString("sessionID");
        
        Guid.TryParse(guid, out Guid sessionID);
        
        if(!Object.Equals(id,null) && !Object.Equals(sessionID,null)){
            if(_handler.invalidateSessionWithId(id, sessionID)){
                return SignOut(new AuthenticationProperties { RedirectUri = "/"}, CookieAuthenticationDefaults.AuthenticationScheme);
            } else {
                Console.WriteLine("User with ID: " + id + "has no valid session, but tried to logout.");
                return BadRequest();
            }
        } else return BadRequest();
    }

    [HttpGet]
    [Route("signin")]
    public IActionResult SignIn(){
        return Challenge(properties, "Steam");
    }
    
    [HttpPost]
    [Route("sessionvalid")]
    public IActionResult ValidateSession([FromBody] JsonElement data){
        var id = data.GetString("ID");
        var guid = data.GetString("sessionID");
        Guid.TryParse(guid, out Guid sessionID);
        
        if(!Object.Equals(id,null) && !Object.Equals(sessionID,null)){
            if(!_handler.ValidateSession(id, sessionID)){
                return Unauthorized();
            }
        }

        return Ok();
    }
}