document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour récupérer les articles depuis un fichier JSON
    function chargerArticles(fichierJson) {
        return fetch(fichierJson)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur de chargement des données');
                }
                return response.json();  // On convertit en JSON
            })
            .then(data => {
                return data;  // Retourner directement les données (le tableau d'articles)
            })
            .catch(error => {
                console.error('Erreur lors du chargement des données :', error);
                return [];  // Retourner un tableau vide en cas d'erreur
            });
    }

    // Fonction pour afficher l'article le plus récent
    function afficherArticleRecent(idSection, fichierJson, ligue = 'all') {
        chargerArticles(fichierJson)
            .then(articles => {
                // Si aucun article n'est trouvé
                if (articles.length === 0) {
                    document.getElementById(idSection).innerHTML = "<p>Aucune actualité disponible.</p>";
                    return;
                }

                // Filtrer les articles par ligue (si nécessaire)
                if (ligue !== 'all') {
                    articles = articles.filter(article => article.ligue && article.ligue.toLowerCase() === ligue);
                }

                // Trier les articles par date (du plus récent au plus ancien)
                articles.sort((a, b) => new Date(b.date) - new Date(a.date));

                // Afficher les articles filtrés
                const section = document.getElementById(idSection);

                if (articles.length === 0) {
                    section.innerHTML = "<p>Aucun article trouvé pour cette ligue.</p>";
                    return;
                }

                // Créer le HTML pour chaque article
                section.innerHTML = articles.map(article => `
                    <div class="article">
                        <h4><a href="${article.link}" target="_blank">${article.title}</a></h4>
                        <p>${article.description}</p>
                        <p><strong>Date:</strong> ${article.date}</p>
                        <img src="${article.image}" alt="${article.title}" />
                    </div>
                `).join('');
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des articles :', error);
            });
    }

    // Charger les articles par défaut pour "toutes les ligues"
    afficherArticleRecent('actualites-joueurs', '../../fichiers_json/actualites/actualites_joueurs.json');

    // Gestionnaire d'événement pour le changement de filtre
    document.getElementById('filtre-ligue').addEventListener('change', function() {
        const ligue = this.value;  // Récupérer la ligue sélectionnée
        afficherArticleRecent('actualites-joueurs', '../../fichiers_json/actualites/actualites_joueurs.json', ligue);
    });
});
