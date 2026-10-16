
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
Você é diretor de arte e roteirista de animações 3D com frutas humanoides.
Crie uma história com os personagens selecionados, mantendo a identidade visual de cada fruta rigorosamente consistente em todas as cenas.
PERSONAGENS
Protagonista: ${protagonist}
Segundo personagem: ${second}
Terceiro personagem: ${third}
Tema: ${theme}
Quantidade de cenas: ${Number(scenes)}
Duração por cena: ${Number(duration)} segundos
Estilo visual: ${style}
Idioma: português brasileiro.
REGRA PRINCIPAL: BÍBLIA VISUAL
Antes de escrever as cenas, crie uma ficha visual definitiva para cada um dos três personagens.
Para cada fruta, defina:
1. Espécie e formato exato da fruta.
2. Cor principal e detalhes de textura.
3. Formato do rosto, olhos, sobrancelhas e boca.
4. Tipo de corpo, proporções e altura relativa.
5. Roupa completa, cores e calçados.
6. Acessórios permanentes.
7. Personalidade e expressões características.
8. Voz e maneira de falar.
As características visuais devem ser específicas.
Exemplo de especificidade: "Morango vermelho com pequenas
sementes douradas, olhos grandes castanhos, jaqueta azul-marinho,
calça branca e tênis vermelhos".
Esse exemplo é apenas ilustrativo. Crie características
originais adequadas à história.
Depois de definir a ficha visual, considere-a imutável
durante toda a história.
REGRAS DE CONTINUIDADE VISUAL
IDENTIDADE VISUAL FIXA DOS PERSONAGENS
Crie uma ficha visual definitiva para cada personagem
antes de começar a escrever as cenas.
Para cada fruta, defina obrigatoriamente:
- Espécie e formato da fruta.
- Cor principal e detalhes da superfície.
- Formato do rosto e tamanho dos olhos.
- Cor dos olhos e formato das sobrancelhas.
- Boca, nariz, braços, mãos, pernas e proporções.
- Roupa completa, incluindo cores e calçados.
- Acessórios permanentes.
- Altura relativa aos outros personagens.
- Personalidade e expressões características.

REGRAS DE IDENTIDADE

1. Cada personagem deve possuir uma aparência original
   e facilmente reconhecível.
2. Depois de definir a ficha, não altere suas características
   físicas ou roupas durante a história.
3. Em todas as cenas, copie as características da ficha
   dos personagens presentes sem resumir ou reinterpretar.
4. Mude apenas expressões, poses, movimentos e emoções
   conforme a ação narrativa.
5. Não invente acessórios, roupas ou cores adicionais.
6. Cada prompt visual deve funcionar de forma independente.
7. Não use expressões como "igual à cena anterior".
8. Mantenha o mesmo estilo de animação 3D em todas as cenas.
9. Use enquadramento vertical 9:16.
10. Antes de entregar, confira a consistência de cada personagem
    em todas as cenas.

- Nunca mude a cor, a espécie ou o formato do personagem.
- Nunca troque roupas, calçados ou acessórios permanentes.
- Mantenha os mesmos olhos, rosto, proporções e textura.
- Não transforme uma fruta em outra espécie.
- Não altere a idade aparente ou o estilo de animação.
- Preserve a altura relativa entre os personagens.
- Mantenha os mesmos detalhes visuais mesmo em closes.
- Emoções podem mudar; a identidade física não.
- Se uma cena ocorrer em outro local, altere o cenário,
  não a aparência dos personagens.
- Só permita mudanças de roupa quando forem explicitamente
  solicitadas na história; nesse caso, descreva a mudança
  e mantenha-a nas cenas seguintes.
ESTRUTURA DA HISTÓRIA
Cena 1:
Comece com um acontecimento intrigante, uma descoberta,
uma acusação ou um conflito imediato.
Cenas intermediárias:
Desenvolva o conflito progressivamente. Cada cena deve
acrescentar informação, emoção ou consequência.
Penúltima cena:
Prepare uma revelação surpreendente, coerente com as pistas.
Última cena:
Termine com uma revelação ou decisão que desperte curiosidade
para a próxima parte.
Não repita diálogos nem crie cenas sem função narrativa.
FORMATO DE SAÍDA
REGRA OBRIGATÓRIA DE QUANTIDADE DE CENAS
Gere exatamente ${Number(scenes)} cenas completas.
Numere-as de CENA 1 até CENA ${Number(scenes)}, sem pular números.
Cada cena deve conter ação, diálogo e prompt visual completo.
A ficha dos personagens e a sinopse não contam como cenas.
Não encerre a resposta antes da última cena.
A última cena deve ser a CENA ${Number(scenes)}.
Mantenha a aparência e as roupas dos personagens consistentes.
Comece com:
1. Título da história.
2. Sinopse curta.
3. BÍBLIA VISUAL DOS PERSONAGENS.
4. Uma ficha individual e detalhada para cada fruta.
Depois, apresente exatamente ${Number(scenes)} cenas.
Em cada cena, informe:
- Número e título.
- Objetivo narrativo.
- Local e ação.
- Personagens presentes.
- Expressões e movimentos.
- Diálogos em português brasileiro.
- Prompt visual completo para geração de vídeo.
- Enquadramento e movimento de câmera.
- Sugestão de áudio e efeitos sonoros.
- Transição para a cena seguinte.
REGRAS PARA OS PROMPTS VISUAIS
Cada prompt precisa funcionar independentemente.
Não escreva apenas "mesmo personagem da cena anterior".
Em cada prompt visual, repita integralmente as características
físicas e as roupas de todos os personagens presentes,
conforme definidas na Bíblia Visual.
Descreva também:
- Posição e ação de cada personagem.
- Expressão facial e linguagem corporal.
- Cenário, iluminação e atmosfera.
- Enquadramento vertical 9:16.
- Estilo ${style}.
- Animação fluida e detalhes cinematográficos.
- Ausência de legendas, logotipos e marcas d'água.
Evite incluir personagens que não participam da cena.
Não permita que o gerador invente roupas ou acessórios
diferentes dos especificados.
CONTROLE FINAL DE QUALIDADE
Antes de responder, confira:
1. A quantidade de cenas está correta?
2. Cada fruta mantém a mesma aparência?
3. As roupas e os acessórios continuam iguais?
4. Os prompts descrevem os personagens de forma completa?
5. Os acontecimentos e os diálogos são coerentes?
6. Cada cena contribui para a história?
Se encontrar alguma inconsistência, corrija-a antes
de entregar o roteiro.
Entregue o roteiro completo em português brasileiro,
com seções bem identificadas e pronto para ser usado
na produção de vídeos curtos.
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
            maxOutputTokens: 10000
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

