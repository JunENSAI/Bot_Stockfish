const API_BASE_AUTH = "/api/auth";

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("username") && window.location.pathname.endsWith("index.html")) {
        window.location.href = "dashboard.html";
    }
});

async function login() {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const errorMsg = document.getElementById("error");

    const user = usernameInput.value.trim();
    const pass = passwordInput.value.trim();

    if (!user || !pass) {
        errorMsg.innerText = "Veuillez remplir tous les champs.";
        errorMsg.style.display = "block";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_AUTH}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });

        if (response.ok) {
            // Sauvegarde de la session
            localStorage.setItem("username", user);
            window.location.href = "dashboard.html";
        } else {
            errorMsg.innerText = "Identifiants incorrects.";
            errorMsg.style.display = "block";
        }
    } catch (e) {
        console.error("Erreur login:", e);
        errorMsg.innerText = "Erreur de connexion au serveur.";
        errorMsg.style.display = "block";
    }
}