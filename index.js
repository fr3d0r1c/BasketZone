document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour récupérer et afficher les 3 premiers classements
    function afficherTop3(classementUrl, idTableau, conference = null) {
        fetch(classementUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur de chargement des données');
                }
                return response.json();
            })
            .then(data => {
                // Si c'est pour la NBA, séparer les conférences Est et Ouest
                if (conference) {
                    const top3 = data.filter(item => item.conference === conference) // Filtrer par conférence
                        .sort((a, b) => b.w - a.w) // Trier par victoires
                        .slice(0, 3); // Garder les 3 premiers

                    const tableauBody = document.getElementById(idTableau);
                    tableauBody.innerHTML = ''; // Vider le tableau avant d'ajouter les nouvelles lignes

                    top3.forEach((item, index) => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${item.team}</td>
                            <td>${item.w}</td>
                            <td>${item.l}</td>
                        `;
                        tableauBody.appendChild(row);
                    });
                } else {
                    // Cas générique (Euroligue ou LNB par exemple)
                    data.sort((a, b) => b.w - a.w); // Trier par victoires
                    const top3 = data.slice(0, 3); // Garder les 3 premiers

                    const tableauBody = document.getElementById(idTableau);
                    tableauBody.innerHTML = ''; // Vider le tableau avant d'ajouter les nouvelles lignes

                    top3.forEach((item, index) => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${item.team}</td>
                            <td>${item.w}</td>
                            <td>${item.l}</td>
                        `;
                        tableauBody.appendChild(row);
                    });
                }
            })
            .catch(error => {
                console.error('Erreur lors du chargement des données :', error);
            });
    }

    // Charger et afficher les 3 premiers pour chaque ligue
    afficherTop3('fichiers_json/Classement/classement_nba.json', 'nba-top-3-est', 'Est'); // Pour la Conférence Est
    afficherTop3('fichiers_json/Classement/classement_nba.json', 'nba-top-3-ouest', 'Ouest'); // Pour la Conférence Ouest
    afficherTop3('fichiers_json/Classement/classement_euroligue.json', 'euroligue-top-3'); // Pour l'Euroligue
    afficherTop3('fichiers_json/Classement/classement_lnb.json', 'lnb-top-3'); // Pour la LNB
});

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
                // Vérification de la clé "articles" dans le JSON
                if (data && data.articles) {
                    return data.articles;  // Retourner uniquement les articles
                } else {
                    throw new Error('Les données ne contiennent pas la clé "articles"');
                }
            })
            .catch(error => {
                console.error('Erreur lors du chargement des données :', error);
                return [];  // Retourner un tableau vide en cas d'erreur
            });
    }

    // Fonction pour afficher l'article le plus récent
    function afficherArticleRecent(idSection, fichierJson) {
        chargerArticles(fichierJson)
            .then(articles => {
                // Si aucun article n'est trouvé
                if (articles.length === 0) {
                    document.getElementById(idSection).innerHTML = "<p>Aucune actualité disponible.</p>";
                    return;
                }

                // Trier les articles par date (du plus récent au plus ancien)
                articles.sort((a, b) => new Date(b.date) - new Date(a.date));

                // Afficher le premier article (le plus récent)
                const articleRecent = articles[0];
                const section = document.getElementById(idSection);

                section.innerHTML = `
                    <h4>${articleRecent.title}</h4>
                    <p>${articleRecent.description}</p>
                    <p><strong>Date:</strong> ${articleRecent.date}</p>
                    <img src="${articleRecent.image}" alt="${articleRecent.title}" />
                    <a href="${articleRecent.link}" target="_blank">Lire l'article complet</a>
                `;
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des articles :', error);
            });
    }

    // Charger et afficher l'article le plus récent pour chaque catégorie
    afficherArticleRecent('article-joueurs', 'fichiers_json/Actualités/actualites_joueurs.json');
    afficherArticleRecent('article-nba', 'fichiers_json/Actualités/actualites_nba.json');
    afficherArticleRecent('article-euroligue', 'fichiers_json/Actualités/actualites_euroligue.json');
    afficherArticleRecent('article-lnb', 'fichiers_json/Actualités/actualites_lnb.json');
});
