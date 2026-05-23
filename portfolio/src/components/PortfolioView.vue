<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
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
const typingTextSource = ref(DEF_INTRO.typingText)
const profileImage = ref('')
const aboutContent = ref(DEF_ABOUT.content)
const skills = ref(DEF_SKILLS)
const experience = ref(DEF_EXPERIENCE)
const projects = ref(DEF_PROJECTS)
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
      if (d.skills !== undefined) skills.value = d.skills
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
    }
  }, (e) => console.warn('Config sync failed:', e))

  // 2. Experiences
  onSnapshot(collection(db, 'experiences'), (snap) => {
    if (!snap.empty) {
      experience.value = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.order || 0) - (b.order || 0))
    } else {
      experience.value = DEF_EXPERIENCE
    }
  }, (e) => console.warn('Experience sync failed:', e))

  // 3. Projects
  onSnapshot(collection(db, 'projects'), (snap) => {
    if (!snap.empty) {
      projects.value = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.order || 0) - (b.order || 0))
    } else {
      projects.value = DEF_PROJECTS
    }
  }, (e) => console.warn('Projects sync failed:', e))
}

// ── Theme ──────────────────────────────────────────────────────────────────────
const isDark = ref(true)
const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('light', !isDark.value)
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

const typeEffect = () => {
  charIndex = 0
  isTyping.value = true
  typingText.value = ''
  const tick = () => {
    const src = typingTextSource.value
    if (charIndex <= src.length) {
      typingText.value = src.substring(0, charIndex)
      charIndex++
      setTimeout(tick, 80)
    } else {
      isTyping.value = false
    }
  }
  tick()
}

const isMenuOpen = ref(false)

watch(typingTextSource, () => {
  typeEffect()
})

onMounted(() => {
  if (localStorage.theme === 'light') {
    isDark.value = false
    document.documentElement.classList.add('light')
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
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
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
  <div class="portfolio-root">
    <!-- Grain overlay -->
    <div class="grain-overlay"></div>

    <!-- ===== NAVBAR ===== -->
    <header class="nav">
      <div class="nav-inner">
        <div class="nav-logo" @click="scrollToSection('home')">
          <div class="nav-logo-icon">
            <span class="material-symbols-outlined" style="font-size:22px">terminal</span>
          </div>
          <span class="nav-logo-text">{{ name }}</span>
        </div>

        <nav class="nav-links">
          <a class="nav-link" @click.prevent="scrollToSection('home')" href="#home">Home</a>
          <a class="nav-link" @click.prevent="scrollToSection('experience')" href="#experience">Experience</a>
          <a class="nav-link" @click.prevent="scrollToSection('projects')" href="#projects">Projects</a>
          <a class="nav-link" @click.prevent="scrollToSection('about')" href="#about">About</a>
          <a class="nav-link" @click.prevent="scrollToSection('contact')" href="#contact">Contact</a>
        </nav>

        <div class="nav-actions">
          <button @click="toggleTheme" class="theme-toggle-btn" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
            <span class="material-symbols-outlined" style="font-size:20px">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
          </button>
          <button @click="router.push('/admin')" class="theme-toggle-btn" title="Admin">
            <span class="material-symbols-outlined" style="font-size:20px">lock</span>
          </button>
          <a :href="resumeUrl" target="_blank" class="btn btn-primary" style="padding: 0.5rem 1.25rem; font-size: 0.8125rem;">
            <span class="material-symbols-outlined" style="font-size:16px">download</span>
            Resume
          </a>
        </div>

        <div class="nav-mobile-controls">
          <button @click="router.push('/admin')" class="theme-toggle-btn" title="Admin">
            <span class="material-symbols-outlined" style="font-size:20px">lock</span>
          </button>
          <button @click="toggleTheme" class="theme-toggle-btn">
            <span class="material-symbols-outlined" style="font-size:20px">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
          </button>
          <button class="nav-mobile-hamburger" @click="isMenuOpen = !isMenuOpen">
            <span class="material-symbols-outlined">{{ isMenuOpen ? 'close' : 'menu' }}</span>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-show="isMenuOpen" class="nav-mobile-menu">
        <a class="nav-mobile-link" @click.prevent="scrollToSection('home')" href="#home">Home</a>
        <a class="nav-mobile-link" @click.prevent="scrollToSection('experience')" href="#experience">Experience</a>
        <a class="nav-mobile-link" @click.prevent="scrollToSection('projects')" href="#projects">Projects</a>
        <a class="nav-mobile-link" @click.prevent="scrollToSection('about')" href="#about">About</a>
        <a class="nav-mobile-link" @click.prevent="scrollToSection('contact')" href="#contact">Contact</a>
        <a :href="resumeUrl" target="_blank" class="btn btn-primary" style="width:100%; margin-top: 0.5rem;">
          <span class="material-symbols-outlined" style="font-size:16px">download</span>
          Resume
        </a>
      </div>
    </header>

    <!-- ===== MAIN CONTENT ===== -->
    <main style="margin-top: 64px;">

      <!-- ===== HERO ===== -->
      <section id="home" class="hero-section">
        <div class="dot-grid"></div>
        <div class="orb orb-violet" :style="{ transform: `translate(${mouseX * -30}px, ${mouseY * -30}px)` }"></div>
        <div class="orb orb-cyan" :style="{ transform: `translate(${mouseX * 30}px, ${mouseY * 30}px)` }"></div>

        <div class="container hero-grid">
          <!-- Text Side -->
          <div class="hero-text reveal">
            <!-- Mobile profile -->
            <div class="hero-mobile-header">
              <div class="hero-mobile-avatar">
                <div class="profile-ring">
                  <img v-if="profileImage" :src="profileImage" :alt="name" width="80" height="80" style="width:80px;height:80px;object-fit:cover;">
                </div>
              </div>
              <div>
                <div class="badge" v-if="isAvailable" style="margin-bottom: 0.75rem;">
                  <span class="pulse-dot"></span>
                  {{ badgeText }}
                </div>
                <h1>Hi, I'm {{ name.split(' ')[0] }}.<br><span class="text-gradient">{{ typingText }}</span><span v-show="isTyping" class="typing-cursor"></span></h1>
              </div>
            </div>

            <!-- Desktop badge -->
            <div class="hero-desktop-badge">
              <div class="badge" v-if="isAvailable" style="margin-bottom: 0.5rem;">
                <span class="pulse-dot"></span>
                {{ badgeText }}
              </div>
              <h1>Hi, I'm {{ name.split(' ')[0] }}.<br><span class="text-gradient">{{ typingText }}</span><span v-show="isTyping" class="typing-cursor"></span></h1>
            </div>

            <p style="font-size: 1.125rem; max-width: 520px; line-height: 1.75;">{{ summary }}</p>

            <div class="hero-ctas">
              <button @click="scrollToSection('projects')" class="btn btn-primary btn-lg">
                View Projects
                <span class="material-symbols-outlined" style="font-size:18px">arrow_forward</span>
              </button>
              <button @click="scrollToSection('contact')" class="btn btn-animated btn-lg">
                Get in Touch
              </button>
            </div>

            <div class="hero-skills">
              <span style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted);">Tech Stack</span>
              <div class="hero-skills-list">
                <span v-for="(skill, i) in skills" :key="skill" class="skill-tag reveal" :class="'reveal-delay-' + ((i % 5) + 1)">{{ skill }}</span>
              </div>
            </div>
          </div>

          <!-- Profile Image (Desktop) -->
          <div class="hero-image reveal reveal-delay-2">
            <div class="profile-card" :style="{ transform: `perspective(1000px) rotateY(${mouseX * 5}deg) rotateX(${mouseY * -5}deg)` }">
              <img v-if="profileImage" :src="profileImage" alt="Stibin Augustine">
            </div>
          </div>
        </div>
      </section>

      <!-- ===== EXPERIENCE ===== -->
      <section id="experience" class="section">
        <div class="container">
          <div class="section-header reveal">
            <h2>Professional Journey</h2>
            <div class="accent-line"></div>
          </div>

          <div class="timeline">
            <div v-for="(job, index) in experience" :key="index" class="timeline-item reveal" :class="'reveal-delay-' + (index + 1)">
              <div class="timeline-node"></div>
              <div class="glass-card" style="padding: 1.5rem;">
                <div class="timeline-card-header">
                  <div>
                    <h3 style="margin-bottom: 0.25rem;">{{ job.role }}</h3>
                    <p style="font-size: 0.875rem; color: var(--text-muted);">{{ job.company }} · {{ job.location }}</p>
                  </div>
                  <span class="tag">{{ job.period }}</span>
                </div>
                <ul v-if="Array.isArray(job.description)" class="timeline-points">
                  <li v-for="(point, i) in job.description" :key="i">{{ point }}</li>
                </ul>
                <p v-else style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 1rem;">{{ job.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== PROJECTS ===== -->
      <section id="projects" class="section">
        <div class="container">
          <div class="section-header reveal">
            <h2>Selected Works</h2>
            <div class="accent-line"></div>
            <p class="section-subtitle">A showcase of mobile excellence.</p>
          </div>

          <div class="bento-grid">
            <article v-for="(project, index) in projects" :key="index" class="project-card reveal" :class="'reveal-delay-' + ((index % 3) + 1)">
              <div class="project-image-wrap">
                <div class="image-carousel-inner" :class="{ 'is-sliding': [project.image, project.image2].filter(Boolean).length > 1 }">
                  <div v-for="(img, imgIdx) in [project.image, project.image2].filter(Boolean)" :key="imgIdx" class="carousel-slide">
                    <img :src="img" :alt="project.title" loading="lazy">
                    <div class="project-image-overlay" @click.stop="openImageModal(img)">
                      <span class="btn btn-ghost" style="background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); color: #fff; font-size: 0.8125rem;">
                        <span class="material-symbols-outlined" style="font-size:16px">zoom_in</span>
                        View Image
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="project-body">
                <div style="display:flex; flex-wrap:wrap; gap: 0.375rem;">
                  <span v-for="t in project.tags" :key="t" class="tag">{{ t }}</span>
                </div>
                <h3 style="color: var(--text-primary);">{{ project.title }}</h3>
                <p :class="['project-desc', expandedProjects.includes(index) ? '' : 'line-clamp-3']" style="font-size: 0.875rem;">
                  {{ project.description }}
                </p>
                <div style="display: flex; gap: 1rem; align-items: center; margin-top: 0.25rem; flex-wrap: wrap;">
                  <button @click.stop="toggleExpand(index)" class="read-more-btn" style="margin-top: 0;">
                    {{ expandedProjects.includes(index) ? 'Show Less' : 'Read More' }}
                    <span class="material-symbols-outlined" style="font-size:16px; transition: transform 0.3s;" :style="{ transform: expandedProjects.includes(index) ? 'rotate(180deg)' : '' }">expand_more</span>
                  </button>
                  <a v-if="project.websiteLink && project.websiteLink !== '#'" :href="project.websiteLink" target="_blank" rel="noopener noreferrer" class="read-more-btn" style="color: var(--accent-cyan); margin-top: 0; text-decoration: none;">
                    Visit Website
                    <span class="material-symbols-outlined" style="font-size:16px;">open_in_new</span>
                  </a>
                  <a v-if="project.sourceLink && project.sourceLink !== '#'" :href="project.sourceLink" target="_blank" rel="noopener noreferrer" class="read-more-btn" style="color: var(--text-primary); margin-top: 0; text-decoration: none;">
                    GitHub
                    <span class="material-symbols-outlined" style="font-size:16px;">code</span>
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- ===== ABOUT ===== -->
      <section id="about" class="section">
        <div class="container">
          <div class="about-grid reveal">
            <div class="about-left">
              <div class="section-header" style="margin-bottom: 1.5rem;">
                <h2>About Me</h2>
                <div class="accent-line"></div>
              </div>
              <p style="font-size: 1.0625rem; line-height: 1.8; margin-bottom: 1.5rem;">
                {{ aboutContent }}
              </p>



              <!-- Contact Details -->
              <div style="margin-top: 2rem;">
                <div class="contact-item">
                  <div class="contact-icon">
                    <span class="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <div class="contact-label">Phone</div>
                    <a :href="'tel:' + contactDetails.phone" class="contact-value">{{ contactDetails.phone }}</a>
                  </div>
                </div>
                <div class="contact-item">
                  <div class="contact-icon">
                    <span class="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <div class="contact-label">Email</div>
                    <a :href="'mailto:' + contactDetails.email" class="contact-value">{{ contactDetails.email }}</a>
                  </div>
                </div>
                <div class="contact-item">
                  <div class="contact-icon">
                    <span class="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <div class="contact-label">Location</div>
                    <span class="contact-value">{{ contactDetails.location }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="about-right">
              <div class="glass-card" style="padding: 2rem;">
                <h3 style="margin-bottom: 1.5rem; color: var(--text-primary);">Connect with me</h3>
                <div style="display:flex; flex-direction:column; gap: 0.75rem;">
                  <a v-for="social in contactDetails.social" :key="social.name" :href="social.link" target="_blank" class="social-card">
                    <div style="display:flex; align-items:center; gap: 0.75rem;">
                      <span class="material-symbols-outlined" style="color: var(--text-muted); font-size:20px;">{{ social.icon }}</span>
                      <span style="font-weight: 500;">{{ social.name }}</span>
                    </div>
                    <span style="font-size: 0.8125rem; color: var(--text-muted);">{{ social.text }}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== CONTACT SECTION ===== -->
      <ContactSection :contactDetails="contactDetails" />

      <!-- ===== FOOTER ===== -->
      <footer>
        <div class="gradient-divider"></div>
        <div class="footer">
          <div class="footer-inner">
            <div>
              <p style="font-size: 1.125rem; font-weight: 700; font-family: var(--font-heading); color: var(--text-primary);">{{ name }}</p>
              <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.25rem;">Crafting exceptional mobile experiences.</p>
            </div>
            <button @click="scrollToSection('contact')" class="btn btn-ghost" style="font-size:0.8125rem;">
              <span class="material-symbols-outlined" style="font-size:18px">arrow_upward</span>
              Back to Top
            </button>
          </div>
          <div style="max-width:1200px; margin:0 auto; padding: 2rem 1.5rem 0; border-top: 1px solid var(--border-subtle); text-align:center; margin-top: 2rem;">
            <p style="font-size: 0.8125rem; color: var(--text-muted);">© 2026 {{ name }}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>

    <!-- ===== IMAGE MODAL ===== -->
    <div v-if="selectedImage" class="modal-backdrop" @click="closeImageModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeImageModal">
          <span class="material-symbols-outlined">close</span>
        </button>
        <img :src="selectedImage" alt="Project Preview" @click.stop>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== Component-level styles ===== */
.portfolio-root {
  min-height: 100vh;
  position: relative;
}

/* Hero */
.hero-section {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  padding: 3rem 0 2rem;
  overflow: hidden;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
  position: relative;
  z-index: 2;
}

@media (min-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1.1fr 0.9fr;
    gap: 4rem;
  }
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Mobile header: avatar + heading together */
.hero-mobile-header {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
}

.hero-mobile-avatar {
  flex-shrink: 0;
}

.hero-desktop-badge {
  display: none;
}

@media (min-width: 1024px) {
  .hero-mobile-header { display: none; }
  .hero-desktop-badge { display: block; }
}

.hero-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 0.5rem;
}

.hero-skills {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1.5rem;
}

.hero-skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Hero Image (Desktop) */
.hero-image {
  display: none;
  justify-content: flex-end;
}

@media (min-width: 1024px) {
  .hero-image { display: flex; }
}

.hero-image .profile-card {
  aspect-ratio: 1;
  width: 100%;
  max-width: 440px;
  transition: transform 0.1s ease-out;
  background: linear-gradient(135deg, var(--bg-secondary), var(--bg-card));
}

/* Timeline */
.timeline-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.timeline-points {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-left: 1.25rem;
  list-style: disc;
}

.timeline-points li {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Read More */
.read-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--accent-violet);
  cursor: pointer;
  transition: color var(--transition-fast);
  margin-top: 0.25rem;
}

.read-more-btn:hover {
  color: var(--accent-cyan);
}

/* About Grid */
.about-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: start;
}

.about-left {
  min-width: 0;
}

.about-right {
  min-width: 0;
}

@media (min-width: 1024px) {
  .about-grid {
    grid-template-columns: 1.15fr 0.85fr;
    gap: 4rem;
  }
}

/* Stats Row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.stats-row .glass-card:hover {
  transform: translateY(-4px);
}

/* Image Carousel */
.image-carousel-inner {
  display: flex;
  width: 100%;
  height: 100%;
}
.image-carousel-inner.is-sliding {
  width: 200%;
  animation: slide-toggle 8s infinite ease-in-out;
}
.project-image-wrap:hover .image-carousel-inner.is-sliding {
  animation-play-state: paused;
}
.carousel-slide {
  width: 100%;
  height: 100%;
  flex: 1;
  position: relative;
}
.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
@keyframes slide-toggle {
  0%, 40% { transform: translateX(0); }
  50%, 90% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
</style>
