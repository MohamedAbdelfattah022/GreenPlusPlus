using Green__Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.AI;

namespace Green__Backend.Controllers;
[Route("api/[controller]")]
[ApiController]
public class ChatController : ControllerBase
{
  private readonly HttpClient _client;
  private readonly IChatClient _chatClient;

  public ChatController(IHttpClientFactory httpClientFactory, IConfiguration configuration, IServiceProvider serviceProvider) {
    _client = httpClientFactory.CreateClient();
    _client.Timeout = Timeout.InfiniteTimeSpan;
    _chatClient = serviceProvider.GetRequiredService<IChatClient>();
  }

  [HttpPost("stream")]
  public async Task StreamChat(ChatRequest request) {
    var chatHistory = new List<ChatMessage>();
    if (request.Messages != null && request.Messages.Any()) {
      foreach (var message in request.Messages) {
        var role = message.Role.ToLower() == "user" ? ChatRole.User : ChatRole.Assistant;
        chatHistory.Add(new ChatMessage(role, message.Content));
      }
    }

    if (!string.IsNullOrEmpty(request.Prompt)) {
      chatHistory.Add(new ChatMessage(ChatRole.User, request.Prompt));
    }

    await foreach (var item in _chatClient.GetStreamingResponseAsync(chatHistory)) {
      await Response.WriteAsync($"data: {item.Text}\n\n");
      await Response.Body.FlushAsync();
    }
  }
}
