import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    
    // --- ১. সোয়াইপার স্লাইডার ইনিশিয়ালাইজ ---
    const swiper = new Swiper(".mySwiper", {
        loop: true,
        autoplay: { delay: 4000, disableOnInteraction: false },
        pagination: { el: ".swiper-pagination", clickable: true },
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
    });

    // --- ২. মোবাইল মেনু টগল লজিক ---
    window.toggleMenu = function() {
        const sidebar = document.getElementById('mobileSidebar');
        if(sidebar) {
            sidebar.classList.toggle('open');
        } else {
            // Backup logic for basic nav toggle
            const navBar = document.querySelector('nav');
            console.log("Sidebar element not found, checking nav...");
        }
    };

    // --- ৩. ডাটাবেস থেকে সার্ভিস লোড করা ---
    async function fetchServices() {
        const grid = document.getElementById('homeServiceGrid');
        if(!grid) return; 

        grid.innerHTML = `
            <div class="col-span-full flex justify-center items-center py-10">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
                <p class="ml-3 font-bold text-teal-800">সেবাগুলো লোড হচ্ছে...</p>
            </div>
        `;
        
        try {
            const snapshot = await getDocs(collection(db, "services_data"));
            grid.innerHTML = ""; 
            
            snapshot.forEach(doc => {
                const srv = doc.data();
                // সার্ভিস কার্ড ডিজাইন
                grid.innerHTML += `
                    <div class="service-item service-box" data-name="${srv.name.toLowerCase()}">
                        <i class="fas ${srv.icon || 'fa-concierge-bell'}" style="color: #004d40;"></i>
                        <h4 class="font-bold text-sm md:text-base">${srv.name}</h4>
                        <a href="pages/service-details.html?cat=${srv.category}" class="stretched-link"></a>
                    </div>
                `;
            });
        } catch (error) {
            console.error("Error fetching services: ", error);
            grid.innerHTML = "<p class='col-span-full text-center text-red-500'>সেবা লোড করতে সমস্যা হয়েছে। ইন্টারনেট কানেকশন চেক করুন।</p>";
        }
    }

    // --- ৪. সার্চ ফিল্টার লজিক ---
    const searchInput = document.getElementById('mainSearch');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const items = document.querySelectorAll('.service-item');
            
            items.forEach(item => {
                const name = item.getAttribute('data-name');
                if (name.includes(term)) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });
        });

        // Enter key feedback
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log('Searching for: ' + this.value);
            }
        });
    }

    // --- ৫. Go to Top বাটন লজিক ---
    const topBtn = document.getElementById("goToTop");
    window.addEventListener('scroll', () => {
        if (topBtn) {
            if (window.scrollY > 300) {
                topBtn.style.display = "flex";
            } else {
                topBtn.style.display = "none";
            }
        }
    });

    if(topBtn) {
        topBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // পেজ লোড হলে সার্ভিস কল করা
    fetchServices();
});

// 1. Modal Toggle Logic (For Terms & Conditions)
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal.classList.contains('hidden-modal')) {
        modal.classList.remove('hidden-modal');
    } else {
        modal.classList.add('hidden-modal');
    }
}

// 2. Service Posting Logic (Mock)
const serviceForm = document.getElementById('serviceForm');
if (serviceForm) {
    serviceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const serviceName = e.target[0].value;
        const offerPrice = e.target[2].value;
        
        alert(`অভিনন্দন! আপনার "${serviceName}" সার্ভিসটি ৳${offerPrice} দামে লাইভ করার জন্য রিকোয়েস্ট পাঠানো হয়েছে। অ্যাডমিন অ্যাপ্রুভ করলেই এটি দেখা যাবে।`);
        serviceForm.reset();
    });
}

// 3. Search Bar Interaction
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        alert('Searching for: ' + searchInput.value);
    }
});

// 4. Smooth Scroll (Optional handling)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});