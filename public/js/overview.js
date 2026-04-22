import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, where, getCountFromServer } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ১. ফায়ারবেস কনফিগ
const firebaseConfig = {
    apiKey: "AIzaSyCzv1cwnfrhw7Ph5sTb-Kt_RS1q6Cpfhbo",
    authDomain: "smartseva-connect.firebaseapp.com",
    projectId: "smartseva-connect",
    storageBucket: "smartseva-connect.firebasestorage.app",
    messagingSenderId: "829136094605",
    appId: "1:829136094605:web:82b07d722959dabcf729c4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ২. নাম্বার অ্যানিমেশন ফাংশন (স্মুথ ইউআই এর জন্য)
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = progress * (end - start) + start;
        
        if (id === "balance" || id === "todayIncome" || id === "upcomingPay" || id === "totalEarnings") {
            obj.innerHTML = "₹ " + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        } else {
            obj.innerHTML = Math.floor(value);
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ৩. লোকাল স্টোরেজ থেকে ইউজার প্রোফাইল আপডেট
function loadUserProfile() {
    const userData = {
        name: localStorage.getItem('userName') || "User",
        id: localStorage.getItem('userID') || "SS-000",
        rank: localStorage.getItem('userRank') || "1",
        role: localStorage.getItem('userRole') || "Member"
    };

    if(document.getElementById('displayID')) document.getElementById('displayID').innerText = userData.id;
    
    const rankLabel = document.getElementById('displayRank');
    if(rankLabel) {
        rankLabel.innerText = Number(userData.rank) === 11 ? "Founder & CEO" : userData.role;
    }
}

// ৪. রিয়েল-টাইম ডাটা সিঙ্ক (Firestore)
function syncDashboardData() {
    // সার্ভিস ও ইনকাম ডাটা
    onSnapshot(collection(db, "service_bookings"), (snap) => {
        let totalVal = 0;
        let todayVal = 0;
        let completed = 0;
        const today = new Date().toLocaleDateString();

        snap.forEach(doc => {
            const data = doc.data();
            if (data.platformFee) {
                totalVal += data.platformFee;
                if (new Date(data.timestamp?.toDate()).toLocaleDateString() === today) {
                    todayVal += data.platformFee;
                }
            }
            if (data.status === "completed") completed++;
        });

        // অ্যানিমেশন সহ ডাটা দেখানো
        animateValue("balance", 0, totalVal, 1000);
        animateValue("todayIncome", 0, todayVal, 1000);
        animateValue("taskCount", 0, completed, 1000);
        if(document.getElementById('lifetimeService')) {
            document.getElementById('lifetimeService').innerText = snap.size;
        }
    });

    // মেম্বার এবং ওয়ার্কার কাউন্ট
    const fetchCounts = async () => {
        const memQ = query(collection(db, "users"), where("role", "==", "member"));
        const worQ = query(collection(db, "users"), where("role", "==", "worker"));
        
        const [memSnap, worSnap] = await Promise.all([
            getCountFromServer(memQ),
            getCountFromServer(worQ)
        ]);

        if(document.getElementById('memberCount')) animateValue("memberCount", 0, memSnap.data().count, 800);
        if(document.getElementById('workerCount')) animateValue("workerCount", 0, worSnap.data().count, 800);
    };
    fetchCounts();
}

// ৫. রিসেন্ট এক্টিভিটি লগ
function loadActivityLogs() {
    const q = query(collection(db, "activity_logs"), where("target", "==", "admin"));
    onSnapshot(q, (snap) => {
        const logList = document.getElementById('activityLog');
        if(!logList) return;
        
        logList.innerHTML = "";
        if (snap.empty) {
            logList.innerHTML = `<li><span class="dot"></span><p>No new activity found.</p></li>`;
            return;
        }

        snap.forEach(doc => {
            const log = doc.data();
            logList.innerHTML += `
                <li>
                    <span class="dot" style="background: #FFD700;"></span>
                    <p>${log.message} <span style="display:block; font-size:10px; color:#64748b;">${log.time || ''}</span></p>
                </li>
            `;
        });
    });
}

// ৬. ইনিশিয়ালাইজেশন
window.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    syncDashboardData();
    loadActivityLogs();
    
    if(document.getElementById('lastUpdate')) {
        document.getElementById('lastUpdate').innerText = new Date().toLocaleTimeString('bn-IN');
    }
});