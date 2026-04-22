import { db, storage } from './firebase-config.js';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// ১. অটো স্পন্সর আইডি লোড
document.getElementById('autoSponsorId').innerText = localStorage.getItem('userID') || "DIRECT_JOIN";

// ২. ক্যামেরা কন্ট্রোল
window.startCam = async (vid) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        document.getElementById(vid).srcObject = stream;
    } catch (e) { alert("Camera Error!"); }
};

window.snap = (vid, can, img) => {
    const v = document.getElementById(vid);
    const c = document.getElementById(can);
    const i = document.getElementById(img);
    if(!v.srcObject) return alert("Start Cam First!");
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
    i.src = c.toDataURL('image/jpeg');
    i.style.display = "block"; v.style.display = "none";
    v.srcObject.getTracks().forEach(t => t.stop());
};

// ৩. ডুপ্লিকেট চেক (Mobile/Email/PAN/Bank)
document.querySelectorAll('.check-db').forEach(el => {
    el.onblur = async (e) => {
        if (!e.target.value) return;
        const q = query(collection(db, "Worker_Registration"), where(e.target.dataset.field, "==", e.target.value.trim()));
        const snap = await getDocs(q);
        if (!snap.empty) {
            alert("Duplicate Entry! This information already exists.");
            e.target.value = "";
        }
    };
});

// ৪. কোয়ালিফিকেশন রো অ্যাড (Max 10)
window.addQualRow = () => {
    const body = document.getElementById('qualBody');
    if (body.rows.length < 10) {
        const row = body.insertRow();
        row.innerHTML = `<td><input type="text" class="form-control q-level" required></td>
            <td><input type="text" class="form-control q-board" required></td>
            <td><input type="number" class="form-control q-year" required></td>
            <td><input type="text" class="form-control q-res" required></td>
            <td><button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.parentElement.remove()">X</button></td>`;
    }
};

// ৫. সাবমিট লজিক
document.getElementById('registrationForm').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('subBtn');
    const uName = document.getElementById('fullName').value.replace(/\s+/g, '_');
    const mob = document.getElementById('mobile').value;
    const folder = `${uName}_${mob}`;

    btn.disabled = true; btn.innerText = "Registering...";

    try {
        // ল্যাঙ্গুয়েজ স্কিল সংগ্রহ
        const skills = {};
        document.querySelectorAll('.lang-check:checked').forEach(cb => {
            const l = cb.dataset.lang, s = cb.dataset.skill;
            if(!skills[l]) skills[l] = [];
            skills[l].push(s);
        });

        // ক্যানভাস থেকে ছবি সংগ্রহ
        const getBlob = (cid) => new Promise(res => {
            const cv = document.getElementById(cid);
            if(cv.width === 0) res(null); else cv.toBlob(res, 'image/jpeg');
        });

        const pBlob = await getBlob('c1');
        const sBlob = await getBlob('c2');
        if(!pBlob || !sBlob) throw new Error("Capture Both Live Photos!");

        // স্টোরেজে আপলোড
        const up = async (blob, fname) => {
            const r = ref(storage, `Worker_Registration/${folder}/${fname}.jpg`);
            await uploadBytes(r, blob);
            return getDownloadURL(r);
        };

        const finalData = {
            sponsorId: localStorage.getItem('userID') || "DIRECT",
            personal: { name: uName, mobile: mob, email: document.getElementById('email').value },
            kyc: { pan: document.getElementById('panNo').value.toUpperCase() },
            bank: { accNo: document.getElementById('acNo').value, ifsc: document.getElementById('ifsc').value.toUpperCase() },
            skills: skills,
            profileImg: await up(pBlob, "Profile"),
            panSelfieImg: await up(sBlob, "PAN_Selfie"),
            status: "pending",
            createdAt: serverTimestamp()
        };

        await addDoc(collection(db, "Worker_Registration"), finalData);
        alert("Registration Successful!");
        location.reload();
    } catch (err) { alert(err.message); btn.disabled = false; }
};