// Charger les données JSON
fetch('../../../fichiers_json/statistiques/joueurs/stats_joueurs_nba.json')
    .then(response => response.json())
    .then(data => {
        // La structure des données peut être différente selon le fichier, adaptez cette partie en conséquence
        const players = data;  // Si les joueurs sont directement dans la racine du JSON
        const playerTable = document.querySelector('#stats-joueurs tbody');

        // Fonction pour afficher les joueurs dans la table
        function displayPlayers(players) {
            playerTable.innerHTML = ''; // Vider le tableau avant de le remplir

            players.forEach((player, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${player.Player}</td>
                    <td>${player.Team}</td>
                    <td>${player.Age}</td>
                    <td>${player.GP}</td>
                    <td>${player.W}</td>
                    <td>${player.L}</td>
                    <td>${player.Min}</td>
                    <td>${player.PTS}</td>
                    <td>${player.FGM}</td>
                    <td>${player.FGA}</td>
                    <td>${player["FG%"]}</td>
                    <td>${player["3PM"]}</td>
                    <td>${player["3PA"]}</td>
                    <td>${player["3P%"]}</td>
                    <td>${player["FTM"]}</td>
                    <td>${player["FTA"]}</td>
                    <td>${player["FT%"]}</td>
                    <td>${player.OREB}</td>
                    <td>${player.DREB}</td>
                    <td>${player.REB}</td>
                    <td>${player.AST}</td>
                    <td>${player.TOV}</td>
                    <td>${player.STL}</td>
                    <td>${player.BLK}</td>
                    <td>${player.PF}</td>
                    <td>${player.FP}</td>
                    <td>${player.DD2}</td>
                    <td>${player.TD3}</td>
                    <td>${player["+/-"]}</td>
                `;
                playerTable.appendChild(row);
            });
        }

        // Trier les joueurs par nom (ordre alphabétique croissant)
        players.sort((a, b) => a.Player.localeCompare(b.Player));

        // Afficher les joueurs initialement
        displayPlayers(players);


        // Trier les joueurs selon le critère sélectionné
        const filterSelect = document.getElementById('filter');
        filterSelect.addEventListener('change', function() {
            const sortBy = filterSelect.value;
            const sortedPlayers = [...players].sort((a, b) => b[sortBy] - a[sortBy]);
            displayPlayers(sortedPlayers);
        });
    })
    .catch(error => {
        console.error('Erreur lors du chargement des données JSON:', error);
    });
