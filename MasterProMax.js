/**
 * MASTER PRO MAX 3.0 – FINAL EDITION
 * Calcule la marge nette, le taux de perte et génère des alertes métier.
 * Prêt pour intégration n8n / Webhook / Node.js.
 */

function validateNumericField(value, fieldName) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`Le champ \`${fieldName}\` doit être un nombre valide.`);
  }
  return value;
}

function calculateMargePro(data) {
  const production = validateNumericField(data.production, 'production');
  const tonnesVendues = validateNumericField(data.tonnesVendues, 'tonnesVendues');
  const tonnesRetour = validateNumericField(data.tonnesRetour, 'tonnesRetour');
  const prixVente = validateNumericField(data.prixVente, 'prixVente');
  const prixRecup = validateNumericField(data.prixRecup, 'prixRecup');
  const coeffCimentPercent = validateNumericField(data.coeffCimentPercent, 'coeffCimentPercent');
  const coeffVariablePercent = validateNumericField(data.coeffVariablePercent, 'coeffVariablePercent');
  const coeffFixesPercent = validateNumericField(data.coeffFixesPercent, 'coeffFixesPercent');

  // 1. حساب التكاليف
  const totalCost = (production * (coeffCimentPercent / 100)) +
                    (production * (coeffVariablePercent / 100)) +
                    (production * (coeffFixesPercent / 100));

  // 2. حساب المداخيل
  const revenu = (tonnesVendues * prixVente) + (tonnesRetour * prixRecup);

  // 3. النتيجة
  const margeNet = revenu - totalCost;
  const totalTonnes = tonnesVendues + tonnesRetour;
  const tauxPerte = totalTonnes > 0
    ? (tonnesRetour / totalTonnes) * 100
    : 0;

  // 4. الـ Logic د "الخبير" (الـ Alert)
  const statut = tauxPerte > 15
    ? 'ALERT: Taux de perte élevé! Vérifier le dosage.'
    : 'STATUS: Performance optimale.';

  return {
    margeNet,
    tauxPerte: Number(tauxPerte.toFixed(2)),
    tauxPerteLabel: `${tauxPerte.toFixed(2)}%`,
    statut,
    totalCost,
    revenu,
  };
}

if (require.main === module) {
  const result = calculateMargePro({
    production: 1200,
    tonnesVendues: 950,
    tonnesRetour: 250,
    prixVente: 1350,
    prixRecup: 380,
    coeffCimentPercent: 55,
    coeffVariablePercent: 22,
    coeffFixesPercent: 18,
  });

  console.log(result);
}

module.exports = {
  calculateMargePro,
  validateNumericField,
};
