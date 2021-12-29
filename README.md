# Steam-App

<h2>Development Setup</h2>

All right bozos I'm going to show you how to do this it is a process.

If you don't already have Node.js download the latest version. (17.3.0) https://nodejs.org/en/ 

You should have npm now, confirm this in a command prompt. 

Run the cmd as an admin and run: <code>npm -v</code>

If it don't error out, you good... otherwise congratulations <b>you messed up step 1</b> probably ask me for help at that point. :).

Ok now that you have node and npm, we are going to downgrade their versions. Why not just download the earlier version you ask... trust me I'm about to lay some knowledge on you.

If you on mac you are lucky because this is much easier on unix.

<h3>Windows Instructions for NVM</h3>

We downloading some more stuff. https://github.com/coreybutler/nvm-windows/releases

Download the nvm-setup.zip, extract it, and run the .exe as admin.
Install nvm. Open a command prompt and run 

<code>nvm v</code> If you see some numbers you good.
run 

`nvm install 16.10.0` then `nvm use 16.10.0`

If it is saying stuff about access denied or something you probably didn't run the command prompt as admin.
If it is still yelling at you that the access is denied you probably didn't run the nvm setup as admin. If you did both those things, idk man I'm not a wizard.

So the cool thing about nvm is that you can now switch Node versions on the fly by typing 

`nvm install <version number>` then `nvm use <version number>`

It will be helpful I promise, it took me a while to figure out how to switch Node.js versions without just straight up uninstalling Node.js

<h3>Mac Instructions</h3>

Lucky you. 

Run <code>npm install -g n</code>

Then <code>n 16.10.0</code>

Then <code>n use 16.10.0</code>

Cool you are done.

<h3>Let's do some .NET stuff</h3>

https://dotnet.microsoft.com/en-us/download Download latest version.

Do me a favor, run <code>dotnet --version</code> See numbers? Good. Error? Bad.

Ok we are in the home stretch... go ahead and clone this repository to your machine.

I don't remember this next part too well so if anything goes wrong feel free to ask for help, I'll probably figure it out.

<h2>Final Setup</h2>

Run these commands, if anywhere you get a fatal error or there is vulnerabilities at the end tell me, and we will fix the problem together :)

<code>npm install -g npm@6.14.15</code>

<code>cd ClientApp</code>

<code>ng update</code>

Should say that @angular/cli and @angular/core need to be updated here.

\*<strong>EDIT</strong>\*

I forgot about installing Angular heh. ONLY DO THIS IF YOU DO NOT HAVE ANGULAR (ng update results in a message that ng is not a command) <code>npm install -g @angular/cli</code>

Check the version with `ng version` to verify it's worked. Run `ng update` again and update if needed. Continue.

\*<strong>END EDIT</strong>\*

<code>ng update @angular/cli</code>
This should update both, but run <code>ng update @angular/core</code> just to make sure.

<code>npm install</code>

<code>npm audit fix</code>

You should have 0 VULNERABILITIES AT THIS POINT, I repeat 0, don't run npm audit fix --force that messes things up. Just tell me, honestly I probably wrote something wrong so don't worry about it.

OK! You should be good at this point.

Open up another command prompt, ooo hackerman.

In one cmd navigate to the project folder. Run <code>dotnet run</code>

In the other navigate to the ClientApp folder inside the project folder. Run <code>ng serve</code>

Go to web browser and open up localhost:4200, and you should see a web page with <b>Hello World!</b> at the top and some stuff about ASP.NET. If you see that you really did it my boy.

Again if anything here doesn't work, go ahead and contact me, and I'll take a look.

Let's do this.

