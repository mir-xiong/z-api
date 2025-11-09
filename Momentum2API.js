const API_BASE_URL = "https://movementlabs.ai";
const DEFAULT_AUTH_KEYS = ["sk-default", "sk-false"];
const DEFAULT_SESSIONS = ["session1", "session2"];

const UA_COMPONENTS = {
  windows: {
    os: [
      "Windows NT 10.0; Win64; x64",
      "Windows NT 10.0; WOW64",
      "Windows NT 6.1; Win64; x64",
      "Windows NT 6.1; WOW64"
    ],
    browsers: {
      chrome: {
        name: "Chrome",
        versions: ["120.0.0.0", "119.0.0.0", "118.0.0.0", "117.0.0.0", "116.0.0.0"],
        webkit: "537.36"
      },
      firefox: {
        name: "Firefox",
        versions: ["121.0", "120.0", "119.0", "118.0", "117.0"],
        gecko: "20100101"
      },
      edge: {
        name: "Edg",
        versions: ["120.0.0.0", "119.0.0.0", "118.0.0.0"],
        webkit: "537.36"
      }
    }
  },

  macos: {
    os: [
      "Macintosh; Intel Mac OS X 10_15_7",
      "Macintosh; Intel Mac OS X 10_14_6",
      "Macintosh; Intel Mac OS X 13_6",
      "Macintosh; Intel Mac OS X 14_2"
    ],
    browsers: {
      chrome: {
        name: "Chrome",
        versions: ["120.0.0.0", "119.0.0.0", "118.0.0.0", "117.0.0.0"],
        webkit: "537.36"
      },
      safari: {
        name: "Version",
        versions: ["17.1.2", "17.1", "17.0", "16.6"],
        webkit: "605.1.15",
        safari: "605.1.15"
      },
      firefox: {
        name: "Firefox",
        versions: ["121.0", "120.0", "119.0"],
        gecko: "20100101"
      }
    }
  },

  linux: {
    os: [
      "X11; Linux x86_64",
      "X11; Ubuntu; Linux x86_64"
    ],
    browsers: {
      chrome: {
        name: "Chrome",
        versions: ["120.0.0.0", "119.0.0.0", "118.0.0.0"],
        webkit: "537.36"
      },
      firefox: {
        name: "Firefox",
        versions: ["121.0", "120.0", "119.0"],
        gecko: "20100101"
      }
    }
  },

  android: {
    os: [
      "Linux; Android 13; Pixel 7",
      "Linux; Android 12; SM-G991B",
      "Linux; Android 11; SM-A525F",
      "Linux; Android 14; SM-S918B",
      "Linux; Android 13; 2201116SG"
    ],
    browsers: {
      chrome: {
        name: "Chrome",
        versions: ["116.0.0.0", "115.0.0.0", "114.0.0.0", "113.0.0.0"],
        webkit: "537.36",
        mobile: "Mobile Safari/537.36"
      },
      firefox: {
        name: "Firefox",
        versions: ["116.0", "115.0", "114.0"],
        mobile: "Mobile"
      }
    }
  },

  ios: {
    os: [
      "iPhone; CPU iPhone OS 17_0 like Mac OS X",
      "iPhone; CPU iPhone OS 16_6 like Mac OS X",
      "iPhone; CPU iPhone OS 15_7 like Mac OS X",
      "iPad; CPU OS 17_1 like Mac OS X"
    ],
    browsers: {
      safari: {
        name: "Version",
        versions: ["17.0", "16.6", "15.7", "17.1"],
        webkit: "605.1.15",
        mobile: "Mobile/15E148 Safari/604.1"
      },
      chrome: {
        name: "CriOS",
        versions: ["120.0.6099.119", "119.0.6045.169", "118.0.5993.88"],
        webkit: "605.1.15",
        mobile: "Mobile/15E148"
      }
    }
  }
};

const MODELS = [
  "momentum",
  "gpt-4o-mini",
  "gpt-4o",
  "gpt-4.1-nano",
  "gpt-4.1-mini",
];

function getRandomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomUserAgent() {
  const platforms = Object.keys(UA_COMPONENTS);
  const platform = getRandomChoice(platforms);
  const config = UA_COMPONENTS[platform];

  const os = getRandomChoice(config.os);
  const browserTypes = Object.keys(config.browsers);
  const browserType = getRandomChoice(browserTypes);
  const browser = config.browsers[browserType];
  const version = getRandomChoice(browser.versions);

  let ua = "Mozilla/5.0";

  if (platform === 'windows' || platform === 'linux') {
    ua += ` (${os})`;
  } else if (platform === 'macos') {
    ua += ` (${os})`;
  } else if (platform === 'android') {
    ua += ` (${os})`;
  } else if (platform === 'ios') {
    ua += ` (${os})`;
  }

  if (browserType === 'chrome' || browserType === 'edge') {
    ua += ` AppleWebKit/${browser.webkit} (KHTML, like Gecko) ${browser.name}/${version} Safari/${browser.webkit}`;
    if (platform === 'android' && browser.mobile) {
      ua += ` ${browser.mobile}`;
    }
  } else if (browserType === 'firefox') {
    ua += `; rv:${version}) Gecko/${browser.gecko} Firefox/${version}`;
    if (platform === 'android' && browser.mobile) {
      ua += ` ${browser.mobile}`;
    }
  } else if (browserType === 'safari') {
    ua += ` AppleWebKit/${browser.webkit} (KHTML, like Gecko) ${browser.name}/${version} Safari/${browser.safari || browser.webkit}`;
    if (platform === 'ios' && browser.mobile) {
      ua += ` ${browser.mobile}`;
    }
  } else if (browserType === 'crios') {
    ua += ` AppleWebKit/${browser.webkit} (KHTML, like Gecko) ${browser.name}/${version} Mobile/15E148 Safari/${browser.webkit}`;
  }

  return ua;
}

function getRandomSession(sessions) {
  return sessions[Math.floor(Math.random() * sessions.length)];
}

function generateUUID() {
  return crypto.randomUUID();
}

function parseAuthAndGetSessions(req, ENV) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.replace(/^Bearer\s+/i, "");

  if (DEFAULT_AUTH_KEYS.includes(token)) {
    return ENV.AUTH_SESSIONS?.split(",") || DEFAULT_SESSIONS;
  }

  const sessions = token.split(",").map(s => s.trim()).filter(s => s.length > 0);
  return sessions.length > 0 ? sessions : null;
}

function getCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function handleModelsRequest() {
  const modelsData = {
    object: "list",
    data: MODELS.map((modelId) => ({
      id: modelId,
      object: "model",
      created: Math.floor(Date.now() / 1000),
      owned_by: "movementlabs",
    })),
  };

  return new Response(JSON.stringify(modelsData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...getCorsHeaders(),
    },
  });
}

function convertMessages(messages) {
  return messages.map((msg) => ({
    role: msg.role === "assistant" ? "assistant" : "user",
    content: msg.content,
  }));
}

function countUserMessages(messages) {
  return messages.filter((msg) => msg.role !== "assistant").length;
}

function parseStreamChunk(chunk) {
  if (!chunk.startsWith('0:"')) return null;

  try {
    const match = chunk.match(/^0:"(.*)"/);
    if (match && match[1]) {
      return match[1]
        .replace(/\\n/g, "\n")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");
    }
  } catch (e) {
    console.error("Parse chunk error:", e);
  }
  return null;
}

function createStreamChunk(id, model, content, finishReason = null) {
  const chunk = {
    id,
    object: "chat.completion.chunk",
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        delta: finishReason
          ? { content: "", reasoning_content: null }
          : { content, reasoning_content: null },
        logprobs: null,
        finish_reason: finishReason,
      },
    ],
  };

  return `data: ${JSON.stringify(chunk)}\n\n`;
}

async function handleStreamResponse(targetResponse, model) {
  const reader = targetResponse.body.getReader();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const id = generateUUID();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const firstChunk = {
          id,
          object: "chat.completion.chunk",
          created: Math.floor(Date.now() / 1000),
          model,
          choices: [
            {
              index: 0,
              delta: {
                role: "assistant",
                content: null,
                reasoning_content: null,
              },
              logprobs: null,
              finish_reason: null,
            },
          ],
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(firstChunk)}\n\n`));

        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim()) continue;

            const content = parseStreamChunk(line);
            if (content !== null) {
              const chunk = createStreamChunk(id, model, content);
              controller.enqueue(encoder.encode(chunk));
            }
          }
        }

        if (buffer.trim()) {
          const content = parseStreamChunk(buffer);
          if (content !== null) {
            const chunk = createStreamChunk(id, model, content);
            controller.enqueue(encoder.encode(chunk));
          }
        }

        const finishChunk = createStreamChunk(id, model, "", "stop");
        controller.enqueue(encoder.encode(finishChunk));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));

        controller.close();
      } catch (error) {
        console.error("Stream error:", error);
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      ...getCorsHeaders(),
    },
  });
}

async function handleNonStreamResponse(targetResponse, model) {
  const reader = targetResponse.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullContent = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.trim()) continue;

      const content = parseStreamChunk(line);
      if (content !== null) {
        fullContent += content;
      }
    }
  }

  if (buffer.trim()) {
    const content = parseStreamChunk(buffer);
    if (content !== null) {
      fullContent += content;
    }
  }

  const response = {
    id: generateUUID(),
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: fullContent,
          reasoning_content: null,
        },
        finish_reason: "stop",
      },
    ],
    usage: {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    },
  };

  return new Response(JSON.stringify(response), {
    headers: {
      "Content-Type": "application/json",
      ...getCorsHeaders(),
    },
  });
}

async function handleChatCompletion(req, sessions, ENV) {
  try {
    const body = await req.json();
    const { messages, stream = false, model = "momentum" } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...getCorsHeaders() },
        }
      );
    }

    const convertedMessages = convertMessages(messages);
    const userMessageCount = countUserMessages(messages);

    const selectedSession = getRandomSession(sessions);

    const targetUrl = `${API_BASE_URL}/api/chat`;
    const targetBody = {
      messages: convertedMessages,
    };

    const targetResponse = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-message-count": userMessageCount.toString(),
        "User-Agent": getRandomUserAgent(),
        "Referer": `${API_BASE_URL}/`,
        "Cookie": `__session=${selectedSession}`,
      },
      body: JSON.stringify(targetBody),
    });

    if (!targetResponse.ok) {
      return new Response(
        JSON.stringify({
          error: "Target API request failed",
          status: targetResponse.status,
          statusText: targetResponse.statusText
        }),
        {
          status: targetResponse.status,
          headers: { "Content-Type": "application/json", ...getCorsHeaders() },
        }
      );
    }

    if (stream) {
      return await handleStreamResponse(targetResponse, model);
    } else {
      return await handleNonStreamResponse(targetResponse, model);
    }
  } catch (error) {
    console.error("Chat completion error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...getCorsHeaders() },
      }
    );
  }
}

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(),
      });
    }

    if (url.pathname === "/") {
      return new Response(
        JSON.stringify({
          status: "ok",
          message: "API is healthy",
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...getCorsHeaders() },
        }
      );
    }

    const sessions = parseAuthAndGetSessions(req, env);
    if (!sessions) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
          message: "Invalid or missing Authorization header"
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...getCorsHeaders() },
        }
      );
    }

    if (url.pathname === "/v1/models" && req.method === "GET") {
      return handleModelsRequest();
    }

    if (url.pathname === "/v1/chat/completions" && req.method === "POST") {
      return await handleChatCompletion(req, sessions, env);
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json", ...getCorsHeaders() },
    });
  }
};
