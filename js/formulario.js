const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyBV3Qiy3zChmr3rq1PjmShWkFgdThLvguPL03EyKZ2pVo92StMAiTyj4y_MEvizhUe/exec";

// 🔹 Mapeamento dos departamentos
const GROUPS = {
  "PC 261": "CONSÓRCIO EFICIÊNCIA UBATUBA BZ-P19",
  "PC 289": "JICA SÃO VICENTE",
  "PC 298": "MONITORA CENTRO",
  "PC 304": "PERFORMANCE SUMARÉ",
  "PC 305": "SERVIÇOS COMERCIAIS METROPOLITANA SUL",
  "PC 306": "SERVIÇOS COMERCIAIS CONTAGEM",
  "PC 307": "SERVIÇOS COMERCIAIS DIVINOPOLIS",
  "PC 312": "PERFORMANCE JOÃO PESSOA",
  "PC 321": "PERFORMANCE COLOMBO",
  "PC 322": "PERFORMANCE METROPOLITANA",
  "PC 323": "DV MOOCA",
  "PC 324": "PERFORMANCE EXTREMO NORTE",
  "PC 325": "CONSÓRCIO SUSTENTABILIDADE OESTE",
  "PC 338": "PERFORMANCE BARUERI",
  "PC 348": "GLOBAL PIMENTAS",
  "PC 354": "PROJETO IFC-COPANOR",
  "PC 357": "CARTOGRAFIA RMR",
  "PC 360": "DV GUARULHOS",
  "PC 363": "FIDIC YELLOW",
  "PC 364": "INSPEÇÃO DE ESGOTOS METROPOLITANA",
  "PC 367": "PERFORMANCE CAMPINA GRANDE",
  "PC 372": "CALIBRAÇÃO DE MACROMEDIDOR RMSP",
  "PC 373": "PROJETO OBRAS ESTRUTURAIS BENEDITO BENTES",
  "PC 377": "SERVIÇOS COMERCIAIS RIBEIRÃO PRETO",
  "PC 379": "SETORIZAÇÃO RJ LOTES 1 E 2",
  "PC 381": "AFERIÇÃO MACRO BRK ALAGOAS RMM",
  "PC 382": "AESAN IMPLANTAÇÃO DE MACROS E VÁLVULAS",
  "PC 383": "PERFORMANCE SANEPAR LESTE",
  "PC 384": "IGUÁ PARADA GUANDÚ",
  "PC 385": "SANEPAR LOTE 2",
  "PC 386": "DV AEGEA RJ",
  "PC 387": "DV MARINGÁ II",
  "PC 388": "AGANOVA SANEPAR",
  "PC 389": "CONSÓRCIO INTEGRA 2C",
  "PC 390": "DV SAMAE SBS",
  "PC 391": "JICA COMISSIONAMENTO DE DMCs",
  "PC 392": "DV EXTREMO NORTE II",
  "PC 393": "LEVANTAMENTO DE PERFIL DE CONSUMO",
  "PC 394": "SANEPAR CALIBRAÇÃO",
  "PC 395": "OPERAÇÃO REMOTA MOOCA",
  "PC 396": "PERDAS SÃO BERNARDO"
};

// 🔹 Mapeamento dos responsáveis
const RESPONSAVEIS = {
  "PC 261": "EMANUEL", "PC 289": "EMANUEL", "PC 298": "EMANUEL",
  "PC 304": "JAMILLE", "PC 305": "EMANUEL", "PC 306": "EMANUEL",
  "PC 307": "EMANUEL", "PC 312": "MARIA CONCEIÇÃO", "PC 321": "JAMILLE",
  "PC 322": "MARIA CONCEIÇÃO", "PC 323": "EMANUEL", "PC 324": "EMANUEL",
  "PC 325": "EMANUEL", "PC 338": "EMANUEL", "PC 348": "EMANUEL",
  "PC 354": "EMANUEL", "PC 357": "MARIA CONCEIÇÃO", "PC 360": "ALESSANDRO",
  "PC 363": "MARIA CONCEIÇÃO", "PC 364": "EMANUEL", "PC 367": "MARIA CONCEIÇÃO",
  "PC 372": "ALESSANDRO", "PC 373": "GUSTAVO", "PC 377": "EMANUEL",
  "PC 379": "FLAVIO", "PC 381": "GUSTAVO", "PC 382": "FLAVIO",
  "PC 383": "JAMILLE", "PC 384": "FLAVIO", "PC 385": "JAMILLE",
  "PC 386": "JAMILLE", "PC 387": "ALESSANDRO", "PC 388": "ALESSANDRO",
  "PC 389": "RAFAEL", "PC 390": "ALESSANDRO", "PC 391": "FERNANDA",
  "PC 392": "ALESSANDRO", "PC 393": "GUSTAVO", "PC 394": "ALESSANDRO",
  "PC 395": "SILVIO", "PC 396": "FERNANDA"
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Script carregado");

  const qs = new URLSearchParams(window.location.search);
  const token = qs.get("token")?.trim().toUpperCase() || "";
  console.log("🔑 Token recebido:", token);

  const form = document.getElementById("nps-form");
  const statusBox = document.getElementById("status");

  document.getElementById("token").value = token;

  const container = document.getElementById("perguntas-container");
  const outrosDepartamentos = Object.keys(GROUPS).filter(dep => dep !== token);
  console.log("📋 Departamentos a avaliar:", outrosDepartamentos);

  outrosDepartamentos.forEach(dep => {
    const depId = dep.replace(/\s+/g, "_").replace(/[|/]/g, "_");
    const nomeDepartamento = GROUPS[dep] || dep;
    const responsavel = RESPONSAVEIS[dep] || "Responsável não definido";

    const section = document.createElement("section");
    section.innerHTML = `
      <h2 style="font-size: 1.5rem; color: #050505ff; margin-bottom: 0.5rem;">${nomeDepartamento}</h2>
      <p style="margin-bottom: 1rem; font-weight: 500; color: #444;">Responsável: <strong>${responsavel}</strong></p>

      <label style="font-weight: 600;">1. Em uma escala de 0 a 10, qual seu nível de satisfação com o <strong>${nomeDepartamento}</strong>?</label>
      <div class="nps-scale" style="display: flex; flex-wrap: wrap; justify-content: space-between; margin: 1rem 0;">
        ${Array.from({ length: 11 }, (_, i) => `
          <label style="flex: 1 0 8%; text-align: center; font-size: 0.9rem;">
            ${i}<br>
            <input type="radio" name="nps_${depId}" value="${i}" ${i === 0 ? 'required' : ''}>
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

    statusBox.textContent = "Enviando...";
    statusBox.className = "";

    const fd = new FormData(form);
    const body = new URLSearchParams(fd);

    try {
      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        body: body.toString(),
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        }
      });

      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }

      const data = await res.json().catch(() => null);
      console.log("✅ Resposta recebida:", data);

      statusBox.textContent = "✔️ Formulário enviado com sucesso!";
      statusBox.className = "success";
      form.reset();
    } catch (err) {
      console.error("❌ Erro ao enviar:", err);
      statusBox.textContent = "Erro ao enviar. Tente novamente.";
      statusBox.className = "error";
    }
  });
});
