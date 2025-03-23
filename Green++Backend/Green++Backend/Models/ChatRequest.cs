namespace Green__Backend.Models;
public class ChatRequest
{
  public string Prompt { get; set; } = string.Empty;
  public List<Message>? Messages { get; set; }
}
