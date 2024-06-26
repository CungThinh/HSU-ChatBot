# HSU_Chatbot

### First Look, The server just started so it took little bit time

![ScreenRecording2024-06-09at20 56 08-ezgif com-video-to-gif-converter](https://github.com/CungThinh/HSU-ChatBot/assets/114906482/b75812bb-c4bc-4521-9ea4-35e3fbeff36d)


## Tech

**Client:** React

**Server:** Node, SocketIO, PrivateGPT(**Llama3**)

## Description

- Using PrivateGPT for RAG

- This chatbot will retrieve information from ingested files

## Reference

[Template](https://www.youtube.com/watch?v=70H_7C0kMbI) thank you for the template(Binaryhood)

[PrivateGPT](https://docs.privategpt.dev/overview/welcome/introduction) for API

## Additional

#### Run the privateGPT 

```bash
  git clone https://github.com/zylon-ai/private-gpt.git
```

```bash
  PGPT_PROFILES=ollama make run
```

#### Call the API

```javascript
  const client = new PrivategptApiClient({
        environment: "http://localhost:8001",
   });

   const stream = await client.contextualCompletions.promptCompletionStream({
        systemPrompt: 'Answer like a dumbass',
        prompt: msg,
        includeSources: true,
        useContext: true,
        contextFilter: {docsIds: [docsIds]}
    });
```
