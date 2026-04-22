import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ফায়ারবেস কনফিগারেশন
const firebaseConfig = {
    apiKey: "AIzaSyCzv1cwnfrhw7Ph5sTb-Kt_RS1q6Cpfhbo",
    authDomain: "smartseva-connect.firebaseapp.com",
    projectId: "smartseva-connect",
    storageBucket: "smartseva-connect.firebasestorage.app",
    messagingSenderId: "829136094605",
    appId: "1:829136094605:web:82b07d722959dabcf729c4",
    measurementId: "G-FKLDDL75TN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const loginForm = document.getElementById('loginForm');
const errorBox = document.getElementById('errorBox');
const passInput = document.getElementById('userPass');

loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const inputId = document.getElementById('userId').value.trim();
    const inputPass = passInput.value.trim();
    const btn = document.querySelector('.login-btn');

    errorBox.style.display = 'none';
    btn.disabled = true;
    btn.innerText = "Verifying...";

    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("user_id", "==", inputId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            showError("ইউজার আইডিটি পাওয়া যায়নি!");
        } else {
            let authSuccess = false;
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.password === inputPass) {
                    authSuccess = true;
                    
                    // সেশন সেভ করা
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userID', data.user_id);
                    localStorage.setItem('userName', data.name);
                    localStorage.setItem('userRole', data.role);
                    localStorage.setItem('userRank', data.rank || 0);
                    localStorage.setItem('userPhoto', data.photo || "");

                    // সবচেয়ে গুরুত্বপূর্ণ অংশ: প্যাথ ফিক্স
                    // যেহেতু login.html 'pages' ফোল্ডারে, তাই '../' দিয়ে মেইন ফোল্ডারের ফাইলে যেতে হবে
                    window.location.href = '../dashboard.html'; 
                }
            });

            if (!authSuccess) showError("ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।");
        }
    } catch (err) {
        showError("সার্ভার সমস্যা: " + err.message);
    } finally {
        btn.disabled = false;
        btn.innerText = "LOGIN NOW";
    }
});

function showError(msg) {
    errorBox.innerText = msg;
    errorBox.style.display = 'block';
}