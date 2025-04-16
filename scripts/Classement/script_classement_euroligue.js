// Fonction pour charger et afficher le classement depuis le fichier JSON
fetch('..\\..\\fichiers_json\\Classement\\classement_euroligue.json')
.then(response => response.json())
.then(data => {
    const tableBody = document.getElementById('classement-table').getElementsByTagName('tbody')[0];

    data.forEach((team, index) => {
        const row = tableBody.insertRow();

        // Création des cellules pour chaque ligne
        row.insertCell(0).textContent = index + 1; // Position
        row.insertCell(1).innerHTML = team.team; // Nom de l'équipe et lien
        row.insertCell(2).textContent = team.w; // Victoires
        row.insertCell(3).textContent = team.l; // Défaites
        row.insertCell(4).textContent = `${team.winPercentage}%`; // Pourcentage de victoires
        row.insertCell(5).textContent = team['PTS+']; // Points+
        row.insertCell(6).textContent = team['PTS-']; // Points-
        row.insertCell(7).textContent = team['+/-']; // Différence de points
        row.insertCell(8).innerHTML = `<a href="${team.teamsLinks}" target="_blank">Voir plus</a>`; // Lien pour plus de détails
    });
})
.catch(error => {
    console.error('Erreur lors du chargement du fichier JSON:', error);
});