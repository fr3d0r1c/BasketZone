document.addEventListener('DOMContentLoaded', () => {
    // Fonction pour charger et afficher les matchs
    fetch('../../fichiers_json/matchs/prochains_matchs.json')
        .then(response => response.json())
        .then(data => {
            // Affichage des matchs pour chaque ligue
            afficherMatchs(data.nba, 'nba');
            afficherMatchs(data.euroligue, 'euroligue');
            afficherMatchs(data.lnb, 'lnb');
        });

    // Fonction pour afficher les matchs dans les tables respectives
    function afficherMatchs(matchs, ligue) {
        matchs.forEach(match => {
            const tableBody = document.getElementById(`${ligue}-matches`);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${match.equipeA}</td>
                <td>${match.equipeB}</td>
                <td>${match.date}</td>
                <td>${match.heure}</td>
            `;
            // Ajouter un événement au clic pour ouvrir la modale
            row.addEventListener('click', () => {
                afficherDetailsDansModale(match);
            });

            tableBody.appendChild(row);
        });
    }

    // Fonction pour afficher les détails du match dans la modale
    function afficherDetailsDansModale(match) {
        const modal = document.getElementById("matchDetailsModal");
        const modalContent = document.getElementById("modalContent");

        // Générer le contenu de la modale
        modalContent.innerHTML = `
            <h2>Prochain Match : ${match.equipeA} vs ${match.equipeB}</h2>
            <p><strong>Date et Heure</strong>: ${match.date} à ${match.heure}</p>

            <h4>Statistiques :</h4>
            <h5>${match.equipeA}</h5>
            <ul>
                <li>Points Marqués : ${match.statistiques.equipeA.points_marges}</li>
                <li>Points Concédés : ${match.statistiques.equipeA.points_concedes}</li>
                <li>Rebonds : ${match.statistiques.equipeA.rebonds}</li>
                <li>Passes : ${match.statistiques.equipeA.passes}</li>
            </ul>
            <h5>${match.equipeB}</h5>
            <ul>
                <li>Points Marqués : ${match.statistiques.equipeB.points_marges}</li>
                <li>Points Concédés : ${match.statistiques.equipeB.points_concedes}</li>
                <li>Rebonds : ${match.statistiques.equipeB.rebonds}</li>
                <li>Passes : ${match.statistiques.equipeB.passes}</li>
            </ul>

            <h4>Dernières Confrontations :</h4>
            <ul>
                ${match.dernières_confrontations.map(confrontation => `<li>${confrontation}</li>`).join('')}
            </ul>

            <h4>5 Derniers Matchs :</h4>
            ${Object.keys(match['5_derniers_matchs']).map(equipe => {
                const matchsEquipe = match['5_derniers_matchs'][equipe];
                return `
                    <h5>${equipe}</h5>
                    <ul>
                        ${matchsEquipe.map(m => `<li>${m.date} : ${m.résultat} contre ${m.score}</li>`).join('')}
                    </ul>
                `;
            }).join('')}

            <h4>Joueurs à suivre :</h4>
            <ul>
                ${Object.keys(match.joueurs_a_suivre).map(equipe => {
                    return `
                        <h5>${equipe}</h5>
                        <ul>
                            ${match.joueurs_a_suivre[equipe].map(joueur => `<li>${joueur}</li>`).join('')}
                        </ul>
                    `;
                }).join('')}
            </ul>
        `;

        // Afficher la modale
        modal.style.display = "block";
    }

    // Gérer la fermeture de la modale
    const modal = document.getElementById("matchDetailsModal");
    const closeButton = document.getElementsByClassName("close-btn")[0];

    closeButton.addEventListener('click', () => {
        modal.style.display = "none";
    });

    // Fermer la modale si l'utilisateur clique en dehors de celle-ci
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
