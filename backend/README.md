# Chat LLM Backend

This is a FastAPI backend for streaming LLM responses using SSE (Server-Sent Events). It connects to Ollama API to generate responses from Llama 3.2.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure the Ollama API endpoint:
   - By default, it connects to `http://localhost:11434/api/generate`
   - If using ngrok to expose Ollama API, update the `OLLAMA_API_URL` in `main.py`

## Running the server

```bash
python main.py
```

The server will start on `http://localhost:8000`.

## API Endpoints

- `POST /api/chat`: Send messages to the LLM and receive streaming responses

## Using with ngrok

If you have Ollama running elsewhere and exposed through ngrok:

1. Update the `OLLAMA_API_URL` in `main.py` to point to your ngrok URL
2. Ensure your ngrok URL is accessible from the server running this backend

## Environment Variables

You can optionally use environment variables:
- `OLLAMA_API_URL`: URL of the Ollama API
- `CORS_ORIGINS`: Comma-separated list of allowed origins for CORS 