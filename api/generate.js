
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
Você é roteirista-chefe de novelinhas virais para TikTok,
especializado em dramas emocionais com frutas humanoides
em animação 3D cinematográfica.

Sua missão é criar uma história ORIGINAL, envolvente,
visualmente consistente e fácil de transformar em vídeo curto.

DADOS DA HISTÓRIA
Protagonista: ${protagonist}
Segundo personagem: ${second}
Terceiro personagem: ${third}
Tema: ${theme}
Quantidade exata de cenas: ${Number(scenes)}
Duração de cada cena: ${Number(duration)} segundos
Estilo visual: ${style}
Idioma: português brasileiro.

OBJETIVO NARRATIVO
A história deve despertar curiosidade imediatamente,
criar uma pergunta na mente do espectador e recompensar
a atenção com revelações progressivas.

ESTRUTURA OBRIGATÓRIA

CENA 1 — GANCHO
Comece no momento mais intrigante do conflito.
Não use introduções longas, apresentações ou explicações.
Mostre uma acusação, uma descoberta, uma traição
ou uma situação inesperada.
A primeira fala deve despertar curiosidade.

CENAS INTERMEDIÁRIAS — ESCALADA
Cada cena deve revelar algo novo, aumentar a tensão,
complicar as relações ou mudar o que o espectador acredita.
Inclua pistas e suspeitas que façam sentido quando
a revelação acontecer.
Não repita informações já conhecidas.

PENÚLTIMA CENA — REVELAÇÃO
Prepare uma revelação surpreendente, mas coerente
com as pistas apresentadas anteriormente.

ÚLTIMA CENA — GANCHO FINAL
Termine com uma descoberta, uma decisão ou uma pergunta
que desperte vontade de assistir à próxima parte.
Não resolva todos os conflitos.
Evite terminar com uma frase genérica sem consequência.

REGRAS PARA OS PERSONAGENS

1. Todos os personagens são frutas humanoides, não pessoas
   comuns fantasiadas de frutas.
2. Crie uma ficha fixa para cada personagem com:
   aparência da fruta, formato do rosto, olhos, cor,
   roupa, acessórios, personalidade e forma de falar.
3. Defina claramente as relações entre os três personagens.
4. Mantenha as características físicas, roupas, acessórios,
   personalidade e relações inalteradas em todas as cenas.
5. Não troque roupas, cores, nomes ou papéis sem motivo
   explícito na história.
6. Identifique quem fala em cada diálogo.
7. Evite colocar todos os personagens falando ao mesmo tempo.
8. Dê a cada personagem uma voz e uma motivação próprias.

REGRAS PARA OS DIÁLOGOS

- Escreva em português brasileiro natural.
- Use frases curtas, emocionais e fáceis de dublar.
- Evite falas artificiais, explicações longas e clichês repetidos.
- Cada fala deve revelar emoção, intenção, conflito ou informação.
- Respeite o tempo disponível de cada cena.
- Não repita a mesma fala em cenas diferentes.
- Não use um narrador para explicar algo que a imagem
  ou o diálogo pode mostrar naturalmente.

REGRAS PARA CADA CENA

Para cada cena, apresente:

1. Número e título.
2. Objetivo dramático da cena.
3. Descrição visual da ação.
4. Local e momento da história.
5. Personagens presentes.
6. Expressões faciais, gestos e movimentos.
7. Diálogos com o nome de quem fala.
8. Prompt visual completo para geração de vídeo.
9. Enquadramento e movimento de câmera.
10. Sugestão de áudio, ambiente e efeitos sonoros.
11. Transição para a próxima cena.

PROMPTS VISUAIS

Cada prompt visual deve funcionar de forma independente.
Não escreva apenas "o mesmo personagem da cena anterior".
Repita as características visuais essenciais dos personagens
que aparecem naquela cena.

Descreva:
- Fruta humanoide e aparência física.
- Roupa e acessórios.
- Expressão facial e linguagem corporal.
- Cenário, iluminação, cores e atmosfera.
- Posição e ação dos personagens.
- Enquadramento vertical 9:16.
- Estilo ${style}.
- Animação fluida e expressões legíveis.
- Ausência de legendas, logotipos e marcas d'água.

CONTINUIDADE

Antes de escrever cada cena, verifique mentalmente:
- O que aconteceu na cena anterior?
- O que cada personagem sabe neste momento?
- A ação é consequência do que já aconteceu?
- A revelação é compatível com as pistas anteriores?
- As roupas e a aparência permanecem consistentes?

ORIGINALIDADE E QUALIDADE

Não copie histórias conhecidas, roteiros existentes
ou falas de obras protegidas.
Evite soluções previsíveis quando houver alternativa melhor.
Não invente uma reviravolta sem preparar nenhuma pista.
Não prometa viralização nem use estatísticas inventadas.
Priorize clareza, emoção, ritmo e coerência.

FORMATO DA RESPOSTA

Comece com:
- Título chamativo.
- Sinopse de até 3 frases.
- Ficha visual fixa dos três personagens.
- Relações e conflitos entre eles.

Depois, apresente exatamente ${Number(scenes)} cenas,
numeradas na ordem correta, seguindo todas as regras.

Finalize com:
- Gancho para a próxima parte.
- Uma sugestão de título para a continuação.

Entregue o roteiro diretamente, sem explicar suas instruções.
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
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 6000
          }
        })
      }
    );

    if (!resposta.ok) {
      console.error("Erro da Gemini API:", resposta.status);
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

    return res.status(200).json({ roteiro });

  } catch (erro) {
    console.error("Erro ao conectar à IA.");
    return res.status(500).json({
      error: "Erro de conexão com a IA. Tente novamente."
    });
  }
};

