document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 1;  // Page actuelle
    const itemsPerPage = 25;  // Nombre d'éléments à afficher par page
    let allPlayerStats = [];  // Les données des joueurs

    // Fonction pour charger les données JSON avec fetch
    function loadData() {
        fetch('../../../fichiers_json/statistiques/joueurs/stats_joueurs_lnb.json')  // Remplacez par le chemin vers votre fichier JSON
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des données');
                }
                return response.json();  // Parse le JSON
            })
            .then(data => {
                data.sort((a,b) => a.Player.localeCompare(b.Player));
                allPlayerStats = data;
                displayPage(currentPage);

                // Ajouter un événement de changement pour trier les données
                document.getElementById('filter').addEventListener('change', function () {
                    const selectedFilter = this.value;
                    sortData(data, selectedFilter);
                    displayPage(currentPage);  // Réafficher la page actuelle après le tri
                });

                // Ajouter les événements de pagination
                document.getElementById('prev-page').addEventListener('click', () => {
                    if (currentPage > 1) {
                        currentPage--;
                        displayPage(currentPage);
                    }
                });

                document.getElementById('next-page').addEventListener('click', () => {
                    if (currentPage * itemsPerPage < allPlayerStats.length) {
                        currentPage++;
                        displayPage(currentPage);
                    }
                });
            })
            .catch(error => {
                console.error('Erreur :', error);
                alert('Erreur lors du chargement des données.');
            });
    }

    // Fonction pour afficher les données dans le tableau en fonction de la page
    function displayPage(pageNumber) {
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const playersToDisplay = allPlayerStats.slice(startIndex, endIndex);

        const tbody = document.querySelector("#lnb-stats-table tbody");
        tbody.innerHTML = '';  // Vider le tableau avant d'ajouter les nouvelles lignes

        playersToDisplay.forEach((player, index) => {
            const row = `
                <tr>
                    <td>${startIndex + index + 1}</td>
                    <td>${player.Player}</td>
                    <td>${player.Team}</td>
                    <td>${player.G}</td>
                    <td>${player.MP}</td>
                    <td>${player.PTS}</td>
                    <td>${player["FG%"]}</td>
                    <td>${player["3P%"]}</td>
                    <td>${player["FT%"]}</td>
                    <td>${player.TRB}</td>
                    <td>${player.AST}</td>
                    <td>${player.STL}</td>
                    <td>${player.BLK}</td>
                    <td>${player.PF}</td>
                </tr>
            `;
            tbody.insertAdjacentHTML('beforeend', row);
        });

        document.getElementById('page-number').textContent = `Page ${pageNumber}`;
        updatePaginationControls();
    }

    // Fonction pour trier les données en fonction de la sélection
    function sortData(data, criteria) {
        const sortedData = data.sort((a, b) => {
            const valA = parseFloat(a[criteria]) || 0;
            const valB = parseFloat(b[criteria]) || 0;
            return valB - valA;  // Tri décroissant
        });

        allPlayerStats = sortedData;  // Met à jour les données triées
    }

    // Fonction pour mettre à jour les boutons de pagination
    function updatePaginationControls() {
        document.getElementById('prev-page').disabled = currentPage === 1;
        document.getElementById('next-page').disabled = currentPage * itemsPerPage >= allPlayerStats.length;
    }

    // Charger les données lorsque le document est prêt
    loadData();
});
