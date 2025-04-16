// Fonction pour récupérer les actualités LNB depuis un fichier JSON local
async function fetchEuroleagueNews() {
    try {
        // Remplace le chemin vers le fichier JSON local
        const response = await fetch('../../fichiers_json/actualites/actualites_euroligue.json');
        const data = await response.json();

        // Sélection de la section où les actualités seront insérées
        const actualitesContainer = document.getElementById('actualites-euroligue');

        // Vérifie si des actualités sont disponibles
        if (data && data.length > 0) {
            data.forEach(article => {
                // Crée un élément pour chaque actualité
                const articleElement = document.createElement('div');
                articleElement.classList.add('actualite');

                // Structure de l'actualité (titre, date, contenu, image)
                articleElement.innerHTML = `
                    <h3><a href="${article.link}" target="_blank">${article.titre}</a></h3>
                    <p class="date">${article.date}</p>
                    <p>${article.contenu}</p>
                    <img src="${article.image}" alt="${article.titre}" class="image-actualite">
                `;

                // Insère l'élément dans la section des actualités LNB
                actualitesContainer.appendChild(articleElement);
            });
        } else {
            actualitesContainer.innerHTML = '<p>Aucune actualité disponible pour le moment.</p>';
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des actualités Euroligue:', error);
        const actualitesContainer = document.getElementById('actualites-euroligue');
        actualitesContainer.innerHTML = '<p>Impossible de récupérer les actualités Euroligue.</p>';
    }
}

// Appelle la fonction pour récupérer les actualités lorsque la page est chargée
document.addEventListener('DOMContentLoaded', fetchEuroleagueNews);
