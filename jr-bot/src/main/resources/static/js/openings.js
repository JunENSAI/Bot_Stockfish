document.addEventListener("DOMContentLoaded", () => {
    loadOpenings();
});

// Variable globale qui sera remplie par le fichier JSON
let fenToWhiteMove = {};

async function loadOpenings() {
    try {
        const [fenResponse, statsResponse] = await Promise.all([
            fetch('json/fen_mapping.json'),
            fetch('/api/historical/openings')
        ]);

        fenToWhiteMove = await fenResponse.json();
        const data = await statsResponse.json();

        fillTable("white-table", data.white, true);
        fillTable("black-table", data.black, false);

    } catch (e) {
        console.error("Erreur chargement données:", e);
    }
}

function fillTable(tableId, moves, isWhite) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = "";

    moves.slice(0, 15).forEach((stat, index) => {
        const total = stat.total;
        const winP = total > 0 ? ((stat.wins / total) * 100).toFixed(1) : 0;
        const lossP = total > 0 ? ((stat.losses / total) * 100).toFixed(1) : 0;
        const nameId = `name-${tableId}-${index}`;

        let badgeMove = stat.move;
        let contextText = "";
        let apiQuery = stat.move;

        if (!isWhite) {
            const cleanFen = stat.fen ? stat.fen.trim() : "";
            
            const whiteMove = fenToWhiteMove[cleanFen] || "?";
            
            contextText = `<span style="color:#888; font-size:0.8em;">vs ${whiteMove}</span>`;
            
            if (whiteMove !== "?") {
                apiQuery = `${whiteMove},${stat.move}`;
            }
        }

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <div style="display:flex; align-items:center; gap:5px;">
                    <span class="move-badge">${badgeMove}</span>
                    ${contextText}
                </div>
                <div id="${nameId}" style="font-size:0.85em; color:#4caf50; margin-top:4px; font-style:italic;">Chargement...</div>
            </td>
            <td>
                <div style="font-weight:bold;">${total}</div>
                <div style="font-size:0.8em; color:#666;">part.</div>
            </td>
            <td>
                <div class="bar-container">
                    <div class="bar-win" style="width: ${winP}%"></div>
                    <div class="bar-draw" style="width: ${(total > 0 ? ((stat.draws / total) * 100).toFixed(1) : 0)}%"></div>
                    <div class="bar-loss" style="width: ${lossP}%"></div>
                </div>
                <div class="stats-text">
                    <span style="color:#4caf50">${winP}%</span> / 
                    <span style="color:#e57373">${lossP}%</span>
                </div>
            </td>
        `;
        tbody.appendChild(row);

        fetchOpeningName(apiQuery, nameId);
    });
}

async function fetchOpeningName(uciMoves, elementId) {
    try {
        const response = await fetch(`https://explorer.lichess.ovh/masters?play=${uciMoves}`);
        const data = await response.json();
        if (data.opening) {
            document.getElementById(elementId).innerText = data.opening.name;
            document.getElementById(elementId).style.fontStyle = "normal";
        } else {
            document.getElementById(elementId).innerText = "Standard";
        }
    } catch (e) {
        document.getElementById(elementId).innerText = "";
    }
}