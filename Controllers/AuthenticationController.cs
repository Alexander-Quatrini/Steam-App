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


    /* SignOutUser
    *
    * Parameters: JsonElement containing both a Steam ID and GUID representing the Session ID
    *
    *   Returns: BadRequest if an invalid ID or session ID is found, or no valid logon is found with the sessionID
    *   SignOut Action if everything is ok.
    */
    [HttpPost]
    [Route("signout")]
    public IActionResult SignOutUser([FromBody] JsonElement data){
        var id = data.GetString("ID");
        var guid = data.GetString("sessionID");
        
        Guid.TryParse(guid, out Guid sessionID);
        
        if(!Object.Equals(id,null) && !Object.Equals(sessionID,null)){
            //Check if session exists, if it does invalidate it.
            if(_handler.invalidateSessionWithId(id, sessionID)){
                return SignOut(new AuthenticationProperties { RedirectUri = "/"}, CookieAuthenticationDefaults.AuthenticationScheme);
            } else {
                Console.WriteLine("User with ID: " + id + "has no valid session, but tried to logout.");
                return BadRequest();
            }
        } else return BadRequest();
    }

    /* SignIn
    *
    *   Parameters: N/A
    *
    *   Returns: Challenge result from Steam
    *   Notes: Uses OpenID verification see: https://github.com/aspnet-contrib/AspNet.Security.OpenId.Providers
    */

    [HttpGet]
    [Route("signin")]
    public IActionResult SignIn(){
        return Challenge(properties, "Steam");
    }
    

    /* ValidateSession
    *
    * Check if cookies have expired, or if this request originates from an invalid session.
    * Parameters: JsonElement containing the Steam ID and session ID
    * Returns: Unauthorized if no valid session with the Steam and Session ID is found
    * else returns status 200, OK.
    */
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
        } else return Unauthorized();

        return Ok();
    }
}