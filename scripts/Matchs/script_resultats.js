// Fonction pour charger les données depuis le fichier JSON
async function chargerMatchs() {
    try {
        // Chargement du fichier JSON
        const response = await fetch('../../fichiers_json/matchs/resultats.json');
        
        // Vérifier que la réponse est OK
        if (!response.ok) {
            throw new Error('Erreur lors du chargement du fichier JSON');
        }

        // Convertir les données JSON en objet JavaScript
        const matchs = await response.json();
        
        // Afficher les matchs pour la première fois
        afficherMatchs(matchs);

        // Ajouter un événement de changement pour le filtre
        document.getElementById('league-filter').addEventListener('change', (event) => {
            filtrerMatchs(matchs, event.target.value);
        });

    } catch (error) {
        console.error(error);
    }
}

// Fonction pour afficher les matchs dans la section résultats
function afficherMatchs(matchs) {
    const container = document.getElementById('resultats-container');
    container.innerHTML = ''; // Vider le conteneur avant d'ajouter les matchs

    matchs.forEach(match => {
        const matchElement = document.createElement('div');
        matchElement.classList.add('resultat-match');
        matchElement.innerHTML = `
            <div class="match-header">
                <div class="team-logo">
                    <img src="${match.team1Logo}" alt="Logo ${match.team1}" class="team-logo-img">
                </div>
                <span>${match.date}</span>
                <div class="team-logo">
                    <img src="${match.team2Logo}" alt="Logo ${match.team2}" class="team-logo-img">
                </div>
            </div>
            <div class="match-info">
                <h3>${match.team1} vs ${match.team2}</h3>
                <p><strong>Score:</strong> ${match.score}</p>
                <p><strong>MVP:</strong> ${match.mvp}</p>
            </div>
        `;
        matchElement.addEventListener('click', () => ouvrirModal(match));
        container.appendChild(matchElement);
    });
}

// Fonction pour filtrer les matchs en fonction de la ligue sélectionnée
function filtrerMatchs(matchs, league) {
    const filteredMatchs = league ? matchs.filter(match => match.league === league) : matchs;
    afficherMatchs(filteredMatchs);
}

// Fonction pour ouvrir la fenêtre modale avec les détails du match
function ouvrirModal(match) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDetails = document.getElementById('modal-details');
    
    modalTitle.innerHTML = `${match.team1} vs ${match.team2} - ${match.date}`;
    modalDetails.innerHTML = `
        <p><strong>Lieu:</strong> ${match.venue}</p>
        <p><strong>Score:</strong> ${match.score}</p>
        <p><strong>MVP:</strong> ${match.mvp} (Points: ${match.mvpStats.points}, Assists: ${match.mvpStats.assists}, Rebounds: ${match.mvpStats.rebounds})</p>
        <p><strong>Stats ${match.team1}:</strong> Points: ${match.statsTeam1.points}, Assists: ${match.statsTeam1.assists}, Rebounds: ${match.statsTeam1.rebounds}</p>
        <p><strong>Stats ${match.team2}:</strong> Points: ${match.statsTeam2.points}, Assists: ${match.statsTeam2.assists}, Rebounds: ${match.statsTeam2.rebounds}</p>
        <p><a href="${match.video}" target="_blank">Voir le match</a></p>
    `;
    
    modal.style.display = 'block';
}

// Fermer la fenêtre modale
const closeModal = document.querySelector('.close');
closeModal.addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});

// Charger les matchs au chargement de la page
window.onload = chargerMatchs;
