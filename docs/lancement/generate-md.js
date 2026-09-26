// Génère ROADMAP.md à partir de roadmap-data.js : node docs/lancement/generate-md.js
const fs = require("fs");
const path = require("path");
const R = require("./roadmap-data.js");

const OWN = { M: "Moi", S: "Simon", D: "Les deux" };
const PRIO = ["P0 Critique", "P1 Haute", "P2 Moyenne", "P3 Plus tard"];
const DIF = ["", "Facile", "Moyenne", "Difficile"];
const TASKS = {};
R.cats.forEach((c) => c.tasks.forEach((t) => (TASKS[t.id] = t)));

const out = [];
const total = Object.keys(TASKS).length;
out.push("# Comme à la maison : plan de lancement");
out.push("");
out.push(`> Fichier généré depuis \`roadmap-data.js\` (version ${R.version}). ${total} tâches, ${R.cats.length} catégories.`);
out.push("> La version interactive (cases à cocher, dépendances, tableau de bord) est `index.html`.");
out.push("");
out.push("Légende : **P0** bloque le lancement · **P1** haute · **P2** moyenne · **P3** plus tard. Échéance en jours après le démarrage (J+n). Une tâche ne peut commencer que lorsque ses prérequis sont terminés.");
out.push("");

out.push("## Les 10 priorités absolues");
out.push("");
R.top10.forEach((x, i) => out.push(`${i + 1}. **${x.id} · ${TASKS[x.id].t}** : ${x.why}`));
out.push("");

out.push("## Timeline 30 / 60 / 90 jours");
out.push("");
R.timeline.forEach((p) => {
  out.push(`### ${p.label} : ${p.title}`);
  out.push("");
  out.push(p.goal);
  out.push("");
  p.milestones.forEach((m) => out.push(`- ${m}`));
  out.push("");
});

R.phases.forEach((ph) => {
  out.push(`## Phase ${ph.id} : ${ph.name} (${ph.span})`);
  out.push("");
  R.cats.filter((c) => c.phase === ph.id).forEach((c) => {
    out.push(`### ${c.id} · ${c.name}`);
    out.push("");
    out.push(`_${c.intro}_`);
    out.push("");
    c.tasks.forEach((t) => {
      out.push(`- [ ] **${t.id} · ${t.t}**${t.opt ? " _(option B : carte G uniquement)_" : ""}`);
      out.push(`  - ${t.d}`);
      out.push(`  - Pourquoi : ${t.w}`);
      out.push(`  - ${PRIO[t.p]} · ${DIF[t.dif]} · ${t.dur} · J+${t.j} · Responsable : ${OWN[t.own]}`);
      out.push(`  - Prérequis : ${t.dep.length ? t.dep.join(", ") : "aucun"}`);
      out.push(`  - Outils : ${t.tools} · Coût : ${t.cost}`);
      out.push(`  - Livrable : ${t.liv}`);
    });
    out.push("");
    out.push("**Vérifications avant de clore la catégorie**");
    out.push("");
    c.checks.forEach((x) => out.push(`- [ ] ${x}`));
    out.push("");
    out.push("**Erreurs fréquentes**");
    out.push("");
    c.pieges.forEach((x) => out.push(`- ${x}`));
    out.push("");
    out.push("**Optimisations**");
    out.push("");
    c.tips.forEach((x) => out.push(`- ${x}`));
    out.push("");
  });
});

out.push("## Checklists");
out.push("");
R.checklists.forEach((cl) => {
  out.push(`### ${cl.name}`);
  out.push("");
  out.push(cl.intro);
  out.push("");
  cl.groups.forEach((g) => {
    out.push(`**${g.name}**`);
    out.push("");
    g.items.forEach((x) => out.push(`- [ ] ${x}`));
    out.push("");
  });
});

out.push("## Tableau de bord : KPI");
out.push("");
out.push(`| Indicateur | Groupe | Calcul | Fréquence | ${R.kpiHorizons.join(" | ")} |`);
out.push(`|---|---|---|---|${R.kpiHorizons.map(() => "---:").join("|")}|`);
R.kpis.forEach((k) => {
  const u = k.unit ? ` ${k.unit}` : "";
  out.push(`| ${k.name} | ${k.group} | ${k.formula} | ${k.freq} | ${k.targets.map((t) => t.toLocaleString("fr-FR") + u).join(" | ")} |`);
});
out.push("");

out.push("## Budget de lancement (estimations HT)");
out.push("");
out.push("| Poste | Bas | Haut |");
out.push("|---|---:|---:|");
let bmin = 0, bmax = 0;
R.budget.forEach((b) => {
  bmin += b.min; bmax += b.max;
  out.push(`| ${b.poste} | ${b.min.toLocaleString("fr-FR")} € | ${b.max.toLocaleString("fr-FR")} € |`);
});
out.push(`| **Total** | **${bmin.toLocaleString("fr-FR")} €** | **${bmax.toLocaleString("fr-FR")} €** |`);
out.push("");

out.push("## Scripts commerciaux");
out.push("");
R.scripts.forEach((s) => {
  out.push(`### ${s.name}`);
  out.push("");
  out.push("```text");
  out.push(s.body);
  out.push("```");
  out.push("");
});

out.push("## Réponses aux objections");
out.push("");
R.objections.forEach((o) => {
  out.push(`**${o.q}**`);
  out.push("");
  out.push(o.a);
  out.push("");
});

out.push("---");
out.push("");
out.push("Les montants, seuils et règles cités sont indicatifs (septembre 2026). Faites valider les points juridiques, fiscaux et réglementaires par un avocat, l'expert-comptable et les mairies concernées.");
out.push("");

fs.writeFileSync(path.join(__dirname, "ROADMAP.md"), out.join("\n"));
console.log(`ROADMAP.md : ${total} tâches`);
