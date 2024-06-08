const CLIENT_ID = '919521292590399530';  // Thay thế bằng Client ID của bạn
const REDIRECT_URI = 'http://localhost:5500/callback.html';
const API_BASE_URL = 'https://discord.com/api';

document.getElementById('login-button').addEventListener('click', login);
document.getElementById('logout-button').addEventListener('click', logout);

function login() {
    const authUrl = `${API_BASE_URL}/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=identify%20guilds`;
    window.location.href = authUrl;
}

function logout() {
    localStorage.removeItem('discord_token');
    localStorage.removeItem('user');
    updateUI();
}

function updateUI() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        document.getElementById('user-name').textContent = user.username;
        document.getElementById('user-avatar').src = user.avatar;

        const serverList = document.getElementById('server-list');
        serverList.innerHTML = '';
        user.servers.forEach(server => {
            const li = document.createElement('li');
            li.textContent = server;
            serverList.appendChild(li);
        });
    } else {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('dashboard').classList.add('hidden');
    }
}

function fetchUserDetails(token) {
    return fetch(`${API_BASE_URL}/users/@me`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json());
}

function fetchUserGuilds(token) {
    return fetch(`${API_BASE_URL}/users/@me/guilds`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json());
}

function handleCallback() {
    const token = localStorage.getItem('discord_token');

    if (token) {
        Promise.all([fetchUserDetails(token), fetchUserGuilds(token)])
            .then(([userDetails, userGuilds]) => {
                const user = {
                    username: userDetails.username,
                    avatar: `https://cdn.discordapp.com/avatars/${userDetails.id}/${userDetails.avatar}.png`,
                    servers: userGuilds.map(guild => guild.name)
                };

                localStorage.setItem('user', JSON.stringify(user));
                updateUI();
            })
            .catch(err => console.error('Failed to fetch user data:', err));
    }
}

// Chạy khi trang được tải
updateUI();
handleCallback();