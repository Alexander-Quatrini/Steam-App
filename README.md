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

**State of home page when logged in as of 10/3/2022:**

![home-10-3-2022](https://user-images.githubusercontent.com/17236535/193656679-76266eaf-9381-4d5a-9d11-076bc5c6802c.png)

**State of "Add Friends" modal as of 10/3/2022:**

![modal-10-3-2022](https://user-images.githubusercontent.com/17236535/193656844-df2ef360-5fa6-418e-aec7-8b5ccade3294.png)
