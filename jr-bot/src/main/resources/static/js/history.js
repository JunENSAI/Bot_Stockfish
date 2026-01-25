document.addEventListener("DOMContentLoaded", () => {
    loadHistory();
});

async function loadHistory() {
    const user = localStorage.getItem("username");
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    try {
        const response = await fetch(`/api/platform/history?username=${user}`);
        const games = await response.json();

        const tableBody = document.getElementById("historyBody");
        tableBody.innerHTML = ""; // Nettoyer

        if (games.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='4'>Aucune partie jouée.</td></tr>";
            return;
        }

        games.forEach(game => {
            const row = document.createElement("tr");
            
            // Formatage de la date (ex: 2026-01-25)
            const dateObj = new Date(game.datePlayed);
            const dateStr = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString();

            // Couleur résultat
            let resultColor = "gray";
            if (game.result === "1-0") resultColor = game.whitePlayer === user ? "#4caf50" : "#e57373";
            if (game.result === "0-1") resultColor = game.blackPlayer === user ? "#4caf50" : "#e57373";

            row.innerHTML = `
                <td>${dateStr}</td>
                <td>${game.whitePlayer}</td>
                <td>${game.blackPlayer}</td>
                <td style="font-weight:bold; color:${resultColor}">${game.result}</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (e) {
        console.error("Erreur historique:", e);
    }
}