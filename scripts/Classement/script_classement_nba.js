// Charger les données depuis le fichier JSON
fetch('..\\..\\fichiers_json\\Classement\\classement_nba.json')
    .then(response => {
        // Vérifier si la réponse est OK
        if (!response.ok) {
            throw new Error('Erreur de chargement du fichier JSON');
        }
        return response.json();
    })
    .then(data => {
        // Vérifier si les données ont le format attendu
        if (!Array.isArray(data) || !data.every(item => item.team && item.conference && item.division)) {
            throw new Error('Format des données invalide');
        }

        // Fonction pour calculer et mettre à jour la valeur de GB pour une conférence ou division
        function updateGBForConferenceOrDivision(data, conferenceOrDivision) {
            const leader = data.reduce((max, item) => (item.w > max.w ? item : max), data[0]);

            data.forEach(item => {
                let gb = 0;

                if (item !== leader) {
                    const gamesBehind = (leader.w - item.w);
                    gb = gamesBehind >= 0 ? gamesBehind : 0; // S'assurer que GB ne soit pas négatif
                }

                item.gb = gb;
            });
        }

        // Séparation des équipes par conférence
        const conferenceEst = data.filter(item => item.conference === "Est");
        const conferenceOuest = data.filter(item => item.conference === "Ouest");

        // Séparation des équipes par divisions
        const divisionEstAtlantic = data.filter(item => item.conference === "Est" && item.division === "Atlantic");
        const divisionEstCentral = data.filter(item => item.conference === "Est" && item.division === "Central");
        const divisionEstSoutheast = data.filter(item => item.conference === "Est" && item.division === "Southeast");

        const divisionOuestNorthwest = data.filter(item => item.conference === "Ouest" && item.division === "Northwest");
        const divisionOuestPacific = data.filter(item => item.conference === "Ouest" && item.division === "Pacific");
        const divisionOuestSouthwest = data.filter(item => item.conference === "Ouest" && item.division === "Southwest");

        // Fonction pour peupler un tableau avec les données
        function populateTable(tableId, data, isGeneralRanking = false) {
            const tableBody = document.querySelector(`#${tableId} tbody`);
            tableBody.innerHTML = '';  // Vider le tableau avant de l'actualiser

            // Si ce n'est pas un classement général, on met à jour les GB
            if (!isGeneralRanking) {
                updateGBForConferenceOrDivision(data, tableId);
            }

            // Trier par nombre de victoires (w)
            data.sort((a, b) => b.w - a.w);  

            data.forEach((item, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${item.team}</td>
                    <td>${item.g}</td>
                    <td>${item.w}</td>
                    <td>${item.l}</td>
                    <td>${item.winPercentage}</td>
                    <td>${item.gb}</td>
                    <td>${item.conference}</td>
                    <td>${item.division}</td>
                    <td>${item.home}</td>
                    <td>${item.road}</td>
                    <td>${item.ot}</td>
                    <td>${item.last10}</td>
                    <td>${item.streak}</td>
                `;
                tableBody.appendChild(row);
            });
        }

        // Fonction pour afficher le classement général
        function showGeneralRanking() {
            document.getElementById("classement-conferences").style.display = "none";
            document.getElementById("classement-divisions").style.display = "none";
            document.getElementById("classement-general").style.display = "block";
            populateTable("generalTable", data, true);  // Remplir le tableau général sans calculer GB
        }

        // Fonction pour afficher les classements des conférences
        function showConferenceRankings() {
            document.getElementById("classement-general").style.display = "none";
            document.getElementById("classement-divisions").style.display = "none";
            document.getElementById("classement-conferences").style.display = "block";

            // Remplir les tableaux des conférences avec calcul de GB
            populateTable("generalTableEst", conferenceEst);
            populateTable("generalTableOuest", conferenceOuest);
        }

        // Fonction pour afficher les classements des divisions
        function showDivisionRankings() {
            document.getElementById("classement-general").style.display = "none";
            document.getElementById("classement-conferences").style.display = "none";
            document.getElementById("classement-divisions").style.display = "block";

            // Remplir les tableaux des divisions avec calcul de GB
            populateTable("tableAtlantic", divisionEstAtlantic);
            populateTable("tableCentral", divisionEstCentral);
            populateTable("tableSoutheast", divisionEstSoutheast);
            populateTable("tableNorthwest", divisionOuestNorthwest);
            populateTable("tablePacific", divisionOuestPacific);
            populateTable("tableSouthwest", divisionOuestSouthwest);
        }

        // Affichage initial : Classement général
        showGeneralRanking();

        // Gestion de la sélection du filtre
        document.getElementById("filtre-classement").addEventListener("change", function(event) {
            const selectedValue = event.target.value;
            if (selectedValue === "general") {
                showGeneralRanking();  // Afficher le classement général
            } else if (selectedValue === "conferences") {
                showConferenceRankings();  // Afficher les classements par conférence
            } else if (selectedValue === "divisions") {
                showDivisionRankings();  // Afficher les classements par division
            }
        });
    })
    .catch(error => {
        console.error('Erreur lors du chargement des données :', error);

        // Créer un message d'erreur
        const errorMessage = document.createElement('div');
        errorMessage.id = 'error-message';
        errorMessage.style.position = 'fixed';
        errorMessage.style.top = '20px';
        errorMessage.style.left = '50%';
        errorMessage.style.transform = 'translateX(-50%)';
        errorMessage.style.backgroundColor = '#e74c3c';
        errorMessage.style.color = 'white';
        errorMessage.style.padding = '15px';
        errorMessage.style.borderRadius = '8px';
        errorMessage.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        errorMessage.style.fontSize = '16px';
        errorMessage.style.zIndex = '9999';
        errorMessage.style.opacity = '0';
        errorMessage.style.transition = 'opacity 0.5s ease-in-out';
        errorMessage.innerHTML = `
            <strong>Erreur:</strong> ${error.message}
            <button id="close-error" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; margin-left: 15px;">&times;</button>
        `;
        
        // Ajouter le message d'erreur au début du body
        document.body.insertBefore(errorMessage, document.body.firstChild);

        // Animer l'apparition du message d'erreur
        setTimeout(() => {
            errorMessage.style.opacity = '1';
        }, 100);

        // Ajouter un gestionnaire d'événements pour fermer le message d'erreur
        document.getElementById('close-error').addEventListener('click', () => {
            errorMessage.style.opacity = '0';

            // Délai avant de supprimer l'élément pour permettre l'animation
            setTimeout(() => {
                errorMessage.remove();
            }, 500);
        });

        // Fermer automatiquement l'erreur après 10 secondes si l'utilisateur ne l'a pas fermée
        setTimeout(() => {
            if (errorMessage.style.opacity === '1') {
                errorMessage.style.opacity = '0';
                setTimeout(() => {
                    errorMessage.remove();
                }, 500);
            }
        }, 10000);
    });
