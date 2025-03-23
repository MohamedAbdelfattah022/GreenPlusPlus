using Microsoft.Extensions.AI;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddHttpClient();
builder.Services.AddCors(options => {
  var corsOrigins = builder.Configuration["Ollama:CorsOrigins"]?.Split(",") ?? new[] { "*" };
  options.AddPolicy("AllowSpecificOrigins", policy => {
    policy.WithOrigins(corsOrigins)
          .AllowAnyMethod()
          .AllowAnyHeader()
          .AllowCredentials();
  });
});

builder.Services.AddChatClient(new OllamaChatClient(new Uri(builder.Configuration["Ollama:ApiUrl"]!), builder.Configuration["Ollama:Model"]));

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
  app.MapOpenApi();
  app.MapScalarApiReference();
}
app.UseCors("AllowSpecificOrigins");
app.UseAuthorization();
app.MapControllers();

app.Run();
