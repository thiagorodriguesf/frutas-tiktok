
module.exports = async function handler(req, res) {
  // Aceitar apenas solicitações POST.
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido."
    });
  }

  // A chave fica no servidor, nunca no navegador.
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "A chave da IA não está configurada no servidor."
    });
  }

  const body = req.body || {};

  const {
    protagonist,
    second,
    third,
    theme,
    scenes,
    style,
    duration
  } = body;

  const frutas = [
    "Morango", "Banana", "Maçã", "Abacaxi",
    "Uva", "Melancia", "Limão", "Cereja"
  ];

  const temas = [
    "traição", "vingança", "segredo",
    "romance", "ciúmes", "herança"
  ];

  const estilos = [
    "Animação 3D cinematográfica",
    "Filme de animação realista",
    "Desenho 3D colorido",
    "Novela dramática com iluminação cinematográfica"
  ];

  if (
    !frutas.includes(protagonist) ||
    !frutas.includes(second) ||
    !frutas.includes(third) ||
    new Set([protagonist, second, third]).size !== 3 ||
    !temas.includes(theme) ||
    ![5, 7, 10].includes(Number(scenes)) ||
    !estilos.includes(style) ||
    ![5, 8, 10].includes(Number(duration))
  ) {
    return res.status(400).json({
      error: "Verifique os personagens e as opções escolhidas."
    });
  }

  const prompt = `
Você é roteirista profissional de novelinhas virais
para TikTok, com frutas humanoides como personagens.

Crie uma história ORIGINAL em português brasileiro.

PERSONAGENS:
- Protagonista: ${protagonist}
- Segundo personagem: ${second}
- Terceiro personagem: ${third}

TEMA: ${theme}
QUANTIDADE: ${Number(scenes)} cenas
DURAÇÃO POR CENA: ${Number(duration)} segundos
ESTILO VISUAL: ${style}

REGRAS:
1. Crie uma trama com começo, conflito e desfecho.
2. Dê personalidade própria a cada personagem.
3. Escreva diálogos naturais, emocionantes e originais.
4. Faça cada cena avançar a história.
5. Inclua uma reviravolta surpreendente.
6. Termine com um gancho que desperte curiosidade.
7. Mantenha a aparência dos personagens consistente.
8. Para cada cena, informe:
   - Número e título.
   - Ação visual.
   - Expressões e movimentos.
   - Diálogos identificados por personagem.
   - Prompt visual detalhado para vídeo vertical 9:16.
   - Sugestão de áudio e efeitos sonoros.

Não repita a mesma frase em cenas diferentes.
Entregue somente o roteiro completo.
`;

  try {
    const resposta = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 6000
          }
        })
      }
    );

    if (!resposta.ok) {
      console.error(
        "Erro da Gemini API:",
        resposta.status
      );

      return res.status(502).json({
        error: "A IA não conseguiu gerar o roteiro. Tente novamente."
      });
    }

    const dados = await resposta.json();

    const roteiro = dados.candidates?.[0]?.content?.parts
      ?.map(parte => parte.text || "")
      .join("")
      .trim();

    if (!roteiro) {
      return res.status(502).json({
        error: "A IA não retornou um roteiro. Tente novamente."
      });
    }

    return res.status(200).json({
      roteiro: roteiro
    });

  } catch (erro) {
    console.error("Erro ao conectar à IA.");

    return res.status(500).json({
      error: "Erro de conexão com a IA. Tente novamente."
    });
  }
};
