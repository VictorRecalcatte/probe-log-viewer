import { describe, it, expect } from "vitest";

function validarCampoObrigatorio(valor: string) {
  return valor.trim().length > 0;
}

function validarArquivoLog(nomeArquivo: string) {
  return nomeArquivo.endsWith(".log") || nomeArquivo.endsWith(".txt");
}

describe("Testes unitários de validação", () => {
  it("deve validar campo obrigatório preenchido", () => {
    expect(validarCampoObrigatorio("Inspeção 01")).toBe(true);
  });

  it("deve bloquear campo obrigatório vazio", () => {
    expect(validarCampoObrigatorio("")).toBe(false);
  });

  it("deve aceitar arquivo .log", () => {
    expect(validarArquivoLog("sondagem.log")).toBe(true);
  });

  it("deve aceitar arquivo .txt", () => {
    expect(validarArquivoLog("relatorio.txt")).toBe(true);
  });

  it("deve bloquear arquivo inválido", () => {
    expect(validarArquivoLog("imagem.png")).toBe(false);
  });
});
