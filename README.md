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

4. In <code>appsettings.Development.json</code>, make a JSON Object (replace <code>X</code> with a valid Steam API key):

<code>{ "SteamKey": X }</code>

5. Open two command prompts, one to the root directory of the repository, and one to Steam-App/ClientApp. 

In the former, run <code>dotnet run</code> and in the latter <code>npm start</code>  

6. Open your browser and navigate to <code>localhost:44425</code>

# Progress

State of webpage when logged in as of 9/26/2022:

![9-26-22-steam-app](https://user-images.githubusercontent.com/17236535/192356770-f1e63f68-09a4-45e7-8cfb-42d2950db84a.png)
