<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { auth, googleProvider, ALLOWED_EMAIL, db } from '../firebase'
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore'
import { useRouter } from 'vue-router'

import AdminMessages  from './admin/AdminMessages.vue'
import AdminIntro     from './admin/AdminIntro.vue'
import AdminAbout     from './admin/AdminAbout.vue'
import AdminTechStack from './admin/AdminTechStack.vue'
import AdminExperience from './admin/AdminExperience.vue'
import AdminProjects  from './admin/AdminProjects.vue'

const router = useRouter()
const user = ref(null)
const authLoading = ref(true)
const isLoggingIn = ref(false)
const accessDenied = ref(false)
const activeSection = ref('messages')
const isSidebarOpen = ref(false)

const navItems = [
  { id: 'messages',   icon: 'inbox',               label: 'Messages' },
  { id: 'intro',      icon: 'edit_note',            label: 'Introduction' },
  { id: 'about',      icon: 'person',               label: 'About Me' },
  { id: 'techstack',  icon: 'code',                 label: 'Tech Stack' },
  { id: 'experience', icon: 'work',                 label: 'Experience' },
  { id: 'projects',   icon: 'folder_special',       label: 'Projects' },
]

const login = async () => {
  isLoggingIn.value = true
  accessDenied.value = false
  try {
    const result = await signInWithPopup(auth, googleProvider)
    if (result.user.email !== ALLOWED_EMAIL) {
      await signOut(auth)
      accessDenied.value = true
    }
  } catch (e) {
    console.error(e)
  } finally {
    isLoggingIn.value = false
  }
}

const logout = async () => {
  await signOut(auth)
  router.push('/')
}

const navigate = (id) => {
  activeSection.value = id
  isSidebarOpen.value = false
}

const DEFAULT_EXPERIENCE = [
  { company:'App Station', role:'Flutter Developer', period:'09/2024 - 02/2026', location:'Trivandrum, India', order:0,
    description:['Developed Khadoom, a cross-platform Flutter Mobile & Web application for the Qatar Olympic Committee','Implemented Clean Architecture for scalability and maintainability','Used Riverpod for efficient and predictable state management','Built responsive and reusable UI components optimized for Flutter Web','Integrated REST APIs and managed data flow across layers','Implemented features such as leave requests, approvals, and internal workflow management'] },
  { company:'Active Lobby', role:'Flutter Developer', period:'10/2022 - 09/2024', location:'Kochi', order:1,
    description:['Developed LM Pay, a Flutter Web & Mobile money exchange application','Enabled international remittance from UAE to multiple countries with multi-currency support','Implemented MVVM architecture for clean separation of UI, business logic, and data layers','Used Provider for efficient state management','Built responsive, reusable UI components for web and mobile','Integrated REST APIs for transactions, exchange rates, and user operations','Focused on performance, security, and scalable code practices'] },
  { company:'Tazy Solution', role:'Flutter Developer', period:'01/2022 - 10/2022', location:'Kannur, India', order:2,
    description:['Developed an internal Flutter mobile application for blood donation management','Implemented donor registration, blood group filtering, and request workflows','Used Firebase (Authentication, Firestore/Realtime DB, Notifications)','Applied Provider for efficient state management','Built clean, responsive, and reusable UI components','Ensured secure and reliable data handling for internal organizational use'] }
]

const DEFAULT_PROJECTS = [
  { order:0, title:'QuickReceipt', tags:['Flutter','Dart','Bloc','Firebase'], image:'/quick_receipt.jpg', detailsLink:'#', sourceLink:'#',
    description:'QuickReceipt is an all-in-one billing and business management app designed to simplify your daily operations. Instantly generate and print bills using a Bluetooth printer, while seamlessly managing your inventory, suppliers, and customers in one place.' },
  { order:1, title:'Shop Ledger', tags:['Flutter','Dart','Riverpod','Supabase'], image:'/shop_ledger.png', detailsLink:'#', sourceLink:'#',
    description:'Shop Ledger is a modern mobile application designed to simplify and digitize daily shop operations. It helps shop owners efficiently manage sales, purchases, expenses, credits, debits, customers, suppliers, and stock, all in one place.' },
  { order:2, title:'Dately', tags:['Flutter','Dart','Supabase','Real-time Chat'], image:'/dately.png', detailsLink:'#', sourceLink:'#',
    description:'Dately is a Flutter-based dating app that enables users to discover, match and chat with compatible profiles. It includes email authentication, swipe-based discovery, global search, real-time chat with text/image/audio support, and editable profiles.' },
  { order:3, title:'Spendly', tags:['Flutter','Dart','Firebase','Riverpod'], image:'/spendly.png', detailsLink:'#', sourceLink:'#',
    description:'Spendly is a smart expense tracker that helps you easily monitor your daily spending with clear and detailed statistics. It allows you to track expenses over time and manage your finances more effectively with monthly and yearly insights.' },
  { order:4, title:'Luckey Spinner', tags:['Flutter','Dart','SqfLite','Riverpod'], image:'/luckey_spinner.png', detailsLink:'#', sourceLink:'#',
    description:"Lucky Spinner lets you add names, spin the wheel, and instantly pick a random winner. It's perfect for games, quick decisions, giveaways, and fun group activities." },
  { order:5, title:'Flow Tracker', tags:['Flutter','Dart','SqfLite','Riverpod'], image:'/flow_track.png', detailsLink:'#', sourceLink:'#',
    description:'Flow Tracker is a period tracking app that helps women monitor their monthly cycle, predict upcoming periods and ovulation days, and receive timely reminders to stay prepared and informed.' },
  { order:6, title:'Time Tracker', tags:['Flutter','Dart','Sqflite'], image:'/Time_Tracker.png', detailsLink:'#', sourceLink:'#',
    description:'Time is a minimal and user-friendly mobile application designed to help individuals track their daily office working hours with precision. The app focuses on simplicity, clarity, and real-time feedback.' }
]

const seedInitialData = async () => {
  try {
    const expSnap = await getDocs(collection(db, 'experiences'))
    if (expSnap.empty) {
      const batch = writeBatch(db)
      DEFAULT_EXPERIENCE.forEach(exp => {
        batch.set(doc(collection(db, 'experiences')), exp)
      })
      await batch.commit()
      console.log('Seeded experiences')
    }

    const projSnap = await getDocs(collection(db, 'projects'))
    if (projSnap.empty) {
      const batch = writeBatch(db)
      DEFAULT_PROJECTS.forEach(proj => {
        batch.set(doc(collection(db, 'projects')), proj)
      })
      await batch.commit()
      console.log('Seeded projects')
    }
  } catch (e) {
    console.error('Failed to auto-seed data', e)
  }
}

let authUnsub = null
onMounted(() => {
  authUnsub = onAuthStateChanged(auth, (u) => {
    authLoading.value = false
    user.value = (u && u.email === ALLOWED_EMAIL) ? u : null
    if (user.value) {
      seedInitialData()
    }
  })
})
onUnmounted(() => { if (authUnsub) authUnsub() })
</script>

<template>
  <div class="admin-root">
    <div class="grain-overlay"></div>

    <!-- Loading -->
    <div v-if="authLoading" class="admin-center">
      <div class="admin-spinner"></div>
    </div>

    <!-- Login Screen -->
    <div v-else-if="!user" class="admin-center">
      <div class="login-card glass-card">
        <div class="login-logo">
          <span class="material-symbols-outlined">admin_panel_settings</span>
        </div>
        <h2>Admin Access</h2>
        <p>Sign in with the authorized Google account to manage your portfolio.</p>

        <div v-if="accessDenied" class="access-denied">
          <span class="material-symbols-outlined">block</span>
          Access denied. Only the authorized account may log in.
        </div>

        <button @click="login" class="btn btn-primary btn-lg google-btn" :disabled="isLoggingIn">
          <span v-if="isLoggingIn" class="spinner"></span>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {{ isLoggingIn ? 'Signing in…' : 'Sign in with Google' }}
        </button>
        <a href="/" class="back-link">
          <span class="material-symbols-outlined" style="font-size:16px">arrow_back</span>
          Back to Portfolio
        </a>
      </div>
    </div>

    <!-- Dashboard -->
    <div v-else class="admin-layout">
      <!-- Mobile overlay -->
      <div v-if="isSidebarOpen" class="sidebar-overlay" @click="isSidebarOpen=false"></div>

      <!-- Sidebar -->
      <aside :class="['admin-sidebar', isSidebarOpen ? 'sidebar--open' : '']">
        <div class="sidebar-logo">
          <span class="material-symbols-outlined">terminal</span>
          <span>Portfolio CMS</span>
        </div>

        <div class="sidebar-user">
          <img :src="user.photoURL" :alt="user.displayName" class="user-avatar" />
          <div class="user-info">
            <span class="user-name">{{ user.displayName }}</span>
            <span class="user-email">{{ user.email }}</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <button
            v-for="item in navItems" :key="item.id"
            :class="['sidebar-nav-item', activeSection===item.id?'active':'']"
            @click="navigate(item.id)"
          >
            <span class="material-symbols-outlined">{{ item.icon }}</span>
            {{ item.label }}
          </button>
        </nav>

        <div class="sidebar-footer">
          <a href="/" class="sidebar-nav-item">
            <span class="material-symbols-outlined">open_in_new</span>
            View Portfolio
          </a>
          <button @click="logout" class="sidebar-nav-item logout-btn">
            <span class="material-symbols-outlined">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      <!-- Main -->
      <main class="admin-main">
        <!-- Mobile topbar -->
        <div class="mobile-topbar">
          <button class="icon-btn-bare" @click="isSidebarOpen=true">
            <span class="material-symbols-outlined">menu</span>
          </button>
          <span class="mobile-section-title">{{ navItems.find(n=>n.id===activeSection)?.label }}</span>
        </div>

        <AdminMessages  v-if="activeSection==='messages'" />
        <AdminIntro     v-if="activeSection==='intro'" />
        <AdminAbout     v-if="activeSection==='about'" />
        <AdminTechStack v-if="activeSection==='techstack'" />
        <AdminExperience v-if="activeSection==='experience'" />
        <AdminProjects  v-if="activeSection==='projects'" />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-root { min-height:100vh; background:var(--bg-primary); position:relative; }
.admin-center { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:2rem; }
.admin-spinner { width:48px;height:48px;border:3px solid var(--border-subtle);border-top-color:var(--accent-violet);border-radius:50%;animation:spin 0.8s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }

/* Login */
.login-card { width:100%;max-width:420px;padding:2.5rem;display:flex;flex-direction:column;align-items:center;gap:1rem;text-align:center; }
.login-logo { width:64px;height:64px;border-radius:16px;background:linear-gradient(135deg,rgba(139,92,246,0.2),rgba(34,211,238,0.1));border:1px solid rgba(139,92,246,0.3);display:flex;align-items:center;justify-content:center; }
.login-logo .material-symbols-outlined { font-size:32px;color:var(--accent-violet); }
.login-card h2 { font-size:1.5rem;color:var(--text-primary); }
.login-card p { font-size:0.9rem;color:var(--text-muted); }
.google-btn { width:100%;justify-content:center;gap:0.625rem;margin-top:0.5rem; }
.access-denied { display:flex;align-items:center;gap:0.5rem;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:#ef4444;border-radius:10px;padding:0.75rem 1rem;font-size:0.875rem;width:100%; }
.back-link { display:inline-flex;align-items:center;gap:0.35rem;font-size:0.875rem;color:var(--text-muted);text-decoration:none;transition:color 0.2s; }
.back-link:hover { color:var(--accent-violet); }

/* Layout */
.admin-layout { display:flex; min-height:100vh; }

/* Sidebar */
.admin-sidebar {
  width:240px;min-width:240px;background:var(--bg-secondary);
  border-right:1px solid var(--border-subtle);
  display:flex;flex-direction:column;
  position:sticky;top:0;height:100vh;overflow-y:auto;
}
.sidebar-logo { display:flex;align-items:center;gap:0.6rem;padding:1.25rem 1rem;font-weight:700;font-size:0.9rem;color:var(--text-primary);font-family:var(--font-heading);border-bottom:1px solid var(--border-subtle); }
.sidebar-logo .material-symbols-outlined { font-size:20px;color:var(--accent-violet); }
.sidebar-user { display:flex;align-items:center;gap:0.625rem;padding:1rem;border-bottom:1px solid var(--border-subtle); }
.user-avatar { width:34px;height:34px;border-radius:50%;object-fit:cover; }
.user-info { display:flex;flex-direction:column;overflow:hidden; }
.user-name { font-size:0.8rem;font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
.user-email { font-size:0.7rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
.sidebar-nav { flex:1;padding:0.625rem;display:flex;flex-direction:column;gap:0.2rem; }
.sidebar-nav-item { display:flex;align-items:center;gap:0.625rem;padding:0.55rem 0.75rem;border-radius:8px;font-size:0.8375rem;font-weight:500;color:var(--text-secondary);text-decoration:none;cursor:pointer;transition:all 0.2s;border:none;background:none;width:100%;text-align:left; }
.sidebar-nav-item:hover { background:var(--bg-card);color:var(--text-primary); }
.sidebar-nav-item.active { background:rgba(139,92,246,0.12);color:var(--accent-violet); }
.sidebar-nav-item .material-symbols-outlined { font-size:18px; }
.sidebar-footer { padding:0.625rem;border-top:1px solid var(--border-subtle);display:flex;flex-direction:column;gap:0.2rem; }
.logout-btn { color:#ef4444!important; }
.logout-btn:hover { background:rgba(239,68,68,0.1)!important; }

/* Main */
.admin-main { flex:1;overflow-y:auto;min-width:0; }

/* Mobile topbar */
.mobile-topbar { display:none;align-items:center;gap:0.75rem;padding:1rem 1.25rem;border-bottom:1px solid var(--border-subtle);background:var(--bg-secondary); }
.mobile-section-title { font-weight:600;font-size:1rem;color:var(--text-primary); }
.icon-btn-bare { background:none;border:none;cursor:pointer;color:var(--text-primary);display:flex;align-items:center; }
.icon-btn-bare .material-symbols-outlined { font-size:24px; }

/* Spinner */
.spinner { width:15px;height:15px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite;flex-shrink:0; }

/* Mobile responsive */
@media(max-width:768px) {
  .admin-sidebar {
    position:fixed;left:-260px;top:0;z-index:200;height:100vh;
    width:240px;transition:left 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  .admin-sidebar.sidebar--open { left:0; }
  .sidebar-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:199;backdrop-filter:blur(2px); }
  .mobile-topbar { display:flex; }
}
</style>
