
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido."
    });
  }

  try {
    const token = process.env.HF_TOKEN;

    if (!token) {
      return res.status(500).json({
        error: "A variável HF_TOKEN não está configurada."
      });
    }

    const prompt = req.body?.prompt;

    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        error: "Informe uma descrição para a imagem."
      });
    }

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-3-medium-diffusers",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt.trim().slice(0, 2000),
          parameters: {
            width: 768,
            height: 768,
            num_inference_steps: 25
          }
        })
      }
    );

    if (!response.ok) {
      const details = await response.text();
      console.error("Hugging Face:", response.status, details);

      return res.status(502).json({
        error: "Não foi possível gerar a imagem. Verifique o acesso ao modelo e os créditos disponíveis."
      });
    }

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.startsWith("image/")) {
      return res.status(502).json({
        error: "O serviço não retornou uma imagem válida."
      });
    }

    const image = Buffer.from(await response.arrayBuffer());

    return res.status(200).json({
      image: `data:${contentType};base64,${image.toString("base64")}`
    });
  } catch (error) {
    console.error("Erro ao gerar imagem:", error);

    return res.status(500).json({
      error: "Ocorreu um erro ao gerar a imagem."
    });
  }
}
