let board = null;
let game = new Chess();
let userColor = 'white';
let isBotThinking = false;
const username = localStorage.getItem("username");

if (!username) window.location.href = "index.html";

function initGame(color) {
    userColor = color;
    game = new Chess();
    isBotThinking = false;

    document.getElementById("setupControls").style.display = "none";
    document.getElementById("gameControls").style.display = "flex";
    document.getElementById("status").innerText = "Partie en cours...";

    const config = {
        draggable: true,
        position: 'start',
        orientation: color,
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };
    
    board = Chessboard('board', config);

    if (color === 'black') {
        setTimeout(makeBotMove, 500);
    }
}

function onDragStart(source, piece) {
    if (game.game_over() || isBotThinking) return false;
    if ((userColor === 'white' && piece.search(/^b/) !== -1) ||
        (userColor === 'black' && piece.search(/^w/) !== -1)) {
        return false;
    }
}

function onDrop(source, target) {
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    if (move === null) return 'snapback';

    updateStatus();
    if (!checkGameOver()) {
        window.setTimeout(makeBotMove, 250);
    }
}

function onSnapEnd() {
    board.position(game.fen());
}

async function makeBotMove() {
    isBotThinking = true;
    document.getElementById("status").innerText = "Le Bot réfléchit...";

    try {
        let url = `/api/bot/move?fen=${encodeURIComponent(game.fen())}`;

        if (game.history().length === 0 && userColor === 'black') {
            url = `/api/bot/start?userColor=black`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Erreur Bot API");
        
        const botMoveUCI = await response.text();
        console.log("Bot joue :", botMoveUCI);

        // Jouer le coup
        game.move(botMoveUCI, { sloppy: true });
        board.position(game.fen());
        
        checkGameOver();

    } catch (e) {
        console.error(e);
        document.getElementById("status").innerText = "Erreur du Bot";
    } finally {
        isBotThinking = false;
        if (!game.game_over()) {
            document.getElementById("status").innerText = "À vous de jouer !";
        }
    }
}

function checkGameOver() {
    if (game.game_over()) {
        let result = "1/2-1/2";
        let reason = "Match Nul";

        if (game.in_checkmate()) {
            const winner = game.turn() === 'w' ? "Noirs" : "Blancs";
            result = winner === "Blancs" ? "1-0" : "0-1";
            reason = "Echec et Mat !";
        } else if (game.in_draw()) {
            reason = "Pat / Nulle";
        }

        document.getElementById("status").innerText = reason;
        alert("Partie terminée : " + reason);
        saveGame(result);
        return true;
    }
    return false;
}

function endGame(action) {
    let result = "1/2-1/2";
    if (action === 'resign') {
        result = userColor === 'white' ? "0-1" : "1-0";
        alert("Vous avez abandonné.");
    } else {
        alert("Match nul conclu.");
    }
    saveGame(result);
}

async function saveGame(result) {
    try {
        await fetch('/api/platform/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                whitePlayer: userColor === 'white' ? username : "Bot-JRRZF",
                blackPlayer: userColor === 'black' ? username : "Bot-JRRZF",
                result: result,
                pgn: game.pgn(),
                timeControl: "Standard"
            })
        });
        // Retour au menu après sauvegarde
        setTimeout(() => window.location.href = "dashboard.html", 1000);
    } catch (e) {
        console.error("Erreur sauvegarde", e);
        alert("Erreur lors de la sauvegarde de la partie.");
    }
}

function updateStatus() {
    let status = "";
    let moveColor = game.turn() === 'b' ? 'Noirs' : 'Blancs';

    if (game.in_check()) {
        status += moveColor + " sont en échec ! ";
    }
    document.getElementById("status").innerText = status;
}