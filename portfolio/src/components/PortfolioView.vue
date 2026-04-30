<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Theme
const isDark = ref(true)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('light', !isDark.value)
  localStorage.theme = isDark.value ? 'dark' : 'light'
}

// Interactive Animations
const mouseX = ref(0)
const mouseY = ref(0)

const handleMouseMove = (event) => {
  mouseX.value = (event.clientX / window.innerWidth) - 0.5
  mouseY.value = (event.clientY / window.innerHeight) - 0.5
}

const typingText = ref('')
const textToType = 'Flutter Developer.'
const isTyping = ref(true)
let charIndex = 0

const typeEffect = () => {
  if (charIndex <= textToType.length) {
    typingText.value = textToType.substring(0, charIndex)
    charIndex++
    setTimeout(typeEffect, 80)
  } else {
    isTyping.value = false
  }
}

const name = "Stibin Augustine"
const summary = "Flutter Developer with 4+ years of experience and strong skills in mobile application design and API integration. Committed to enhancing user experience through performance optimization and effective state management."

const skills = ref([
  'Flutter', 'Dart', 'Firebase', 'REST API', 'State Management',
  'Clean Architecture', 'Git', 'Riverpod', 'Bloc', 'Provider', 'UI/UX Implementation'
])

const experience = ref([
  {
    company: 'App Station',
    role: 'Flutter Developer',
    period: '09/2024 - 02/2026',
    description: [
      'Developed Khadoom, a cross-platform Flutter Mobile & Web application for the Qutar Olympic Committee',
      'Implemented Clean Architecture for scalability and maintainability',
      'Used Riverpod for efficient and predictable state management',
      'Built responsive and reusable UI components optimized for Flutter Web',
      'Integrated REST APIs and managed data flow across layers',
      'Implemented features such as leave requests, approvals, and internal workflow management'
    ],
    location: 'Trivandrum, India'
  },
  {
    company: 'Active Lobby',
    role: 'Flutter Developer',
    period: '10/2022 - 09/2024',
    description: [
      'Developed LM Pay, a Flutter Web & Mobile money exchange application',
      'Enabled international remittance from UAE to multiple countries with multi-currency support',
      'Implemented MVVM architecture for clean separation of UI, business logic, and data layers',
      'Used Provider for efficient state management',
      'Built responsive, reusable UI components for web and mobile',
      'Integrated REST APIs for transactions, exchange rates, and user operations',
      'Focused on performance, security, and scalable code practices'
    ],
    location: 'Kochi'
  },
  {
    company: 'Tazy Solution',
    role: 'Flutter Developer',
    period: '01/2022 - 10/2022',
    description: [
      'Developed an internal Flutter mobile application for blood donation management',
      'Implemented donor registration, blood group filtering, and request workflows',
      'Used Firebase (Authentication, Firestore/Realtime DB, Notifications)',
      'Applied Provider for efficient state management',
      'Built clean, responsive, and reusable UI components',
      'Ensured secure and reliable data handling for internal organizational use'
    ],
    location: 'Kannur, India'
  }
])

const projects = ref([
  {
    title: 'QuickReceipt',
    tags: ['Flutter', 'Dart', 'Bloc', 'Firebase'],
    description: 'QuickReceipt is an all-in-one billing and business management app designed to simplify your daily operations. Instantly generate and print bills using a Bluetooth printer, while seamlessly managing your inventory, suppliers, and customers in one place. With powerful insights, organized records, and smart tracking, QuickReceipt helps you run your shop efficiently and make better business decisions—faster and easier than ever.',
    image: '/quick_receipt.jpg',
    detailsLink: '#',
    sourceLink: '#'
  },
  {
    title: 'Shop Ledger',
    tags: ['Flutter', 'Dart', 'Riverpod', 'Supabase'],
    description: 'Shop Ledger is a modern mobile application designed to simplify and digitize daily shop operations. It helps shop owners efficiently manage sales, purchases, expenses, credits, debits, customers, suppliers, and stock, all in one place.',
    image: '/shop_ledger.png',
    detailsLink: '#',
    sourceLink: '#'
  },
  {
    title: 'Dately',
    tags: ['Flutter', 'Dart', 'Supabase', 'Real-time Chat'],
    description: 'Dately is a Flutter-based dating app that enables users to discover, match and chat with compatible profiles. It includes email authentication with password reset, swipe-based discovery, global search, real-time chat with text/image/audio support, editable profiles with up to 6 photos, and the ability to retract requests, unmatch, hide profiles from discovery, and delete accounts.',
    image: '/dately.png',
    detailsLink: '#',
    sourceLink: '#'
  },
  {
    title: 'Spendly',
    tags: ['Flutter', 'Dart', 'Firebase', 'Riverpod'],
    description: 'Spendly is a smart expense tracker that helps you easily monitor your daily spending with clear and detailed statistics. It allows you to track expenses over time, understand your spending habits, and manage your finances more effectively with monthly and yearly insights.',
    image: '/spendly.png',
    detailsLink: '#',
    sourceLink: '#'
  },
  {
    title: 'Luckey Spinner',
    tags: ['Flutter', 'Dart', 'SqfLite', 'Riverpod'],
    description: 'Lucky Spinner lets you add names, spin the wheel, and instantly pick a random winner. It\'s perfect for games, quick decisions, giveaways, and fun group activities.',
    image: '/luckey_spinner.png',
    detailsLink: '#',
    sourceLink: '#'
  },
  {
    title: 'Flow Tracker',
    tags: ['Flutter', 'Dart', 'SqfLite', 'Riverpod'],
    description: 'Flow Tracker is a period tracking app that helps women monitor their monthly cycle, predict upcoming periods and ovulation days, and receive timely reminders to stay prepared and informed.',
    image: '/flow_track.png',
    detailsLink: '#',
    sourceLink: '#'
  },
  {
    title: 'Time Tracker',
    tags: ['Flutter', 'Dart', 'Sqflite'],
    description: 'Time is a minimal and user-friendly mobile application designed to help individuals track their daily office working hours with precision. The app focuses on simplicity, clarity, and real-time feedback.',
    image: '/Time_Tracker.png',
    detailsLink: '#',
    sourceLink: '#'
  }
])

const contactDetails = ref({
  email: 'stibinaugustine3047@gmail.com',
  phone: '+971 58 308 1024',
  location: 'Bur Dubai, Dubai, UAE',
  social: [
    { name: 'GitHub', icon: 'code', link: 'https://github.com/stibinottathai', text: 'github.com/stibin' },
    { name: 'LinkedIn', icon: 'work', link: 'https://in.linkedin.com/in/stibin-augustine-8075b1197', text: 'linkedin.com/in/stibin' },
  ]
})

const isMenuOpen = ref(false)

onMounted(() => {
  // Restore saved theme
  if (localStorage.theme === 'light') {
    isDark.value = false
    document.documentElement.classList.add('light')
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active')
      }
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.reveal').forEach((el) => {
    observer.observe(el)
  })

  typeEffect()
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})

const scrollToSection = (id) => {
  isMenuOpen.value = false
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
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
          <a href="/stibin_cv.pdf" download="Stibin_Augustine_Resume.pdf" class="btn btn-primary" style="padding: 0.5rem 1.25rem; font-size: 0.8125rem;">
            <span class="material-symbols-outlined" style="font-size:16px">download</span>
            Resume
          </a>
        </div>

        <div class="nav-mobile-controls">
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
        <a href="/stibin_cv.pdf" download="Stibin_Augustine_Resume.pdf" class="btn btn-primary" style="width:100%; margin-top: 0.5rem;">
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
                  <img src="/profile.png" alt="Stibin Augustine" width="80" height="80" style="width:80px;height:80px;object-fit:cover;">
                </div>
              </div>
              <div>
                <div class="badge" style="margin-bottom: 0.75rem;">
                  <span class="pulse-dot"></span>
                  Available for new projects
                </div>
                <h1>Hi, I'm Stibin.<br><span class="text-gradient">{{ typingText }}</span><span v-show="isTyping" class="typing-cursor"></span></h1>
              </div>
            </div>

            <!-- Desktop badge (hidden on mobile since it's in header above) -->
            <div class="hero-desktop-badge">
              <div class="badge" style="margin-bottom: 0.5rem;">
                <span class="pulse-dot"></span>
                Available for new projects
              </div>
              <h1>Hi, I'm Stibin.<br><span class="text-gradient">{{ typingText }}</span><span v-show="isTyping" class="typing-cursor"></span></h1>
            </div>

            <p style="font-size: 1.125rem; max-width: 520px; line-height: 1.75;">{{ summary }}</p>

            <div class="hero-ctas">
              <button @click="scrollToSection('projects')" class="btn btn-primary btn-lg">
                View Projects
                <span class="material-symbols-outlined" style="font-size:18px">arrow_forward</span>
              </button>
              <button @click="scrollToSection('contact')" class="btn btn-ghost btn-lg">
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
              <img src="/profile.png" alt="Stibin Augustine">
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
                <img :src="project.image" :alt="project.title" loading="lazy">
                <div class="project-image-overlay" @click="openImageModal(project.image)">
                  <span class="btn btn-ghost" style="background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); color: #fff; font-size: 0.8125rem;">
                    <span class="material-symbols-outlined" style="font-size:16px">zoom_in</span>
                    View Image
                  </span>
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
                <button @click.stop="toggleExpand(index)" class="read-more-btn">
                  {{ expandedProjects.includes(index) ? 'Show Less' : 'Read More' }}
                  <span class="material-symbols-outlined" style="font-size:16px; transition: transform 0.3s;" :style="{ transform: expandedProjects.includes(index) ? 'rotate(180deg)' : '' }">expand_more</span>
                </button>
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
                As a passionate Flutter Developer, I specialize in building high-performance mobile applications.
                With a deep understanding of Clean Architecture and State Management, I create scalable and maintainable codebases.
                I am always eager to learn new technologies and improve my skills.
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

      <!-- ===== FOOTER ===== -->
      <footer id="contact">
        <div class="gradient-divider"></div>
        <div class="footer">
          <div class="footer-inner">
            <div>
              <p style="font-size: 1.125rem; font-weight: 700; font-family: var(--font-heading); color: var(--text-primary);">{{ name }}</p>
              <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.25rem;">Crafting exceptional mobile experiences.</p>
            </div>
            <a href="mailto:stibinaugustine3047@gmail.com" class="btn btn-ghost" style="font-size:0.8125rem;">
              <span class="material-symbols-outlined" style="font-size:18px">mail</span>
              Contact Me
            </a>
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
</style>
