/**
 * SmartSeva Connect - Master Logic
 */

// pages folder-er file list
const pageFiles = [
    { title: 'Overview', file: 'overview.html', icon: 'fa-th-large' },
    { title: 'Admin Provider Approval', file: 'admin_provider_approval.html', icon: 'fa-user-shield' },
    { title: 'Admin Reset Management', file: 'admin_reset_management.html', icon: 'fa-user-shield' },
    { title: 'Card Manager Pro', file: 'card_manager_pro.html', icon: 'fa-credit-card' },
    { title: 'Expert Admin', file: 'expert-admin.html', icon: 'fa-user-tie' },
    { title: 'Livesupport', file: 'livesupport.html', icon: 'fa-headset' },
    { title: 'Rank Settings', file: 'rank-settings.html', icon: 'fa-file-invoice' },
    { title: 'Service Settings', file: 'service_settings.html', icon: 'fa-cogs' },
    { title: 'Service Manager', file: 'servicemanager.html', icon: 'fa-tasks' },
    { title: 'Team Transfer', file: 'team_transfer.html', icon: 'fa-exchange-alt' },
    { title: 'Worker Registration', file: 'worker_registration.html', icon: 'fa-user-plus' }
];

function initDashboard() {
    const menuContainer = document.getElementById('autoMenu'); // HTML ID match
    const iframe = document.getElementById('contentFrame');
    const titleDisplay = document.getElementById('pageTitle');

    if (menuContainer) {
        menuContainer.innerHTML = ""; // Clear existing

        pageFiles.forEach(item => {
            const navLink = document.createElement('div');
            navLink.className = 'nav-item';
            navLink.innerHTML = `<i class="fas ${item.icon}"></i> <span>${item.title}</span>`;
            
            navLink.onclick = () => {
                // Active class switch
                document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
                navLink.classList.add('active');

                // Content load into iframe
                if(iframe) iframe.src = `pages/${item.file}`;
                if(titleDisplay) titleDisplay.innerText = item.title;
            };

            menuContainer.appendChild(navLink);
        });
    }

    // Live Clock start
    startClock();
}

function startClock() {
    setInterval(() => {
        const now = new Date();
        const timeElement = document.getElementById('liveTime');
        if(timeElement) {
            timeElement.innerText = now.toLocaleString('en-IN', { 
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                day: '2-digit', month: 'short' 
            });
        }
    }, 1000);
}

// User Data from LocalStorage (CEO Profile)
document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName') || "NURNOBI SK"; //
    const userID = localStorage.getItem('userID') || "CEO_SMARTSEVA"; //
    
    if(document.getElementById('uName')) document.getElementById('uName').innerText = userName;
    if(document.getElementById('uID')) document.getElementById('uID').innerText = userID;

    initDashboard();
});