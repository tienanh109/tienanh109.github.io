const CLIENT_ID = '919521292590399530';
const REDIRECT_URI = 'https://localhost:8080/api/callback.html';

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('user-info');
    const avatar = document.getElementById('avatar');
    const username = document.getElementById('username');
    const userId = document.getElementById('user-id');

    loginBtn.addEventListener('click', () => {
        const authorizeUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=identify`;
        window.location.href = authorizeUrl;
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('discord_user');
        userInfo.classList.add('hidden');
        loginBtn.classList.remove('hidden');
    });

    function displayUserInfo(user) {
        avatar.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
        username.textContent = `Username: ${user.username}#${user.discriminator}`;
        userId.textContent = `User ID: ${user.id}`;
        userInfo.classList.remove('hidden');
        loginBtn.classList.add('hidden');
    }

    function checkForToken() {
        const storedUser = localStorage.getItem('discord_user');
        if (storedUser) {
            displayUserInfo(JSON.parse(storedUser));
        }
    }

    checkForToken();
});