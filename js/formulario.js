// 🔹 URL do WebApp (Google Apps Script publicado como Web App)
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw5qCiMgH9BYbqDBm4_dMQ4iox7almaYpvsArqjCh-xLrs2A85sgkmWCB6eEIN8LoVL/exec";

// 🔹 Mapeamento dos departamentos
const GROUPS = {
  "PC 305": "305 - SERVIÇOS COMERCIAIS METROPOLITANA SUL",
  "PC 306": "306 - SERVIÇOS COMERCIAIS CONTAGEM",
  "PC 307": "307 - SERVIÇOS COMERCIAIS DIVINOPOLIS",
  "PC 321": "321 - PERFORMANCE COLOMBO",
  "PC 322": "322 - PERFORMANCE METROPOLITANA",
  "PC 348": "348 - GLOBAL PIMENTAS",
  "PC 357": "357 - CARTOGRAFIA RMR",
  "PC 360": "360 - DV GUARULHOS",
  "PC 363": "363 - FIDIC YELLOW",
  "PC 367": "367 - PERFORMANCE CAMPINA GRANDE",
  "PC 372": "372 - CALIBRAÇÃO DE MACROMEDIDOR RMSP",
  "PC 373": "373 - PROJETO OBRAS ESTRUTURAIS BENEDITO BENTES",
  "PC 377": "377 - SERVIÇOS COMERCIAIS RIBEIRÃO PRETO",
  "PC 383": "383 - PERFORMANCE SANEPAR LESTE",
  "PC 384": "384 - IGUÁ PARADA GUANDÚ",
  "PC 385": "385 - SANEPAR LOTE 2",
  "PC 387": "387 - DV MARINGÁ II",
  "PC 388": "388 - AGANOVA SANEPAR",
  "PC 389": "389 - CONSÓRCIO INTEGRA 2C",
  "PC 390": "390 - DV SAMAE SBS",
  "PC 391": "391 - JICA COMISSIONAMENTO DE DMCs",
  "PC 392": "392 - DV EXTREMO NORTE II",
  "PC 393": "393 - LEVANTAMENTO DE PERFIL DE CONSUMO",
  "PC 394": "394 - SANEPAR CALIBRAÇÃO",
  "PC 395": "395 - OPERAÇÃO REMOTA MOOCA",
  "PC 396": "396 - PERDAS SÃO BERNARDO"
};

// 🔹 Mapeamento dos responsáveis
const RESPONSAVEIS = {
  "PC 305": "EMANUEL", "PC 306": "EMANUEL", "PC 307": "EMANUEL",
  "PC 321": "JAMILLE", "PC 322": "MARIA CONCEIÇÃO",
  "PC 348": "EMANUEL", "PC 357": "MARIA CONCEIÇÃO", "PC 360": "ALESSANDRO",
  "PC 363": "MARIA CONCEIÇÃO", "PC 367": "MARIA CONCEIÇÃO", "PC 372": "ALESSANDRO",
  "PC 373": "GUSTAVO", "PC 377": "EMANUEL", "PC 383": "JAMILLE",
  "PC 384": "FLAVIO", "PC 385": "JAMILLE", "PC 387": "ALESSANDRO",
  "PC 388": "ALESSANDRO", "PC 389": "RAFAEL", "PC 390": "ALESSANDRO",
  "PC 391": "FERNANDA", "PC 392": "ALESSANDRO", "PC 393": "GUSTAVO",
  "PC 394": "ALESSANDRO", "PC 395": "SILVIO", "PC 396": "FERNANDA"
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Script carregado");

  const qs = new URLSearchParams(window.location.search);
  const contrato = qs.get("contrato")?.trim().toUpperCase();
  const token = qs.get("token")?.trim().toUpperCase();
  console.log("🔑 Token recebido:", token);
  console.log("📄 Contrato recebido:", contrato);

  const form = document.getElementById("nps-form");
  const statusBox = document.getElementById("status");
  document.getElementById("token").value = token || contrato || "";

  const container = document.getElementById("perguntas-container");

  let meusDepartamentos = [];

  if (contrato && GROUPS.hasOwnProperty(contrato)) {
    meusDepartamentos = [contrato];
  } else if (token) {
    meusDepartamentos = Object.keys(RESPONSAVEIS).filter(
      dep => RESPONSAVEIS[dep].toUpperCase() === token
    );
  }

  if (meusDepartamentos.length === 0) {
    container.innerHTML = `<p style="color: red;">❌ Nenhum projeto encontrado para esse parâmetro.</p>`;
    return;
  }

  meusDepartamentos.forEach(dep => {
    const depId = dep.replace(/\s+/g, "_").replace(/[|/]/g, "_");
    const nomeDepartamento = GROUPS[dep] || dep;
    const responsavel = RESPONSAVEIS[dep] || "Responsável não definido";

    const section = document.createElement("section");
    section.innerHTML = `
      <h2 style="font-size: 1.5rem; color: #050505; margin-bottom: 0.5rem;">${nomeDepartamento}</h2>
      <p style="margin-bottom: 1rem; font-weight: 500; color: #444;">Responsável: <strong>${responsavel}</strong></p>

      <label style="font-weight: 600;">1. Em uma escala de 0 a 10, qual seu nível de satisfação com Effico Saneamento, no tocante à gestão do projeto <strong>${nomeDepartamento}</strong>?</label>
      <div class="nps-scale" style="display: flex; flex-wrap: wrap; justify-content: space-between; margin: 1rem 0;">
        ${Array.from({ length: 11 }, (_, i) => `
          <label style="flex: 1 0 8%; text-align: center; font-size: 0.9rem;">
            ${i}<br>
            <input type="radio" name="nps_${depId}" value="${i}" required>
          </label>
        `).join("")}
      </div>

      <label for="comentario_${depId}" style="font-weight: 600;">2. Espaço para deixar elogios, sugestões e críticas sobre <strong>${nomeDepartamento}</strong>:</label>
      <textarea
        id="comentario_${depId}"
        name="comentario_${depId}"
        placeholder="Queremos te ouvir..."
        style="width: 100%; min-height: 120px; resize: vertical; box-sizing: border-box; padding: 12px; border-radius: 8px; border: 1px solid #ccc; font-size: 1rem; margin-top: 0.5rem;"
      ></textarea>
    `;
    container.appendChild(section);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusBox.textContent = "⏳ Enviando sua resposta...";
    statusBox.style.color = "black";

    const fd = new FormData(form);
    const body = new URLSearchParams();
    for (const [key, value] of fd.entries()) {
      body.append(key, value);
    }

    try {
      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: body.toString()
      });

      const result = await res.json();
      if (result.ok) {
        statusBox.style.color = "green";
        statusBox.textContent = "✅ Obrigado por responder! Sua opinião é muito importante para nós.";
        form.reset();
      } else {
        throw new Error(result.error || "Erro desconhecido");
      }
    } catch (err) {
      console.error("❌ Erro ao enviar:", err);
      statusBox.style.color = "red";
      statusBox.textContent = "❌ Ocorreu um erro ao enviar sua resposta. Por favor, tente novamente.";
    }
  });
});
