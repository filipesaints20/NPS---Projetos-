// 🔹 URL do WebApp (Google Apps Script publicado como Web App)
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzSjFVfbOSmxUGUomGthKAh3ynY69h0Y_FQdsGhGVItNW3NUUJKFPMrldsEpgsqhfqr/exec";

// 🔹 Mapeamento dos departamentos
const GROUPS = {
  "PC 305": "SERVIÇOS COMERCIAIS METROPOLITANA SUL",
  "PC 306": "SERVIÇOS COMERCIAIS CONTAGEM",
  "PC 307": "SERVIÇOS COMERCIAIS DIVINOPOLIS",
  "PC 321": "PERFORMANCE COLOMBO",
  "PC 322": "PERFORMANCE METROPOLITANA",
  "PC 348": "GLOBAL PIMENTAS",
  "PC 357": "CARTOGRAFIA RMR",
  "PC 360": "DV GUARULHOS",
  "PC 363": "FIDIC YELLOW",
  "PC 367": "PERFORMANCE CAMPINA GRANDE",
  "PC 372": "CALIBRAÇÃO DE MACROMEDIDOR RMSP",
  "PC 373": "PROJETO OBRAS ESTRUTURAIS BENEDITO BENTES",
  "PC 377": "SERVIÇOS COMERCIAIS RIBEIRÃO PRETO",
  "PC 383": "PERFORMANCE SANEPAR LESTE",
  "PC 385": "SANEPAR LOTE 2",
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
  "PC 305": "EMANUEL", "PC 306": "EMANUEL", "PC 307": "EMANUEL",
  "PC 321": "JAMILLE", "PC 322": "MARIA CONCEIÇÃO",
  "PC 348": "EMANUEL", "PC 357": "MARIA CONCEIÇÃO", "PC 360": "ALESSANDRO",
  "PC 363": "MARIA CONCEIÇÃO", "PC 367": "MARIA CONCEIÇÃO", "PC 372": "ALESSANDRO",
  "PC 373": "GUSTAVO", "PC 377": "EMANUEL", "PC 383": "JAMILLE",
  "PC 385": "JAMILLE", "PC 387": "ALESSANDRO", "PC 388": "ALESSANDRO",
  "PC 389": "RAFAEL", "PC 390": "ALESSANDRO", "PC 391": "FERNANDA",
  "PC 392": "ALESSANDRO", "PC 393": "GUSTAVO", "PC 394": "ALESSANDRO",
  "PC 395": "SILVIO", "PC 396": "FERNANDA"
};

// 🔹 Nome da aba da planilha
const SHEET_NAME = "Respostas";

// 🔹 Função para garantir a aba e cabeçalhos
function ensureSheet() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);

  const headers = ["Timestamp", "Departamento", "Responsável", "NPS", "Comentário"];
  const range = sh.getRange(1, 1, 1, headers.length);
  const values = range.getValues()[0];
  if (values.filter(String).length === 0) {
    range.setValues([headers]);
  }
  return sh;
}

// 🔹 Verificação simples via GET
function doGet(e) {
  return ContentService
    .createTextOutput("✅ WebApp rodando")
    .setMimeType(ContentService.MimeType.TEXT);
}

// 🔹 Registro de respostas via POST
function doPost(e) {
  try {
    const params = e.parameter || {};
    const token = (params.token || "").trim().toUpperCase();

    // 🔹 Validar se o token é um responsável válido
    const responsavelValido = Object.values(RESPONSAVEIS).some(r => r.toUpperCase() === token);
    if (!responsavelValido) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: "Responsável inválido" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const sh = ensureSheet();
    const respostasRegistradas = [];

    for (const key in params) {
      if (key.startsWith("nps_")) {
        const depKey = key.replace("nps_", "").replace(/_/g, " ").toUpperCase();
        const comentarioKey = "comentario_" + key.replace("nps_", "");
        const nps = params[key].trim();
        const comentario = (params[comentarioKey] || "").trim();

        const nomeDepartamento = GROUPS[depKey] || depKey;

        sh.appendRow([
          new Date(),
          nomeDepartamento,
          token,
          nps,
          comentario
        ]);

        respostasRegistradas.push(nomeDepartamento);
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        ok: true,
        message: "Respostas registradas com sucesso.",
        responsavel: token,
        total: respostasRegistradas.length,
        departamentos: respostasRegistradas
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

