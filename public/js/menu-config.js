// SmartSeva Connect - Updated Role Based Menu Configuration
// এখানে Expert Recruitment এবং Admin Control যোগ করা হয়েছে।

export const menuItems = [
    { 
        title: "Overview", 
        file: "overview.html", 
        icon: "fa-th-large", 
        roles: ["CEO", "Manager", "Supervisor", "Accountant", "Associate", "Worker-Type-1"] 
    },
    { 
        title: "Expert Recruitment", 
        file: "expert-recruitment.html", 
        icon: "fa-user-plus", // নতুন আইকন
        roles: ["CEO", "Associate"] // কারা রিক্রুট করতে পারবে
    },
    { 
        title: "Manage Experts", 
        file: "expert-admin.html", 
        icon: "fa-users-cog", 
        roles: ["CEO", "Manager"] // শুধুমাত্র এডমিন ও ম্যানেজার দেখবে
    },
    { 
        title: "Associate Requests", 
        file: "admin_provider_appr.html", 
        icon: "fa-user-check", 
        roles: ["CEO", "Manager"] 
    },
    { 
        title: "New Worker", 
        file: "worker_registration.html", 
        icon: "fa-user-plus", 
        roles: ["CEO", "Associate"] 
    },
    { 
        title: "Cash Load (Wallet)", 
        file: "deposit-manager.html", 
        icon: "fa-wallet", 
        roles: ["CEO", "Manager", "Accountant"] 
    },
    { 
        title: "Accounts & Payouts", 
        file: "wallet-admin.html", 
        icon: "fa-hand-holding-usd", 
        roles: ["CEO", "Accountant"] 
    },
    { 
        title: "Assign Services", 
        file: "service-assign.html", 
        icon: "fa-tasks", 
        roles: ["CEO", "Supervisor"] 
    },
    { 
        title: "Task Manager", 
        file: "tasks.html", 
        icon: "fa-list-check", 
        roles: ["CEO", "Supervisor", "Worker-Type-1"] 
    },
    { 
        title: "Card Manager", 
        icon: "fa-id-card", 
        file: "card_manager_pro.html", 
        roles: ["CEO"] 
    },
    { 
        title: "Team Transfer", 
        file: "team_transfer.html", 
        icon: "fa-exchange-alt", 
        roles: ["CEO", "Manager"] 
    },
    { 
        title: "Rank Settings", 
        file: "rank-settings.html", 
        icon: "fa-layer-group", 
        roles: ["CEO"] 
    },
    { 
        title: "Member Control", 
        file: "admin-control.html", 
        icon: "fa-users-cog", 
        roles: ["CEO"] 
    },
    { 
        title: "Settings", 
        file: "settings.html", 
        icon: "fa-user-cog", 
        roles: ["CEO", "Manager", "Supervisor", "Accountant", "Associate", "Worker-Type-1"] 
    }
];