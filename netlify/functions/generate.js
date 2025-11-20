// netlify/functions/generate.js
// Função Netlify que recebe POST { message: "..."} e devolve { reply: "..." }

exports.handler = async function(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: JSON.stringify({ error: "Use POST" }) };
    }

    const body = JSON.parse(event.body || "{}");
    const message = (body.message || "").trim();

    if (!message) {
      return { statusCode: 400, body: JSON.stringify({ error: "Mensagem vazia" }) };
    }

    const OPENAI_KEY = process.env.OPENAI_KEY;
    if (!OPENAI_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: "OPENAI_KEY não definida" }) };
    }

    // OpenAI API (chat completions)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        max_tokens: 300
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return { statusCode: 500, body: JSON.stringify({ error: "Erro OpenAI", details: data }) };
    }

    const reply = data.choices?.[0]?.message?.content || "Sem resposta.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Erro interno", details: String(err) }) };
  }
};
