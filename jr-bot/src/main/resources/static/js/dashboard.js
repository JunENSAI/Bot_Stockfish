document.addEventListener("DOMContentLoaded", () => {
    const user = localStorage.getItem("username");

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const welcomeMsg = document.getElementById("welcomeMsg");
    if (welcomeMsg) {
        welcomeMsg.innerText = "Bonjour, " + user;
    }
});

function logout() {
    localStorage.removeItem("username");
    window.location.href = "index.html";
}