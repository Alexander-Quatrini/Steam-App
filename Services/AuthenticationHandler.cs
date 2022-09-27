using AspNet.Security.OpenId;
using System.Security.Claims;
namespace Steam_App.Services;

public class AuthenticationHandler: OpenIdAuthenticationEvents{

    private readonly IHttpContextAccessor _contextAccessor;
    private IDictionary<string, Guid> validSessions;

    public AuthenticationHandler(IHttpContextAccessor contextAccessor)
    {
        _contextAccessor = contextAccessor;
        validSessions = new Dictionary<string,Guid>();
    }

    /* Authenticated
    *
    * Parameters: The context of the successful login
    * Returns: Completed Task
    * 
    * Notes: Called upon a successful authentication from Steam. Creates cookies with Steam ID and a valid session with
    * a new session ID is created.
    */
    public override Task Authenticated(OpenIdAuthenticatedContext context){
        var steamUser = context.Identity;
        if(!Object.Equals(steamUser, null))
        {
            Claim? steamID = steamUser.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);
            if(!Object.Equals(steamID,null))
            {
                CookieOptions options = new CookieOptions();
                options.Expires = DateTime.Now.AddSeconds(3600);
                if(!Object.Equals(_contextAccessor.HttpContext, null)){
                    _contextAccessor.HttpContext.Response.Cookies.Append("SteamID", steamID.Value, options);
                    Guid myuuid = Guid.NewGuid();
                    _contextAccessor.HttpContext.Response.Cookies.Append("SessionID", myuuid.ToString(), options);
                    string steamIDToStore = steamID.Value.Substring(steamID.Value.LastIndexOf("/") + 1);
                    addValidSession(steamIDToStore, myuuid);

                }
            }
        }
        return Task.CompletedTask;
    }

    /* invalidateSessionWithId
    *
    * Parameters: The steam id and current session ID
    * 
    * Returns: True if a valid session was found and successfully removed, false otherwise.
    */    
    public bool invalidateSessionWithId(string id, Guid sessionID)
    {
        if(validSessions.Any(item => item.Key == id && item.Value.Equals(sessionID))){
            return (validSessions.Remove(id));
        } else return false;
    }

    /* addValidSession
    *
    * Parameters: The steam id and current session ID
    * 
    * Returns: N/A
    * Notes: Clears all existing sessions with Steam ID in the dictionary.
    */  
    public void addValidSession(string id, Guid uuid)
    {
        bool existingSession = validSessions.Any(item => item.Key == id);

        if(existingSession)
        {
            validSessions.Remove(id);
        }
        validSessions.Add(id, uuid);

        Console.WriteLine("Active Sessions: ");
        validSessions.ToList().ForEach(item => Console.WriteLine(item.Key + " : " + item.Value));
        Console.WriteLine(validSessions.Count + " total active session(s).");
    }

    /* ValidateSession
    *
    * Parameters: The steam id and current session ID
    * 
    * Returns: True if a session with steam ID and session ID exists, false otherwise.
    */  
    public bool ValidateSession(string id, Guid uuid)
    {
        return (validSessions.Any(item => item.Key == id && item.Value.Equals(uuid)));
    }
}