<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import ContactSection from './ContactSection.vue'
import { db } from '../firebase'
import { doc, onSnapshot, collection, query } from 'firebase/firestore'

const router = useRouter()

// ── Defaults (shown before/if Firestore has no data) ──────────────────────────
const DEF_INTRO = {
  name: 'Stibin Augustine',
  typingText: 'Flutter Developer.',
  summary: 'Flutter Developer with 4+ years of experience and strong skills in mobile application design and API integration. Committed to enhancing user experience through performance optimization and effective state management.',
  badgeText: 'Available for new projects',
  available: true,
  resumeUrl: 'https://drive.google.com/file/d/1riw-nzBdyMfbCXW4ShIpb_XRhaZFYJE7/view?usp=sharing'
}
const DEF_SKILLS = ['Flutter','Dart','Firebase','REST API','State Management','Clean Architecture','Git','Riverpod','Bloc','Provider','UI/UX Implementation']
const DEF_EXPERIENCE = [
  { company:'App Station', role:'Flutter Developer', period:'09/2024 - 02/2026', location:'Trivandrum, India', description:['Developed Khadoom, a cross-platform Flutter Mobile & Web application for the Qatar Olympic Committee','Implemented Clean Architecture for scalability and maintainability','Used Riverpod for efficient and predictable state management','Built responsive and reusable UI components optimized for Flutter Web','Integrated REST APIs and managed data flow across layers','Implemented features such as leave requests, approvals, and internal workflow management'] },
  { company:'Active Lobby', role:'Flutter Developer', period:'10/2022 - 09/2024', location:'Kochi', description:['Developed LM Pay, a Flutter Web & Mobile money exchange application','Enabled international remittance from UAE to multiple countries with multi-currency support','Implemented MVVM architecture for clean separation of UI, business logic, and data layers','Used Provider for efficient state management','Built responsive, reusable UI components for web and mobile','Integrated REST APIs for transactions, exchange rates, and user operations','Focused on performance, security, and scalable code practices'] },
  { company:'Tazy Solution', role:'Flutter Developer', period:'01/2022 - 10/2022', location:'Kannur, India', description:['Developed an internal Flutter mobile application for blood donation management','Implemented donor registration, blood group filtering, and request workflows','Used Firebase (Authentication, Firestore/Realtime DB, Notifications)','Applied Provider for efficient state management','Built clean, responsive, and reusable UI components','Ensured secure and reliable data handling for internal organizational use'] }
]
const DEF_PROJECTS = [
  { title:'QuickReceipt', tags:['Flutter','Dart','Bloc','Firebase'], description:'QuickReceipt is an all-in-one billing and business management app designed to simplify your daily operations. Instantly generate and print bills using a Bluetooth printer, while seamlessly managing your inventory, suppliers, and customers in one place.', image:'/quick_receipt.jpg', detailsLink:'#', sourceLink:'#' },
  { title:'Shop Ledger', tags:['Flutter','Dart','Riverpod','Supabase'], description:'Shop Ledger is a modern mobile application designed to simplify and digitize daily shop operations. It helps shop owners efficiently manage sales, purchases, expenses, credits, debits, customers, suppliers, and stock, all in one place.', image:'/shop_ledger.png', detailsLink:'#', sourceLink:'#' },
  { title:'Dately', tags:['Flutter','Dart','Supabase','Real-time Chat'], description:'Dately is a Flutter-based dating app that enables users to discover, match and chat with compatible profiles. It includes email authentication, swipe-based discovery, global search, real-time chat with text/image/audio support, and editable profiles.', image:'/dately.png', detailsLink:'#', sourceLink:'#' },
  { title:'Spendly', tags:['Flutter','Dart','Firebase','Riverpod'], description:'Spendly is a smart expense tracker that helps you easily monitor your daily spending with clear and detailed statistics. It allows you to track expenses over time and manage your finances more effectively with monthly and yearly insights.', image:'/spendly.png', detailsLink:'#', sourceLink:'#' },
  { title:'Luckey Spinner', tags:['Flutter','Dart','SqfLite','Riverpod'], description:"Lucky Spinner lets you add names, spin the wheel, and instantly pick a random winner. It's perfect for games, quick decisions, giveaways, and fun group activities.", image:'/luckey_spinner.png', detailsLink:'#', sourceLink:'#' },
  { title:'Flow Tracker', tags:['Flutter','Dart','SqfLite','Riverpod'], description:'Flow Tracker is a period tracking app that helps women monitor their monthly cycle, predict upcoming periods and ovulation days, and receive timely reminders to stay prepared and informed.', image:'/flow_track.png', detailsLink:'#', sourceLink:'#' },
  { title:'Time Tracker', tags:['Flutter','Dart','Sqflite'], description:'Time is a minimal and user-friendly mobile application designed to help individuals track their daily office working hours with precision. The app focuses on simplicity, clarity, and real-time feedback.', image:'/Time_Tracker.png', detailsLink:'#', sourceLink:'#' }
]
const DEF_ABOUT = { content:'As a passionate Flutter Developer, I specialize in building high-performance mobile applications. With a deep understanding of Clean Architecture and State Management, I create scalable and maintainable codebases. I am always eager to learn new technologies and improve my skills.' }
const DEF_CONTACT = { email:'stibinaugustine3047@gmail.com', phone:'+971 58 308 1024', location:'Bur Dubai, Dubai, UAE', social:[{name:'GitHub',icon:'code',link:'https://github.com/stibinottathai',text:'github.com/stibin'},{name:'LinkedIn',icon:'work',link:'https://in.linkedin.com/in/stibin-augustine-8075b1197',text:'linkedin.com/in/stibin'}] }

// ── Reactive state (starts with defaults) ──────────────────────────────────────
const name = ref(DEF_INTRO.name)
const summary = ref(DEF_INTRO.summary)
const badgeText = ref(DEF_INTRO.badgeText)
const isAvailable = ref(DEF_INTRO.available)
const typingTextSource = ref('') // Start empty to prevent flashing default title before Firestore loads
const profileImage = ref('')
const aboutContent = ref(DEF_ABOUT.content)
const skills = ref([]) // Start empty to prevent flashing default skills
const experience = ref([]) // Start empty to prevent flashing default experience
const projects = ref([]) // Start empty to prevent flashing default projects
const showAllProjects = ref(false)
const visibleProjects = computed(() => {
  return showAllProjects.value ? projects.value : projects.value.slice(0, 6)
})
// Doubled skill list for a seamless marquee loop. Kept as a computed so the
// array reference is stable across the hero's frequent typing re-renders.
const marqueeSkills = computed(() => skills.value.concat(skills.value))
const contactDetails = ref(DEF_CONTACT)
const resumeUrl = ref(DEF_INTRO.resumeUrl)

let observer = null

const setupReveal = () => {
  if (!observer) return
  nextTick(() => {
    document.querySelectorAll('.reveal:not([data-observed="true"])').forEach((el) => {
      el.dataset.observed = "true"
      observer.observe(el)
    })
  })
}

watch([skills, experience, projects], () => {
  setupReveal()
}, { deep: true })

watch(showAllProjects, (val) => {
  if (val) {
    nextTick(() => {
      document.querySelectorAll('#works .grid > .reveal:not(.active)').forEach((el) => {
        el.classList.add('active')
      })
    })
  }
})

// ── Firestore loader (Real-time) ──────────────────────────────────────────────
const loadPortfolioData = () => {
  // 1. Config (intro, about, skills)
  onSnapshot(doc(db, 'portfolio', 'config'), (snap) => {
    if (snap.exists()) {
      const d = snap.data()
      if (d.intro) {
        name.value = d.intro.name || DEF_INTRO.name
        summary.value = d.intro.summary || DEF_INTRO.summary
        badgeText.value = d.intro.badgeText || DEF_INTRO.badgeText
        isAvailable.value = d.intro.available !== undefined ? d.intro.available : true
        typingTextSource.value = d.intro.typingText || DEF_INTRO.typingText
        profileImage.value = d.intro.profileImageUrl || '/profile.png'
        resumeUrl.value = d.intro.resumeUrl || DEF_INTRO.resumeUrl
      }
      if (d.skills !== undefined) {
        skills.value = d.skills
      } else {
        skills.value = DEF_SKILLS
      }
      if (d.about) {
        aboutContent.value = d.about.content || DEF_ABOUT.content
        contactDetails.value = {
          email: d.about.email || DEF_CONTACT.email,
          phone: d.about.phone || DEF_CONTACT.phone,
          location: d.about.location || DEF_CONTACT.location,
          social: [
            { name:'GitHub', icon:'code', link: d.about.github || DEF_CONTACT.social[0].link, text:'github.com/stibin' },
            { name:'LinkedIn', icon:'work', link: d.about.linkedin || DEF_CONTACT.social[1].link, text:'linkedin.com/in/stibin' }
          ]
        }
      }
    } else {
      skills.value = DEF_SKILLS
    }
  }, (e) => {
    console.warn('Config sync failed:', e)
    skills.value = DEF_SKILLS
  })

  // 2. Experiences
  onSnapshot(collection(db, 'experiences'), (snap) => {
    if (!snap.empty) {
      experience.value = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.order || 0) - (b.order || 0))
    } else {
      experience.value = DEF_EXPERIENCE
    }
  }, (e) => {
    console.warn('Experience sync failed:', e)
    experience.value = DEF_EXPERIENCE
  })

  // 3. Projects
  onSnapshot(collection(db, 'projects'), (snap) => {
    if (!snap.empty) {
      projects.value = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.order || 0) - (b.order || 0))
    } else {
      projects.value = DEF_PROJECTS
    }
  }, (e) => {
    console.warn('Projects sync failed:', e)
    projects.value = DEF_PROJECTS
  })
}

// ── Theme ──────────────────────────────────────────────────────────────────────
const isDark = ref(false)
const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.theme = isDark.value ? 'dark' : 'light'
}

// ── Mouse parallax ─────────────────────────────────────────────────────────────
const mouseX = ref(0)
const mouseY = ref(0)
const handleMouseMove = (event) => {
  mouseX.value = (event.clientX / window.innerWidth) - 0.5
  mouseY.value = (event.clientY / window.innerHeight) - 0.5
}

// ── Typing effect ──────────────────────────────────────────────────────────────
const typingText = ref('')
const isTyping = ref(true)
let charIndex = 0
let typingTimeout = null

const typeEffect = () => {
  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }
  charIndex = 0
  typingText.value = ''

  const src = typingTextSource.value
  if (!src) {
    isTyping.value = false
    return
  }

  isTyping.value = true
  const tick = () => {
    const currentSrc = typingTextSource.value
    if (charIndex <= currentSrc.length) {
      typingText.value = currentSrc.substring(0, currentSrc.length >= charIndex ? charIndex : currentSrc.length)
      charIndex++
      typingTimeout = setTimeout(tick, 80)
    } else {
      isTyping.value = false
      typingTimeout = null
    }
  }
  tick()
}

const isMenuOpen = ref(false)

watch(typingTextSource, () => {
  typeEffect()
})

onMounted(() => {
  // Default to the light (cream) theme to match the design; only use dark
  // when the visitor has explicitly opted into it before.
  if (localStorage.theme === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  }

  // Attach observer immediately so elements fade in instantly with default data
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('active')
    })
  }, { threshold: 0.1 })
  
  // Need slight delay for DOM to be ready before querySelectorAll inside onMounted
  setTimeout(() => {
    setupReveal()
  }, 50)

  typeEffect()
  window.addEventListener('mousemove', handleMouseMove)

  // Load Firestore data asynchronously without blocking the UI rendering
  loadPortfolioData()

  // Fallback in case Firestore takes too long or fails to load
  setTimeout(() => {
    if (!typingTextSource.value) {
      typingTextSource.value = DEF_INTRO.typingText
    }
    if (skills.value.length === 0) {
      skills.value = DEF_SKILLS
    }
    if (experience.value.length === 0) {
      experience.value = DEF_EXPERIENCE
    }
    if (projects.value.length === 0) {
      projects.value = DEF_PROJECTS
    }
  }, 4000)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  if (typingTimeout) {
    clearTimeout(typingTimeout)
  }
})

const scrollToSection = (id) => {
  isMenuOpen.value = false
  const element = document.getElementById(id)
  if (element) element.scrollIntoView({ behavior: 'smooth' })
}

const expandedProjects = ref([])
const toggleExpand = (index) => {
  if (expandedProjects.value.includes(index)) {
    expandedProjects.value = expandedProjects.value.filter(i => i !== index)
  } else {
    expandedProjects.value.push(index)
  }
}

const selectedImage = ref(null)
const openImageModal = (imageUrl) => {
  selectedImage.value = imageUrl
  document.body.style.overflow = 'hidden'
}
const closeImageModal = () => {
  selectedImage.value = null
  document.body.style.overflow = 'auto'
}
</script>

<template>
  <div class="bg-background text-on-background font-body-md selection:bg-brush/30 selection:text-primary transition-colors duration-300 pt-[14px] md:pt-[22px]">
    <!-- Yellow mat frame (reference look) -->
    <div class="page-frame"></div>
    <!-- Fine paper grain for physical depth -->
    <div class="paper-grain"></div>

    <!-- Navigation — floating glass pill -->
    <nav class="sticky top-[26px] md:top-[38px] z-50 px-gutter">
      <div class="max-w-container-max mx-auto">
        <div class="flex justify-between items-center gap-4 h-16 pl-6 pr-3 rounded-full bg-cream/70 dark:bg-surface-container/70 backdrop-blur-xl border border-black/5 dark:border-outline/15 shadow-[0_18px_40px_-24px_rgba(58,42,18,0.35)]">
          <a class="flex items-center gap-2.5 shrink-0" href="#" @click.prevent="scrollToSection('home')">
            <!-- Profile photo — mobile only -->
            <img :src="profileImage || '/profile.png'" :alt="name" class="md:hidden w-10 h-10 rounded-full object-cover object-[center_35%] ring-2 ring-brush/40 shadow-sm" />
            <span class="font-script text-3xl md:text-4xl text-primary dark:text-primary-fixed tracking-tight leading-none">
              {{ name.split(' ')[0] }}
            </span>
          </a>
          <div class="hidden md:flex items-center gap-1">
            <a class="px-4 py-2 rounded-full text-sm font-semibold text-on-surface-variant dark:text-on-surface-variant hover:text-brush hover:bg-brush/10 transition-colors duration-300" href="#services" @click.prevent="scrollToSection('services')">Services</a>
            <a class="px-4 py-2 rounded-full text-sm font-semibold text-on-surface-variant dark:text-on-surface-variant hover:text-brush hover:bg-brush/10 transition-colors duration-300" href="#experience" @click.prevent="scrollToSection('experience')">Experience</a>
            <a class="px-4 py-2 rounded-full text-sm font-semibold text-on-surface-variant dark:text-on-surface-variant hover:text-brush hover:bg-brush/10 transition-colors duration-300" href="#works" @click.prevent="scrollToSection('works')">Works</a>
            <a class="px-4 py-2 rounded-full text-sm font-semibold text-on-surface-variant dark:text-on-surface-variant hover:text-brush hover:bg-brush/10 transition-colors duration-300" href="#contact" @click.prevent="scrollToSection('contact')">Contact</a>
          </div>
          <div class="flex items-center gap-2">
            <!-- Theme Toggle -->
            <button @click="toggleTheme" class="w-10 h-10 rounded-full border border-outline/25 flex items-center justify-center text-primary dark:text-primary-fixed hover:bg-brush/10 hover:border-brush/40 transition-all" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
              <span class="material-symbols-outlined text-xl">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
            </button>
            <!-- Admin Access -->
            <button @click="router.push('/admin')" class="hidden sm:flex w-10 h-10 rounded-full border border-outline/25 items-center justify-center text-primary dark:text-primary-fixed hover:bg-brush/10 hover:border-brush/40 transition-all" title="Admin Panel">
              <span class="material-symbols-outlined text-xl">lock</span>
            </button>
            <!-- Resume Button (island) -->
            <a :href="resumeUrl" target="_blank" class="hidden md:inline-flex btn-island !pl-5 !py-2 text-sm">
              Résumé
              <span class="btn-ic"><span class="material-symbols-outlined text-lg">download</span></span>
            </a>
            <button class="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-primary dark:text-primary-fixed" @click="isMenuOpen = !isMenuOpen" aria-label="Toggle menu">
              <span class="material-symbols-outlined text-3xl">{{ isMenuOpen ? 'close' : 'menu' }}</span>
            </button>
          </div>
        </div>
      </div>
      <!-- Mobile Menu Dropdown -->
      <div v-show="isMenuOpen" class="md:hidden max-w-container-max mx-auto mt-3 bg-cream/95 dark:bg-surface-container/95 backdrop-blur-xl border border-black/5 dark:border-outline/20 rounded-[1.75rem] flex flex-col p-6 gap-2 shadow-[0_24px_50px_-24px_rgba(58,42,18,0.4)]">
        <a class="px-4 py-3 rounded-2xl text-on-surface-variant dark:text-on-surface-variant hover:text-brush hover:bg-brush/10 font-semibold transition-colors" href="#services" @click="scrollToSection('services')">Services</a>
        <a class="px-4 py-3 rounded-2xl text-on-surface-variant dark:text-on-surface-variant hover:text-brush hover:bg-brush/10 font-semibold transition-colors" href="#experience" @click="scrollToSection('experience')">Experience</a>
        <a class="px-4 py-3 rounded-2xl text-on-surface-variant dark:text-on-surface-variant hover:text-brush hover:bg-brush/10 font-semibold transition-colors" href="#works" @click="scrollToSection('works')">Works</a>
        <a class="px-4 py-3 rounded-2xl text-on-surface-variant dark:text-on-surface-variant hover:text-brush hover:bg-brush/10 font-semibold transition-colors" href="#contact" @click="scrollToSection('contact')">Contact</a>
        <a :href="resumeUrl" target="_blank" class="mt-2 btn-island justify-center" @click="isMenuOpen = false">
          Download Résumé
          <span class="btn-ic"><span class="material-symbols-outlined text-lg">download</span></span>
        </a>
      </div>
    </nav>

    <main>
      <!-- Hero Section -->
      <section id="home" class="relative max-w-container-max mx-auto px-gutter pt-10 md:pt-16 pb-section-gap grid grid-cols-1 md:grid-cols-12 gap-10 items-center overflow-hidden">
        <!-- Ambient color splashes -->
        <div class="absolute inset-0 -z-0 pointer-events-none">
          <div class="absolute -top-16 -left-24 w-80 h-80 bg-brush/25 rounded-full blur-[110px]"></div>
          <div class="absolute top-1/4 -right-10 w-72 h-72 bg-sun/30 rounded-full blur-[110px]"></div>
          <div class="absolute bottom-0 left-1/3 w-64 h-64 bg-accent/20 rounded-full blur-[110px]"></div>
        </div>
        <div class="md:col-span-7 space-y-8 relative z-10">
          <div class="eyebrow hero-in hero-in-1">
            <span class="live-dot" v-if="isAvailable"></span>
            {{ badgeText }}
          </div>
          <div class="space-y-stack-sm">
            <h1 class="font-display text-[34px] sm:text-5xl md:text-6xl text-primary dark:text-primary-fixed leading-[0.98] tracking-tight">
              <span class="block hero-in hero-in-1">Hey there,</span>
              <span class="block hero-in hero-in-2">I'm <span class="italic font-extrabold relative inline-block bg-gradient-to-r from-brush via-accent to-sun bg-clip-text text-transparent pr-1">
                {{ name.split(' ')[0] }}
                <svg class="squiggle absolute -bottom-2 left-0 w-full h-3 text-brush/70 -z-10" preserveAspectRatio="none" viewBox="0 0 100 20">
                  <path d="M0,10 Q50,0 100,10 T200,10" fill="none" stroke="currentColor" stroke-width="15"></path>
                </svg>
              </span></span>
              <span class="block hero-in hero-in-3 text-brush font-extrabold">{{ typingText }}<span v-show="isTyping" class="typing-cursor"></span></span>
            </h1>
          </div>
          <p class="hero-in hero-in-3 font-body-lg text-on-surface-variant dark:text-on-surface-variant/80 max-w-[46ch] leading-relaxed">
            {{ summary }}
          </p>
          <div class="hero-in hero-in-4 flex flex-wrap items-center gap-4 pt-2">
            <a class="btn-island" :href="'mailto:' + contactDetails.email">
              Get in touch
              <span class="btn-ic"><span class="material-symbols-outlined text-lg">arrow_outward</span></span>
            </a>
            <a class="btn-outline" :href="resumeUrl" target="_blank">
              <span class="material-symbols-outlined text-lg">download</span>
              Download résumé
            </a>
          </div>
          <div class="hero-in hero-in-5 flex items-center gap-8 pt-6">
            <div class="flex items-baseline gap-3">
              <span class="text-5xl md:text-6xl font-extrabold text-primary dark:text-primary-fixed leading-none">4+</span>
              <span class="text-xs font-bold text-on-surface-variant dark:text-on-surface-variant/80 uppercase tracking-widest leading-tight">Years<br/>experience</span>
            </div>
          </div>
        </div>

        <div class="hidden md:flex order-first md:order-none md:col-span-5 relative justify-end md:justify-center items-center py-0 md:py-6 hero-in hero-in-2">
          <!-- Organic teal brush stroke behind the portrait -->
          <div class="brush-stroke absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[420px] md:h-[420px] opacity-90 pointer-events-none hidden md:block"></div>
          <!-- Soft color splashes behind the avatar (desktop only) -->
          <div class="absolute inset-0 z-0 pointer-events-none hidden md:block">
            <div class="absolute top-2 right-10 w-44 h-44 bg-sun/40 rounded-full blur-[90px]"></div>
            <div class="absolute bottom-4 left-6 w-52 h-52 bg-accent/25 rounded-full blur-[90px]"></div>
          </div>
          <div class="group relative w-[130px] ml-auto md:w-full md:max-w-[320px] md:ml-0 z-10">
            <!-- Profile photo, circular framed -->
            <div class="relative aspect-square rounded-full overflow-hidden bg-cream ring-1 ring-black/5 dark:ring-white/10 shadow-[var(--shadow-lift)]">
              <img :src="profileImage || '/profile.png'" :alt="name" class="w-full h-full object-cover object-[center_55%] group-hover:scale-[1.04] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]" />
              <!-- subtle inner rim for a machined edge -->
              <div class="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_2px_10px_rgba(0,0,0,0.12),inset_0_0_0_1px_rgba(255,255,255,0.25)]"></div>
            </div>
            <!-- Rotating certified stamp -->
            <div class="hidden md:block absolute -bottom-3 -right-3 w-20 h-20 md:w-24 md:h-24">
              <svg class="stamp-ring absolute inset-0 w-full h-full text-primary dark:text-primary-fixed" viewBox="0 0 100 100">
                <defs>
                  <path id="stampCircle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                </defs>
                <circle cx="50" cy="50" r="46" fill="var(--cream)" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 3" />
                <text fill="currentColor" font-size="9" font-weight="700" letter-spacing="2">
                  <textPath href="#stampCircle" startOffset="0%">CERTIFIED · PROFESSIONAL · DEVELOPER · </textPath>
                </text>
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="material-symbols-outlined text-brush text-3xl">verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Skills Marquee -->
      <section v-if="skills.length" aria-label="Core skills" class="relative overflow-hidden py-8 border-y border-outline-variant/20 dark:border-outline/10">
        <div class="marquee-wrap relative overflow-hidden">
          <div class="marquee">
            <span v-for="(skill, i) in marqueeSkills" :key="i + '-' + skill" class="skill-chip">
              <span class="dot"></span>{{ skill }}
            </span>
          </div>
          <!-- edge fades -->
          <div class="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
          <div class="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
        </div>
      </section>

      <!-- Services/Help Section -->
      <section id="services" class="bg-surface-container-low dark:bg-surface-container-low/20 py-section-gap transition-colors duration-300 relative overflow-hidden">
        <!-- Color splashes -->
        <div class="absolute inset-0 z-0 pointer-events-none">
          <div class="absolute top-0 -left-20 w-72 h-72 bg-sun/28 rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 right-1/4 w-72 h-72 bg-brush/24 rounded-full blur-3xl"></div>
          <div class="absolute top-1/3 -right-16 w-64 h-64 bg-accent/22 rounded-full blur-3xl"></div>
        </div>
        <div class="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <!-- Mobile App Dev -->
          <div class="bezel lift reveal group">
            <div class="bezel-inner dark:!bg-surface-container p-8 flex flex-col gap-5 h-full">
              <div class="w-16 h-16 rounded-2xl bg-brush flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <span class="material-symbols-outlined text-3xl">smartphone</span>
              </div>
              <div class="flex flex-col gap-3">
                <h3 class="font-headline-md text-primary dark:text-primary-fixed">Mobile app development</h3>
                <p class="text-on-surface-variant dark:text-on-surface-variant/80 leading-relaxed">
                  Cross-platform iOS and Android apps from a single codebase — smooth, native-feeling and built to perform.
                </p>
                <span class="text-xs font-bold uppercase tracking-widest text-brush">Flutter &amp; Dart</span>
              </div>
            </div>
          </div>
          <!-- Web & Desktop -->
          <div class="bezel lift reveal reveal-d1 group">
            <div class="bezel-inner dark:!bg-surface-container p-8 flex flex-col gap-5 h-full">
              <div class="w-16 h-16 rounded-2xl bg-sun flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <span class="material-symbols-outlined text-3xl">laptop_mac</span>
              </div>
              <div class="flex flex-col gap-3">
                <h3 class="font-headline-md text-primary dark:text-primary-fixed">Web &amp; desktop</h3>
                <p class="text-on-surface-variant dark:text-on-surface-variant/80 leading-relaxed">
                  Responsive web and desktop interfaces that share logic with your mobile app and adapt cleanly to any screen.
                </p>
                <span class="text-xs font-bold uppercase tracking-widest text-brush">Flutter Web &amp; Vue.js</span>
              </div>
            </div>
          </div>
          <!-- APIs & Clean Arch -->
          <div class="bezel lift reveal reveal-d2 group">
            <div class="bezel-inner dark:!bg-surface-container p-8 flex flex-col gap-5 h-full">
              <div class="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <span class="material-symbols-outlined text-3xl">api</span>
              </div>
              <div class="flex flex-col gap-3">
                <h3 class="font-headline-md text-primary dark:text-primary-fixed">APIs &amp; clean architecture</h3>
                <p class="text-on-surface-variant dark:text-on-surface-variant/80 leading-relaxed">
                  REST API integration and layered, testable architecture that keeps the codebase easy to maintain as it grows.
                </p>
                <span class="text-xs font-bold uppercase tracking-widest text-brush">Clean Architecture &amp; MVVM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Experience Section -->
      <section id="experience" class="py-section-gap max-w-container-max mx-auto px-gutter relative overflow-hidden">
        <!-- Color splashes -->
        <div class="absolute inset-0 -z-0 pointer-events-none">
          <div class="absolute top-10 -left-20 w-72 h-72 bg-brush/28 rounded-full blur-3xl"></div>
          <div class="absolute top-1/2 right-1/4 w-64 h-64 bg-sun/25 rounded-full blur-3xl"></div>
          <div class="absolute bottom-10 -right-20 w-72 h-72 bg-accent/28 rounded-full blur-3xl"></div>
        </div>

        <div class="relative z-10 text-center mb-16 space-y-4 reveal">
          <h2 class="font-headline-lg text-primary dark:text-primary-fixed">Where I've been working</h2>
          <p class="text-on-surface-variant dark:text-on-surface-variant/80 max-w-xl mx-auto">Four years building production Flutter apps across fintech, sports and everyday tools.</p>
        </div>

        <div class="relative z-10 max-w-3xl mx-auto space-y-6">
          <div v-for="(job, index) in experience" :key="index"
               class="group relative bg-cream dark:bg-surface-container rounded-[1.5rem] p-6 md:p-8 shadow-[var(--shadow-soft)] border border-black/5 dark:border-outline/15 lift reveal overflow-hidden">
            <!-- Left accent bar -->
            <div class="absolute left-0 top-0 bottom-0 w-1.5" :class="['bg-brush','bg-sun','bg-accent'][index % 3]"></div>

            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white"
                     :class="['bg-brush','bg-sun','bg-accent'][index % 3]">
                  <span class="material-symbols-outlined" :class="index % 3 === 1 ? 'text-primary' : ''">work</span>
                </div>
                <div>
                  <h4 class="font-headline-md text-primary dark:text-primary-fixed leading-tight">{{ job.role }}</h4>
                  <p class="text-on-surface-variant dark:text-on-surface-variant/80 text-sm font-semibold">{{ job.company }} · {{ job.location }}</p>
                </div>
              </div>
              <span class="self-start sm:self-center whitespace-nowrap text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-brush/10 text-accent">{{ job.period }}</span>
            </div>

            <ul v-if="Array.isArray(job.description)" class="space-y-2 pl-1">
              <li v-for="(pt, ptIdx) in job.description" :key="ptIdx" class="flex gap-3 text-body-md text-on-surface-variant dark:text-on-surface-variant/80">
                <span class="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0" :class="['bg-brush','bg-sun','bg-accent'][index % 3]"></span>
                <span>{{ pt }}</span>
              </li>
            </ul>
            <p v-else class="text-body-md text-on-surface-variant dark:text-on-surface-variant/80">{{ job.description }}</p>
          </div>
        </div>
      </section>

      <!-- Projects Grid -->
      <section id="works" class="bg-surface-container-low dark:bg-surface-container-low/20 py-section-gap transition-colors duration-300 relative overflow-hidden">
        <!-- Color splashes -->
        <div class="absolute inset-0 z-0 pointer-events-none">
          <div class="absolute -top-16 right-1/4 w-72 h-72 bg-sun/32 rounded-full blur-3xl"></div>
          <div class="absolute top-1/3 -right-16 w-64 h-64 bg-accent/24 rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 -left-16 w-72 h-72 bg-brush/28 rounded-full blur-3xl"></div>
        </div>
        <div class="max-w-container-max mx-auto px-gutter relative z-10">
          <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 reveal">
            <div class="space-y-2">
              <h2 class="font-headline-lg text-primary dark:text-primary-fixed">Selected work</h2>
              <p class="text-on-surface-variant dark:text-on-surface-variant/80">A few of the apps I've designed and shipped.</p>
            </div>
            <a class="text-accent font-bold hover:underline flex items-center gap-2 group" href="#" @click.prevent="scrollToSection('contact')">
              Start a project
              <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Project Card Loop -->
            <div v-for="(project, index) in visibleProjects" :key="index"
                 :style="{ transitionDelay: (index % 3) * 0.08 + 's' }"
                 class="group bg-cream dark:bg-surface-container rounded-[1.5rem] overflow-hidden shadow-[var(--shadow-soft)] border border-black/5 dark:border-outline/15 lift reveal flex flex-col">
              <!-- Thumbnail -->
              <div class="relative aspect-[16/10] overflow-hidden bg-surface-container-highest cursor-pointer" @click="openImageModal(project.image)">
                <img :alt="project.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" :src="project.image" loading="lazy" />
                <div class="absolute inset-0 bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span class="material-symbols-outlined text-white text-3xl">zoom_in</span>
                </div>
              </div>
              <!-- Body -->
              <div class="p-5 flex flex-col gap-2 flex-1">
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="tag in project.tags" :key="tag" class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brush/10 text-brush">{{ tag }}</span>
                </div>
                <h4 class="text-lg font-bold text-primary dark:text-primary-fixed leading-snug">{{ project.title }}</h4>
                <p class="text-on-surface-variant dark:text-on-surface-variant/80 text-sm flex-1" :class="expandedProjects.includes(index) ? '' : 'line-clamp-2'">
                  {{ project.description }}
                </p>
                <div class="flex items-center gap-4 mt-2 pt-3 border-t border-outline-variant/30">
                  <button @click.stop="toggleExpand(index)" class="text-xs font-bold text-accent hover:underline flex items-center gap-1">
                    {{ expandedProjects.includes(index) ? 'Less' : 'More' }}
                    <span class="material-symbols-outlined text-sm transition-transform" :class="expandedProjects.includes(index) ? 'rotate-180' : ''">expand_more</span>
                  </button>
                  <a v-if="project.websiteLink && project.websiteLink !== '#'" :href="project.websiteLink" target="_blank" @click.stop class="text-xs font-bold text-primary dark:text-primary-fixed hover:underline flex items-center gap-1">
                    Visit <span class="material-symbols-outlined text-xs">open_in_new</span>
                  </a>
                  <a v-if="project.sourceLink && project.sourceLink !== '#'" :href="project.sourceLink" target="_blank" @click.stop class="text-xs font-bold text-primary dark:text-primary-fixed hover:underline flex items-center gap-1">
                    GitHub <span class="material-symbols-outlined text-xs">code</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <!-- Show all toggle button -->
          <div v-if="projects.length > 6" class="flex justify-center mt-12 w-full col-span-full">
            <button @click="showAllProjects = !showAllProjects" class="btn-island cursor-pointer">
              {{ showAllProjects ? 'Show less' : 'Show all projects' }}
              <span class="btn-ic"><span class="material-symbols-outlined text-lg transition-transform duration-500" :class="showAllProjects ? 'rotate-180' : ''">expand_more</span></span>
            </button>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="max-w-container-max mx-auto px-gutter mb-12">
        <div class="bg-secondary-container dark:bg-secondary-container/85 p-12 md:p-24 rounded-[3rem] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 transition-all reveal">
          <div class="space-y-8 max-w-xl relative z-10">
            <h2 class="font-display text-headline-lg md:text-[56px] text-on-secondary-container leading-[1.05]">Let's build something worth shipping.</h2>
            <a class="btn-island !bg-primary" href="#contact" @click.prevent="scrollToSection('contact')">
              Say hi
              <span class="btn-ic"><span class="material-symbols-outlined text-lg">arrow_outward</span></span>
            </a>
          </div>
          <div class="relative z-10 flex flex-col gap-6 text-on-secondary-container">
            <div class="space-y-1">
              <p class="font-bold uppercase tracking-widest text-xs opacity-60">Based in</p>
              <p class="text-body-lg font-medium">{{ contactDetails.location }}</p>
            </div>
            <div class="flex gap-4">
              <a v-for="social in contactDetails.social" :key="social.name" :href="social.link" target="_blank" :aria-label="social.name" class="w-11 h-11 rounded-full border border-on-secondary-container/30 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all">
                <span class="material-symbols-outlined text-lg">{{ social.icon === 'code' ? 'public' : 'share' }}</span>
              </a>
            </div>
          </div>
          <!-- Background Elements -->
          <div class="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl -z-0"></div>
          <div class="absolute top-0 left-0 w-40 h-40 bg-white/20 rounded-full -translate-x-1/2 -translate-y-1/2 -z-0"></div>
        </div>
      </section>

      <!-- Contact Form Component Section -->
      <ContactSection :contactDetails="contactDetails" />
    </main>

    <!-- Footer -->
    <footer class="bg-surface-container-low dark:bg-surface-container-lowest full-width py-section-gap transition-colors duration-300">
      <div class="max-w-container-max mx-auto px-gutter flex flex-col md:flex-row justify-between items-center gap-stack-lg">
        <a class="font-script text-4xl text-primary dark:text-primary-fixed leading-none" href="#" @click.prevent="scrollToSection('home')">
          {{ name.split(' ')[0] }}
        </a>
        <div class="flex flex-wrap justify-center gap-8">
          <a class="text-on-surface-variant dark:text-on-surface-variant hover:text-brush transition-colors underline-offset-4 hover:underline" href="#services" @click.prevent="scrollToSection('services')">Services</a>
          <a class="text-on-surface-variant dark:text-on-surface-variant hover:text-brush transition-colors underline-offset-4 hover:underline" href="#experience" @click.prevent="scrollToSection('experience')">Experience</a>
          <a class="text-on-surface-variant dark:text-on-surface-variant hover:text-brush transition-colors underline-offset-4 hover:underline" href="#works" @click.prevent="scrollToSection('works')">Works</a>
          <a class="text-on-surface-variant dark:text-on-surface-variant hover:text-brush transition-colors underline-offset-4 hover:underline" href="#contact" @click.prevent="scrollToSection('contact')">Contact</a>
        </div>
        <div class="flex flex-col items-center md:items-end gap-2">
          <p class="text-on-surface-variant dark:text-on-surface-variant/80 text-sm">©2026 {{ name }}. All Rights Reserved.</p>
          <div class="flex gap-4 text-on-surface-variant">
            <a v-for="social in contactDetails.social" :key="social.name" :href="social.link" target="_blank" class="hover:text-primary dark:hover:text-primary-fixed">
              <span class="material-symbols-outlined text-xl">{{ social.icon }}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>

    <!-- Zoom Image Modal -->
    <div v-if="selectedImage" class="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4" @click="closeImageModal">
      <button class="absolute top-6 right-6 text-white hover:text-secondary-fixed transition-colors" @click="closeImageModal">
        <span class="material-symbols-outlined text-4xl">close</span>
      </button>
      <img :src="selectedImage" alt="Project Preview" class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" @click.stop />
    </div>
  </div>
</template>

<style scoped>
/* Typing cursor animation */
.typing-cursor {
  display: inline-block;
  width: 2.5px;
  height: 1.15em;
  background-color: var(--secondary);
  margin-left: 4px;
  animation: blink 0.8s infinite;
  vertical-align: middle;
}
@keyframes blink {
  50% { opacity: 0; }
}
</style>
