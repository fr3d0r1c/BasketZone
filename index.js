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
                console.log('Données chargées :', data);  // Vérifier les données
                return Array.isArray(data) ? data : [data];  // Assurer que c'est un tableau
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

                // Vérification des dates et conversion si nécessaire
                articles.forEach(article => {
                    // Log pour vérifier la date
                    console.log('Date de l\'article :', article.date);

                    // Vérifier si la date est valide, si pas on la formate
                    if (isNaN(new Date(article.date))) {
                        console.warn('Date invalide pour l\'article :', article);
                    }
                });

                // Trier les articles par date (du plus récent au plus ancien)
                articles.sort((a, b) => new Date(b.date) - new Date(a.date));

                // Afficher le premier article (le plus récent)
                const articleRecent = articles[0];
                const section = document.getElementById(idSection);

                // Afficher les informations de l'article
                section.innerHTML = `
                    <h4>${articleRecent.titre}</h4>
                    <p>${articleRecent.contenu}</p>
                    <p><strong>Date:</strong> ${articleRecent.date}</p>
                    ${articleRecent.image ? `<img src="${articleRecent.image}" alt="${articleRecent.titre}" />` : ''}
                `;
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des articles :', error);
                const section = document.getElementById(idSection);
                section.innerHTML = "<p>Erreur lors de l'affichage de l'article.</p>";
            });
    }

    // Charger et afficher l'article le plus récent pour chaque catégorie
    afficherArticleRecent('article-joueurs', 'fichiers_json/actualites/actualites_joueurs.json');
    afficherArticleRecent('article-nba', 'fichiers_json/actualites/actualites_nba.json');
    afficherArticleRecent('article-euroligue', 'fichiers_json/actualites/actualites_euroligue.json');
    afficherArticleRecent('article-lnb', 'fichiers_json/actualites/actualites_lnb.json');
});



async function fetchStats(ligue, file, idPrefix) {
    const response = await fetch(file);
    const data = await response.json();

    // Convertir les strings en float (utile pour Euroligue/LNB)
    data.forEach(p => {
        p.PTS = parseFloat(p.PTS);
        p.AST = parseFloat(p.AST);
        p.TRB = parseFloat(p.REB || p.TRB); // selon la structure
    });

    // Fonctions utilitaires
    const top5 = (stat) => data
        .filter(p => !isNaN(p[stat]))
        .sort((a, b) => b[stat] - a[stat])
        .slice(0, 5);

    const fillTable = (stat, tableId) => {
        const top = top5(stat);
        const tbody = document.getElementById(tableId);
        top.forEach((p, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${p.Player}</td>
                <td>${p.Team}</td>
                <td>${p[stat]}</td>
            `;
            tbody.appendChild(row);
        });
    };

    fillTable('PTS', `${idPrefix}-points`);
    fillTable('AST', `${idPrefix}-passes`);
    fillTable('TRB', `${idPrefix}-rebonds`);
}

// Appels pour chaque ligue
fetchStats("NBA", "fichiers_json/statistiques/joueurs/stats_joueurs_nba.json", "nba");
fetchStats("Euroligue", "fichiers_json/statistiques/joueurs/stats_joueurs_euroleague.json", "euroligue");
fetchStats("LNB", "fichiers_json/statistiques/joueurs/stats_joueurs_lnb.json", "lnb");

const leagueColors = {
    nba: '#FDB927',
    euroleague: '#e53935',
    lnb: '#1E88E5',
    ncaa: '#43A047',
    wnba: '#FF6F00'
};

Promise.all([
    fetch('fichiers_json/matchs/resultats.json').then(res => res.json()),
    fetch('fichiers_json/matchs/prochains_matchs.json').then(res => res.json())
])
.then(([resultats, matchsAvenir]) => {
    const events = [];

    // 🔴 Résultats terminés
    resultats.forEach(match => {
        const [day, month, year] = match.date.split('/');
        const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

        events.push({
            title: `${match.team1} ${match.score} ${match.team2}`,
            start: isoDate,
            color: leagueColors[match.league] || '#9E9E9E',
            extendedProps: {
                type: 'resultat',
                mvp: match.mvp,
                video: match.video
            }
        });
    });

    // 🔵 Matchs à venir
    Object.entries(matchsAvenir).forEach(([league, matchs]) => {
        matchs.forEach(match => {
            events.push({
                title: `${match.equipeA} vs ${match.equipeB}`,
                start: `${match.date}T${match.heure}`,
                color: leagueColors[league] || '#9E9E9E',
                extendedProps: {
                    type: 'avenir',
                    statistiques: match.statistiques,
                    joueurs_a_suivre: match.joueurs_a_suivre,
                    confrontations: match.dernières_confrontations
                }
            });
        });
    });

    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'fr',
        eventSources: [
            { events: events }
        ],
        eventClick: function(info) {
            const props = info.event.extendedProps;

            if (props.type === 'resultat') {
                alert(`🎯 Match terminé\nMVP : ${props.mvp}\nVidéo : ${props.video}`);
            } else if (props.type === 'avenir') {
                alert(`📅 Match à venir\nJoueurs à suivre :\n${Object.entries(props.joueurs_a_suivre).map(([equipe, joueurs]) => `- ${equipe} : ${joueurs.join(', ')}`).join('\n')}`);
            }
        }
    });

    calendar.render();
});