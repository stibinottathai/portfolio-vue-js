<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ContactSection from './ContactSection.vue'
import { portfolioData } from '../data/portfolio'

const router = useRouter()
const personalInfo = ref(portfolioData.personalInfo)
const skills = ref(portfolioData.skills)
const experience = ref(portfolioData.experience)
const projects = ref(portfolioData.projects)
const education = ref(portfolioData.education)

// Theme Management (Dark mode by default)
const isDark = ref(true)
const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.theme = isDark.value ? 'dark' : 'light'
}

// Mobile Menu State
const isMenuOpen = ref(false)

// Active Section Highlighting
const activeSection = ref('home')
const sections = ['home', 'about', 'skills', 'experience', 'projects', 'education', 'contact']

const checkActiveSection = () => {
  const scrollPosition = window.scrollY + 100
  for (const sectionId of sections) {
    const el = document.getElementById(sectionId)
    if (el) {
      const top = el.offsetTop
      const height = el.offsetHeight
      if (scrollPosition >= top && scrollPosition < top + height) {
        activeSection.value = sectionId
      }
    }
  }
}

onMounted(() => {
  // Theme check: Default to dark mode unless 'light' is explicitly selected
  if (localStorage.theme === 'light') {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  } else {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }

  window.addEventListener('scroll', checkActiveSection)
  checkActiveSection()
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkActiveSection)
})

const scrollToSection = (id) => {
  isMenuOpen.value = false
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// Zoom Image Modal State
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
  <div class="min-h-screen bg-canvas text-ink font-sans transition-colors duration-300">
    <!-- Header/Navigation (Linear top-nav style, height 56px, single-line desktop) -->
    <nav class="sticky top-0 z-50 bg-canvas/80 backdrop-blur-md border-b border-hairline transition-colors duration-300">
      <div class="max-w-[1200px] mx-auto px-6 h-14 flex justify-between items-center">
        <!-- Logo / Wordmark -->
        <a href="#" @click.prevent="scrollToSection('home')" class="font-sans font-medium tracking-[0.04em] text-sm text-ink hover:text-ink-hover transition-colors">
          {{ personalInfo.name }}
        </a>

        <!-- Desktop Navigation links -->
        <div class="hidden md:flex items-center gap-8">
          <a v-for="sec in ['about', 'skills', 'experience', 'projects', 'education', 'contact']" 
             :key="sec" 
             :href="'#' + sec" 
             @click.prevent="scrollToSection(sec)"
             :class="[
               'font-sans text-xs uppercase tracking-[0.1em] transition-colors',
               activeSection === sec ? 'text-ink font-medium' : 'text-mute hover:text-ink'
             ]">
            {{ sec }}
          </a>
        </div>

        <!-- Utility Buttons (Theme toggle, CV) -->
        <div class="flex items-center gap-3">
          <!-- Theme Toggle -->
          <button @click="toggleTheme" 
                  class="w-8 h-8 rounded-md bg-canvas-soft border border-hairline flex items-center justify-center text-ink hover:border-ink transition-all duration-200" 
                  :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
            <span class="material-symbols-outlined text-[16px]">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
          </button>

          <!-- Admin Lock -->
          <button @click="router.push('/admin')" 
                  class="hidden sm:flex w-8 h-8 rounded-md bg-canvas-soft border border-hairline items-center justify-center text-ink hover:border-ink transition-all duration-200" 
                  title="Admin Dashboard">
            <span class="material-symbols-outlined text-[16px]">lock</span>
          </button>

          <!-- CV Download (rounded-md 8px, matching button-secondary spec) -->
          <a :href="personalInfo.resumeUrl" 
             download="Stibin_CV.pdf"
             class="hidden md:inline-flex items-center gap-2 bg-canvas-soft border border-hairline hover:border-ink text-xs uppercase tracking-[0.08em] px-3.5 py-1.5 rounded-md text-ink transition-all duration-200">
            Download CV
            <span class="material-symbols-outlined text-sm">download</span>
          </a>

          <!-- Mobile menu toggle -->
          <button class="md:hidden w-8 h-8 flex items-center justify-center text-ink" 
                  @click="isMenuOpen = !isMenuOpen" 
                  aria-label="Toggle menu">
            <span class="material-symbols-outlined text-xl">{{ isMenuOpen ? 'close' : 'menu' }}</span>
          </button>
        </div>
      </div>

      <!-- Mobile navigation overlay -->
      <div v-show="isMenuOpen" 
           class="md:hidden border-t border-hairline bg-canvas px-6 py-4 flex flex-col gap-3 transition-colors duration-300">
        <a v-for="sec in ['about', 'skills', 'experience', 'projects', 'education', 'contact']" 
           :key="sec" 
           :href="'#' + sec" 
           @click.prevent="scrollToSection(sec)"
           :class="[
             'py-2 text-xs uppercase tracking-[0.1em]',
             activeSection === sec ? 'text-ink font-bold' : 'text-mute'
           ]">
          {{ sec }}
        </a>
        <a :href="personalInfo.resumeUrl" 
           download="Stibin_CV.pdf"
           class="mt-2 inline-flex items-center justify-center gap-2 border border-hairline text-xs uppercase tracking-[0.08em] py-2.5 rounded-md text-ink hover:bg-canvas-soft transition-colors w-full">
          Download CV
          <span class="material-symbols-outlined text-sm">download</span>
        </a>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-[1200px] mx-auto px-6">
      <!-- Section 1: Hero Section (Minimal, dense Linear style) -->
      <section id="home" class="min-h-[80vh] flex flex-col justify-center py-20 border-b border-hairline">
        <div class="max-w-[800px] space-y-6">
          <!-- Monospace/Technical eyebrow with slight positive tracking -->
          <div class="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-primary">
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            {{ personalInfo.visaStatus }}
          </div>

          <!-- Headline display-xl with aggressive negative tracking -->
          <h1 class="font-sans font-semibold text-4xl sm:text-6xl lg:text-[76px] tracking-[-0.035em] leading-[1.05] text-ink">
            {{ personalInfo.name }}
          </h1>

          <!-- Title description -->
          <p class="font-sans text-lg md:text-xl text-mute tracking-tight max-w-[50ch]">
            {{ personalInfo.title }}
          </p>

          <!-- Hero Pitch -->
          <p class="font-sans text-body-lg text-body max-w-[60ch] leading-relaxed">
            Based in <span class="text-ink font-medium">{{ personalInfo.location }}</span>. Committed to engineering high-performance mobile and web surfaces with Clean Architecture.
          </p>

          <!-- CTAs rounded-md (8px) -->
          <div class="flex flex-wrap items-center gap-3 pt-4">
            <a href="#projects" 
               @click.prevent="scrollToSection('projects')"
               class="bg-primary hover:bg-primary-hover text-on-primary font-medium text-xs uppercase tracking-[0.08em] px-5 py-3 rounded-md transition-all duration-200">
              View Work
            </a>
            <a href="#contact" 
               @click.prevent="scrollToSection('contact')"
               class="bg-canvas-soft border border-hairline hover:border-ink text-xs uppercase tracking-[0.08em] px-5 py-3 rounded-md text-ink transition-all duration-200">
              Contact Me
            </a>
          </div>

          <!-- Social link row -->
          <div class="flex items-center gap-6 pt-6 border-t border-hairline">
            <a :href="personalInfo.github" target="_blank" class="text-xs uppercase tracking-[0.08em] text-mute hover:text-ink transition-colors flex items-center gap-1.5">
              <span class="material-symbols-outlined text-base">code</span> GitHub
            </a>
            <a :href="'https://' + personalInfo.website" target="_blank" class="text-xs uppercase tracking-[0.08em] text-mute hover:text-ink transition-colors flex items-center gap-1.5">
              <span class="material-symbols-outlined text-base">public</span> Portfolio
            </a>
            <a :href="'mailto:' + personalInfo.email" class="text-xs uppercase tracking-[0.08em] text-mute hover:text-ink transition-colors flex items-center gap-1.5">
              <span class="material-symbols-outlined text-base">mail</span> Email
            </a>
          </div>
        </div>
      </section>

      <!-- Section 2: About Section (Clean editorial style) -->
      <section id="about" class="py-20 border-b border-hairline">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div class="md:col-span-4">
            <h2 class="font-sans font-medium text-xs uppercase tracking-[0.18em] text-mute">
              01 / About
            </h2>
          </div>
          <div class="md:col-span-8 space-y-6">
            <h3 class="font-sans font-semibold text-3xl tracking-tight text-ink">
              Architecting cross-platform systems with absolute structural integrity.
            </h3>
            <p class="font-sans text-body-lg text-body leading-relaxed max-w-[65ch]">
              {{ personalInfo.summary }}
            </p>
          </div>
        </div>
      </section>

      <!-- Section 3: Skills Section (Clean grid list with rounded-lg 12px panels) -->
      <section id="skills" class="py-20 border-b border-hairline">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div class="md:col-span-4">
            <h2 class="font-sans font-medium text-xs uppercase tracking-[0.18em] text-mute">
              02 / Skills
            </h2>
          </div>
          <div class="md:col-span-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div v-for="skillGroup in skills" 
                   :key="skillGroup.category" 
                   class="border border-hairline p-5 rounded-lg bg-canvas-soft">
                <h4 class="font-mono text-xs uppercase tracking-[0.1em] text-primary mb-3">
                  // {{ skillGroup.category }}
                </h4>
                <div class="flex flex-wrap gap-2">
                  <span v-for="item in skillGroup.items" 
                        :key="item" 
                        class="border border-hairline px-3 py-1 rounded-sm text-xs font-sans text-body hover:border-ink transition-colors duration-200">
                    {{ item }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 4: Experience Section (Vertical timeline) -->
      <section id="experience" class="py-20 border-b border-hairline">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div class="md:col-span-4">
            <h2 class="font-sans font-medium text-xs uppercase tracking-[0.18em] text-mute">
              03 / Experience
            </h2>
          </div>
          <div class="md:col-span-8 space-y-12">
            <!-- Timeline Item -->
            <div v-for="job in experience" 
                 :key="job.company" 
                 class="relative pl-6 border-l border-hairline group">
              <!-- Timeline bullet -->
              <span class="absolute left-0 top-1.5 -translate-x-[4.5px] w-2 h-2 rounded-full bg-hairline group-hover:bg-primary transition-colors duration-200"></span>
              
              <div class="space-y-2">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 class="font-sans font-semibold text-lg text-ink">
                    {{ job.role }}
                  </h4>
                  <span class="font-mono text-xs text-mute uppercase tracking-wider">
                    {{ job.period }}
                  </span>
                </div>
                <div class="flex justify-between text-xs text-mute uppercase tracking-[0.08em]">
                  <span>{{ job.company }}</span>
                  <span>{{ job.location }}</span>
                </div>
                <!-- Bullets -->
                <ul class="space-y-2 mt-4">
                  <li v-for="bullet in job.description" 
                      :key="bullet" 
                      class="flex gap-2 text-sm text-body leading-relaxed max-w-[65ch]">
                    <span class="mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-hairline"></span>
                    <span>{{ bullet }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 5: Projects Section (Rounded-lg 12px cards, flat surface-1, no shadows) -->
      <section id="projects" class="py-20 border-b border-hairline">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-8">
          <div class="md:col-span-4">
            <h2 class="font-sans font-medium text-xs uppercase tracking-[0.18em] text-mute">
              04 / Projects
            </h2>
          </div>
          <div class="md:col-span-8">
            <h3 class="font-sans font-semibold text-3xl tracking-tight text-ink">
              Selected production and lab creations.
            </h3>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div v-for="project in projects" 
               :key="project.title" 
               class="border border-hairline rounded-lg overflow-hidden bg-canvas-soft hover:border-ink transition-all duration-300 flex flex-col justify-between">
            <div>
              <!-- Thumbnail (rounded-xl 16px container) -->
              <div class="aspect-[16/9] overflow-hidden bg-canvas border-b border-hairline cursor-pointer relative" 
                   @click="openImageModal(project.image)">
                <img :src="project.image" :alt="project.title" class="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
                <!-- hover indicator -->
                <div class="absolute inset-0 bg-canvas/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span class="material-symbols-outlined text-white text-3xl">zoom_in</span>
                </div>
              </div>

              <!-- Body -->
              <div class="p-6 space-y-4">
                <div class="flex flex-wrap gap-2">
                  <span v-for="tag in project.tags" 
                        :key="tag" 
                        class="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-hairline rounded-sm text-mute">
                    {{ tag }}
                  </span>
                </div>
                <div class="space-y-1">
                  <h4 class="font-sans font-semibold text-lg text-ink">
                    {{ project.title }}
                  </h4>
                  <p class="font-mono text-xs text-mute">
                    {{ project.subtitle }}
                  </p>
                </div>
                <p class="font-sans text-sm text-body leading-relaxed">
                  {{ project.description }}
                </p>
              </div>
            </div>

            <!-- Links footer (rounded buttons) -->
            <div class="px-6 pb-6 pt-2 flex gap-3">
              <a v-if="project.websiteLink && project.websiteLink !== '#'" 
                 :href="project.websiteLink" 
                 target="_blank" 
                 class="border border-hairline hover:border-ink text-[11px] uppercase tracking-[0.08em] px-4 py-2 rounded-md text-ink hover:bg-canvas-card transition-all duration-200 flex items-center gap-1.5">
                Visit <span class="material-symbols-outlined text-xs">open_in_new</span>
              </a>
              <a v-if="project.sourceLink && project.sourceLink !== '#'" 
                 :href="project.sourceLink" 
                 target="_blank" 
                 class="border border-hairline hover:border-ink text-[11px] uppercase tracking-[0.08em] px-4 py-2 rounded-md text-ink hover:bg-canvas-card transition-all duration-200 flex items-center gap-1.5">
                Source <span class="material-symbols-outlined text-xs">code</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 6: Education Section -->
      <section id="education" class="py-20 border-b border-hairline">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div class="md:col-span-4">
            <h2 class="font-sans font-medium text-xs uppercase tracking-[0.18em] text-mute">
              05 / Education
            </h2>
          </div>
          <div class="md:col-span-8 space-y-6">
            <div v-for="edu in education" 
                 :key="edu.institution" 
                 class="border border-hairline p-6 rounded-lg bg-canvas-soft">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <h4 class="font-sans font-semibold text-lg text-ink">
                  {{ edu.institution }}
                </h4>
                <span class="font-mono text-xs text-mute uppercase tracking-wider">
                  {{ edu.period }}
                </span>
              </div>
              <p class="font-sans text-sm text-body">
                {{ edu.degree }}
              </p>
              <p v-if="edu.coursework" class="font-mono text-xs text-mute mt-3">
                Coursework: {{ edu.coursework }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 7: Contact Form Section -->
      <ContactSection :contactDetails="personalInfo" />
    </main>

    <!-- Footer -->
    <footer class="bg-canvas border-t border-hairline py-12 transition-colors duration-300">
      <div class="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
        <a href="#" @click.prevent="scrollToSection('home')" class="font-sans text-xs uppercase tracking-[0.1em] text-ink hover:text-ink-hover">
          {{ personalInfo.name }}
        </a>
        <p class="font-mono text-xs text-mute">
          © 2026 {{ personalInfo.name }}. Engineered with Vue &amp; Tailwind.
        </p>
        <div class="flex gap-6">
          <a :href="personalInfo.github" target="_blank" class="font-mono text-xs text-mute hover:text-ink uppercase tracking-wider">GitHub</a>
          <a :href="personalInfo.linkedin" target="_blank" class="font-mono text-xs text-mute hover:text-ink uppercase tracking-wider">LinkedIn</a>
        </div>
      </div>
    </footer>

    <!-- Zoom Image Modal -->
    <div v-if="selectedImage" 
         class="fixed inset-0 bg-canvas/95 backdrop-blur-md z-50 flex items-center justify-center p-4" 
         @click="closeImageModal">
      <button class="absolute top-6 right-6 text-ink hover:text-mute transition-colors" 
              @click="closeImageModal"
              aria-label="Close zoom modal">
        <span class="material-symbols-outlined text-4xl">close</span>
      </button>
      <img :src="selectedImage" 
           alt="Project Preview" 
           class="max-w-full max-h-[90vh] object-contain rounded-lg border border-hairline shadow-2xl" 
           @click.stop />
    </div>
  </div>
</template>

<style scoped>
/* High-performance hardware transitions */
.transition-colors {
  will-change: background-color, color, border-color;
}
</style>
