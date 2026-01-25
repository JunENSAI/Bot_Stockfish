document.addEventListener("DOMContentLoaded", () => {
    loadStats();
});

async function loadStats() {
    const user = localStorage.getItem("username");
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    try {
        const response = await fetch(`/api/platform/stats?username=${user}`);
        if (!response.ok) throw new Error("Erreur réseau");

        const data = await response.json();

        document.getElementById("wins").innerText = data.wins;
        document.getElementById("losses").innerText = data.losses;
        document.getElementById("draws").innerText = data.draws;
        document.getElementById("total").innerText = data.totalGames;
        
        
    } catch (e) {
        console.error("Erreur chargement stats:", e);
        document.querySelector("h2").innerText = "Impossible de charger les statistiques.";
    }
}