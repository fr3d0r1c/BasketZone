// Charger les données depuis le fichier JSON
$.getJSON('../../fichiers_json/Classement/classement_lnb.json', function(data) {
    // Trier les données par plusieurs critères successivement
    data.sort(function(a, b) {
        // Convertir les pourcentages en nombre flottant
        var aWinPercentage = parseFloat(a.winPercentage.replace('%', ''));
        var bWinPercentage = parseFloat(b.winPercentage.replace('%', ''));

        // Trier par pourcentage de victoire (en ordre décroissant)
        if (bWinPercentage !== aWinPercentage) {
            return bWinPercentage - aWinPercentage; // Tri décroissant
        }

        // Si les pourcentages de victoire sont égaux, on compare les points marqués (PTS+)
        var aPTSplus = parseInt(a.pts_scored, 10);
        var bPTSplus = parseInt(b.pts_scored, 10);
        if (bPTSplus !== aPTSplus) {
            return bPTSplus - aPTSplus; // Tri décroissant
        }

        // Si les points marqués sont égaux, on compare les points concédés (PTS-)
        var aPTSminus = parseInt(a.pts_conceed, 10);
        var bPTSminus = parseInt(b.pts_conceed, 10);
        if (bPTSminus !== aPTSminus) {
            return bPTSminus - aPTSminus; // Tri décroissant
        }

        // Si les points concédés sont égaux, on compare la moyenne des points marqués (MoyPTS+)
        var aMoyPTSplus = parseFloat(a.moy_pts_scored);
        var bMoyPTSplus = parseFloat(b.moy_pts_scored);
        if (bMoyPTSplus !== aMoyPTSplus) {
            return bMoyPTSplus - aMoyPTSplus; // Tri décroissant
        }

        // Si la moyenne des points marqués est égale, on compare la moyenne des points concédés (MoyPTS-)
        var aMoyPTSminus = parseFloat(a.moy_pts_conceed);
        var bMoyPTSminus = parseFloat(b.moy_pts_conceed);
        return bMoyPTSminus - aMoyPTSminus; // Tri décroissant
    });

    // Remplir le tableau avec les données triées
    var tableBody = $('#lnb-ranking tbody');
    tableBody.empty(); // Effacer le contenu existant du tableau

    data.forEach(function(team, index) {
        var row = $('<tr>'); // Créer une nouvelle ligne pour chaque équipe
        row.append('<td>' + (index + 1) + '</td>'); // Ajouter la position
        row.append('<td>' + team.team + '</td>'); // Ajouter le nom de l'équipe
        row.append('<td>' + team.winPercentage + '</td>'); // Ajouter le pourcentage de victoire
        row.append('<td>' + team.g + '</td>'); // Ajouter le nombre total de matchs joués
        row.append('<td>' + team.w + '</td>'); // Ajouter le nombre de victoires
        row.append('<td>' + team.l + '</td>'); // Ajouter le nombre de défaites
        row.append('<td>' + team.hWin + '</td>'); // Ajouter les victoires à domicile
        row.append('<td>' + team.hLoss + '</td>'); // Ajouter les défaites à domicile
        row.append('<td>' + team.aWin + '</td>'); // Ajouter les victoires à l'extérieur
        row.append('<td>' + team.aLoss + '</td>'); // Ajouter les défaites à l'extérieur
        row.append('<td>' + team.pts_scored + '</td>'); // Ajouter les points marqués
        row.append('<td>' + team.pts_conceed  + '</td>'); // Ajouter les points concédés
        row.append('<td>' + team.moy_pts_scored + '</td>'); // Ajouter la moyenne des points marqués
        row.append('<td>' + team.moy_pts_conceed  + '</td>'); // Ajouter la moyenne des points concédés

        tableBody.append(row); // Ajouter la ligne au tableau
    });
});
