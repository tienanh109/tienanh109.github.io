const CLIENT_ID = '919521292590399530';
const REDIRECT_URI = 'https://tienanh109.dev/bzot9services/api/callback.html';
const BOT_INVITE_URL = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot`;

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const inviteBtn = document.getElementById('inviteBtn');
    const userInfo = document.getElementById('user-info');
    const serverInfo = document.getElementById('server-info');
    const avatar = document.getElementById('avatar');
    const username = document.getElementById('username');
    const userId = document.getElementById('user-id');
    const serverList = document.getElementById('server-list');

    loginBtn.addEventListener('click', () => {
        const authorizeUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=identify%20guilds`;
        window.location.href = authorizeUrl;
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('discord_user');
        userInfo.classList.add('hidden');
        serverInfo.classList.add('hidden');
        loginBtn.classList.remove('hidden');
        inviteBtn.classList.add('hidden');
    });

    inviteBtn.addEventListener('click', () => {
        window.open(BOT_INVITE_URL, '_blank');
    });

    function displayUserInfo(user) {
        avatar.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
        username.textContent = `Username: ${user.username}#${user.discriminator}`;
        userId.textContent = `User ID: ${user.id}`;
        userInfo.classList.remove('hidden');
        loginBtn.classList.add('hidden');
        inviteBtn.classList.remove('hidden');
    }

    function displayServerInfo(servers) {
        serverList.innerHTML = '';
        servers.forEach(server => {
            const serverCard = document.createElement('div');
            serverCard.classList.add('server-card');
            serverCard.innerHTML = `
                <img src="https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png" alt="${server.name}"/>
                <h3>${server.name}</h3>
                <p>Server ID: ${server.id}</p>
                <button onclick="viewDetails('${server.id}')">View Details</button>
            `;
            serverList.appendChild(serverCard);
        });
        serverInfo.classList.remove('hidden');
    }

    function viewDetails(serverId) {
        alert(`Details for server ID: ${serverId}`);
    }

    function checkForToken() {
        const hash = window.location.hash.substr(1);
        const result = hash.split('&').reduce((res, item) => {
            const parts = item.split('=');
            res[parts[0]] = parts[1];
            return res;
        }, {});

        if (result.access_token) {
            fetch('https://discord.com/api/users/@me', {
                headers: {
                    'Authorization': `Bearer ${result.access_token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('discord_user', JSON.stringify(data));
                displayUserInfo(data);

                fetch('https://discord.com/api/users/@me/guilds', {
                    headers: {
                        'Authorization': `Bearer ${result.access_token}`
                    }
                })
                .then(response => response.json())
                .then(servers => {
                    const botServers = servers.filter(server => server.permissions & 0x00000008);
                    displayServerInfo(botServers);
                });
            })
            .catch(console.error);
        } else {
            const storedUser = localStorage.getItem('discord_user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                displayUserInfo(user);
                fetch('https://discord.com/api/users/@me/guilds', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                })
                .then(response => response.json())
                .then(servers => {
                    const botServers = servers.filter(server => server.permissions & 0x00000008);
                    displayServerInfo(botServers);
                });
            }
        }
    }

    checkForToken();
});
