console.log("QMF result page loaded");

// read stored results
const result = JSON.parse(localStorage.getItem("qmfResult"));

if (!result) {
  document.getElementById("global-score").innerText = "No result found.";
} else {
  // max scores for each dimension (assuming each dimension has the same number of items)
  const maxScores = {
    P: 30,  // replace with actual max possible per dimension
    R: 30,
    C: 30
  };

  function interpretScore(score, max) {
    const pct = (score / max) * 100;
    if (pct <= 33) return "faible motivation";
    if (pct <= 66) return "motivation moyenne";
    return "forte motivation";
  }

  const P_label = interpretScore(result.P, maxScores.P);
  const R_label = interpretScore(result.R, maxScores.R);
  const C_label = interpretScore(result.C, maxScores.C);

  // compute global as average percentage of the three dimensions
  const globalPct = (result.P / maxScores.P + result.R / maxScores.R + result.C / maxScores.C) / 3;
  let globalLabel = "";
  if (globalPct <= 0.33) globalLabel = "faible motivation";
  else if (globalPct <= 0.66) globalLabel = "motivation moyenne";
  else globalLabel = "forte motivation";

  document.getElementById("global-score").innerText =
    `Global: ${Math.round(globalPct*100)} → ${globalLabel}`;

  document.getElementById("detail-scores").innerText =
    `Persévérance (P): ${result.P} → ${P_label}
Rapport au travail (R): ${result.R} → ${R_label}
Compétence perçue (C): ${result.C} → ${C_label}`;
}
