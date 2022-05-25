using Microsoft.AspNetCore.Authentication.Cookies;
using Steam_App.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpContextAccessor()
.AddHttpClient()
.AddSingleton<AuthenticationHandler>()
.AddAuthentication(options => {options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;})
.AddSteam(options => 
{
    options.EventsType = typeof(AuthenticationHandler);
}).AddCookie();

// Add services to the container.
builder.Services.AddCors(options => 
    options.AddDefaultPolicy(x  => 
    x.AllowAnyHeader()
    .AllowAnyMethod()
    .AllowAnyOrigin())
    );

builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseCors();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");;

app.Run();
