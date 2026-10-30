#!/usr/bin/env node
// Valida docs/data/sistema.json e gera docs/data/sistema.js.
//
// A página lê o JSON por fetch(). Aberta direto do disco (file://) o navegador
// bloqueia o fetch, então ela usa sistema.js como alternativa. Só é preciso
// rodar este script depois de editar o JSON: com um servidor local
// a página lê o JSON direto; com duplo clique, lê o .js.
//   node tools/gen_sistema_js.mjs           valida e gera o .js
//   node tools/gen_sistema_js.mjs --check   só confere se o .js está em dia
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "docs", "data");
const SRC = join(dir, "sistema.json");
const DST = join(dir, "sistema.js");

function validate(data) {
  const errs = [];
  const kinds = new Set(data.kinds ?? []);
  const graphs = data.graphs ?? {};
  if (!Object.keys(graphs).length) errs.push("sem 'graphs'");
  for (const [gid, g] of Object.entries(graphs)) {
    const ids = (g.nodes ?? []).map((n) => n.id);
    if (new Set(ids).size !== ids.length) errs.push(`${gid}: ids de nó repetidos`);
    for (const n of g.nodes ?? []) {
      if (!kinds.has(n.kind)) errs.push(`${gid}: nó '${n.id}' com kind inválido '${n.kind}'`);
      // origem (opcional): de onde vem o bloco em relação à versão anterior.
      if (n.origem !== undefined && !["importado", "adaptado", "novo"].includes(n.origem))
        errs.push(`${gid}: nó '${n.id}' com origem inválida '${n.origem}' (use importado, adaptado ou novo)`);
    }
    for (const e of g.edges ?? [])
      for (const end of ["from", "to"])
        if (!ids.includes(e[end])) errs.push(`${gid}: aresta aponta para nó inexistente '${e[end]}'`);
    if (!["UD", "LR"].includes(g.direction ?? "UD")) errs.push(`${gid}: direction deve ser UD ou LR`);
  }
  return errs;
}

const data = JSON.parse(readFileSync(SRC, "utf8"));
const errs = validate(data);
if (errs.length) {
  console.error(errs.map((e) => "erro: " + e).join("\n"));
  process.exit(1);
}
const out =
  "// Gerado por tools/gen_sistema_js.mjs a partir de sistema.json. Não edite.\n" +
  "window.SISTEMA_GRAFOS = " + JSON.stringify(data) + ";\n";

if (process.argv.includes("--check")) {
  if (!existsSync(DST) || readFileSync(DST, "utf8") !== out) {
    console.error("sistema.js desatualizado: rode node tools/gen_sistema_js.mjs");
    process.exit(1);
  }
  console.log("ok");
} else {
  writeFileSync(DST, out);
  console.log(`gerado sistema.js (${Object.keys(data.graphs).length} grafos)`);
}
