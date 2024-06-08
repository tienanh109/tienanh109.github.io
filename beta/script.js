document.addEventListener("DOMContentLoaded", function() {
    const loginButton = document.getElementById("login-button");
    const logoutButton = document.getElementById("logout-button");
    const loginScreen = document.getElementById("login-screen");
    const dashboard = document.getElementById("dashboard");
    const userNameElement = document.getElementById("user-name");
    const userAvatarElement = document.getElementById("user-avatar");
    const serverListElement = document.getElementById("server-list");

    const CLIENT_ID = "919521292590399530";
    const REDIRECT_URI = "https://tienanh109.dev/beta/callback.html";
    const RESPONSE_TYPE = "token";
    const SCOPES = "identify guilds";

    const authEndpoint = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;

    loginButton.addEventListener("click", () => {
        window.location.href = authEndpoint;
    });

    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("token");
        displayLoginScreen();
    });

    function displayLoginScreen() {
        loginScreen.classList.remove("hidden");
        dashboard.classList.add("hidden");
    }

    function displayDashboard() {
        loginScreen.classList.add("hidden");
        dashboard.classList.remove("hidden");
    }

    function getUserData() {
        const token = localStorage.getItem("token");
        if (token) {
            fetch("https://discord.com/api/users/@me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                userNameElement.textContent = data.username;
                userAvatarElement.src = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`;
                displayDashboard();
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
                displayLoginScreen();
            });
        } else {
            displayLoginScreen();
        }
    }

    getUserData();
});
