// Master Pro Max 3.0 - Version Corrigée (Anti-Crash)
// Assure-toi que ce fichier est bien dans le dossier /netlify/functions/
exports.handler = async (event, context) => {
    // 1. Récupération des données (via URL params ou Body)
    const params = event.queryStringParameters;
    
    // 2. Préparation des données (valeurs par défaut si vide)
    const data = {
        production: parseFloat(params.production) || 0,
        tonnesVendues: parseFloat(params.tonnesVendues) || 0,
        tonnesRetour: parseFloat(params.tonnesRetour) || 0,
        prixVente: parseFloat(params.prixVente) || 0,
        prixRecup: parseFloat(params.prixRecup) || 0,
        coeffCimentPercent: parseFloat(params.coeffCimentPercent) || 0,
        coeffVariablePercent: parseFloat(params.coeffVariablePercent) || 0,
        coeffFixesPercent: parseFloat(params.coeffFixesPercent) || 0
    };

    // 3. Calculs
    const coutCiment = data.production * (data.coeffCimentPercent / 100);
    const coutVariable = data.production * (data.coeffVariablePercent / 100);
    const coutFixes = data.production * (data.coeffFixesPercent / 100);
    const totalCost = coutCiment + coutVariable + coutFixes;
    
    const revenue = (data.tonnesVendues * data.prixVente) + (data.tonnesRetour * data.prixRecup);
    const margeNet = revenue - totalCost;
    
    // Calcul taux de perte sécurisé
    let totalSorti = data.tonnesVendues + data.tonnesRetour;
    let tauxPerte = totalSorti > 0 ? (data.tonnesRetour / totalSorti) * 100 : 0;
    
    // 4. Logique d'alerte métier
    let statut = (tauxPerte > 15) ? "ALERT: Taux de perte élevé! Vérifier dosage." : "STATUS: Performance optimale.";

    // 5. Retour de la réponse en format JSON pour Netlify
    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            margeNet: margeNet.toFixed(2) + " DH",
            tauxPerte: tauxPerte.toFixed(2) + "%",
            statut: statut,
            details: {
                totalCost: totalCost.toFixed(2),
                revenue: revenue.toFixed(2)
            }
        })
    };
};
  validateNumericField,
};
