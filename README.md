# Steam-App

Compare games owned by Steam users, and displays a list of shared games between everybody.

Uses Angular on the front end and .NET Core 6.0 on the back end.

Front end is not complete, but back end structure is present.

# Setup

*A Steam API key is required to run the .NET server and make most of the API calls.*

*More info here: https://steamcommunity.com/dev*

1. Clone project 

2. Navigate to Steam-App/ClientApp in a command prompt and run <code>npm install</code>

3. Create a json file in the Steam-App directory, call it <code>appsettings.Development.json</code>

4. Make a JSON Object (replace <code>X</code> with a valid Steam API key).

<code>
{
    "SteamKey": X
}
</code>

5. Open two command prompts, one to the root directory of the repository, and one to Steam-App/ClientApp. 

In the former, run <code>dotnet run</code> and in the latter <code>npm start</code>  

6. Open your browser and navigate to <code>localhost:44425</code>

# Progress

State of webpage when logged in as of 9/22/2022:

![9-22-22-steam-app](https://user-images.githubusercontent.com/17236535/191805034-eeb246f3-1d98-4b94-8283-20f53c919a66.png)



