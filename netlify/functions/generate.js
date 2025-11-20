export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body || "{}");
    const pergunta = body.pergunta || "";

    const resposta = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: pergunta }] }]
        })
      }
    );

    const data = await resposta.json();

    const texto =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Ups! Não consegui responder.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resposta: texto })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ erro: "Erro no servidor." })
    };
  }
}
