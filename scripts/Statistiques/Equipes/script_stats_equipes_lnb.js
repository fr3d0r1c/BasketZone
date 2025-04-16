// Charger le fichier JSON des statistiques des équipes NBA
fetch('../../../fichiers_json/statistiques/equipe/stats_equipes_lnb.json')
    .then(response => response.json())
    .then(data => {
        // Insérer les données dans le tableau
        const tableBody = document.getElementById('lnb-stats');
        
        // Boucle sur toutes les équipes et ajout des données dans le tableau
        data.forEach((team, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${team.équipe}</td>
                <td>${team.mj}</td>
                <td>${team.v}</td>
                <td>${team.d}</td>
                <td>${team['%V']}</td>
                <td>${team.min}</td>
                <td>${team.pts}</td>
                <td>${team['2r']}</td>
                <td>${team['2t']}</td>
                <td>${team['2p%']}</td>
                <td>${team['3r']}</td>
                <td>${team['3t']}</td>
                <td>${team['3p%']}</td>
                <td>${team.lr}</td>
                <td>${team.lt}</td>
                <td>${team['lf%']}</td>
                <td>${team.ro}</td>
                <td>${team.rd}</td>
                <td>${team.rt}</td>
                <td>${team.pd}</td>
                <td>${team.ct}</td>
                <td>${team.cs}</td>
                <td>${team.in}</td>
                <td>${team.bp}</td>
                <td>${team.fte}</td>
                <td>${team.fpr}</td>
                <td>${team.eval}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Erreur lors du chargement du fichier JSON:', error));
