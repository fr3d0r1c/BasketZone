// Charger le fichier JSON des statistiques des équipes NBA
fetch('../../../fichiers_json/statistiques/equipe/stats_equipes_nba.json')
    .then(response => response.json())
    .then(data => {
        // Insérer les données dans le tableau
        const tableBody = document.getElementById('nba-stats');
        
        // Boucle sur toutes les équipes et ajout des données dans le tableau
        data.forEach((team, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${team.Team}</td>
                <td>${team.W}</td>
                <td>${team.L}</td>
                <td>${(team['WIN%'])}%</td>
                <td>${team.PTS}</td>
                <td>${team.FGM}</td>
                <td>${team.FGA}</td>
                <td>${team['FG%']}</td>
                <td>${team['3PM']}</td>
                <td>${team['3PA']}</td>
                <td>${team['3P%']}</td>
                <td>${team.FTM}</td>
                <td>${team.FTA}</td>
                <td>${team['FT%']}</td>
                <td>${team.OREB}</td>
                <td>${team.DREB}</td>
                <td>${team.REB}</td>
                <td>${team.AST}</td>
                <td>${(team.TOV)}</td>
                <td>${team.BLK}</td>
                <td>${(team.BLKA)}</td>
                <td>${(team.PF)}</td>
                <td>${(team.PFD)}</td>
                <td>${team['+/-']}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Erreur lors du chargement du fichier JSON:', error));
    
const btnGlossaire = document.getElementById("btn-glossaire");
const modal = document.getElementById("modal-glossaire");
const closeModal = document.querySelector(".modal .close");

btnGlossaire.addEventListener("click", () => {
    modal.style.display = "block";
});

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});