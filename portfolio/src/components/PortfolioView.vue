<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isDark = ref(true)

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.theme = 'dark'
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.theme = 'light'
  }
}

// Interactive Animations
const mouseX = ref(0)
const mouseY = ref(0)

const handleMouseMove = (event) => {
  mouseX.value = (event.clientX / window.innerWidth) - 0.5
  mouseY.value = (event.clientY / window.innerHeight) - 0.5
}

const typingText = ref('')
const roles = ['Flutter Developer.', 'Mobile Architect.', 'UI/UX Enthusiast.']
let roleIndex = 0
let charIndex = 0
let isDeleting = false

const typeEffect = () => {
  const currentRole = roles[roleIndex]
  
  if (isDeleting) {
    typingText.value = currentRole.substring(0, charIndex - 1)
    charIndex--
  } else {
    typingText.value = currentRole.substring(0, charIndex + 1)
    charIndex++
  }

  let typeSpeed = isDeleting ? 50 : 100

  if (!isDeleting && charIndex === currentRole.length) {
    isDeleting = true
    typeSpeed = 2000
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false
    roleIndex = (roleIndex + 1) % roles.length
    typeSpeed = 500
  }

  setTimeout(typeEffect, typeSpeed)
}

const name = "Stibin Augustine"
// ... existing code ...
const summary = "Flutter Developer with strong skills in mobile application design and API integration. Committed to enhancing user experience through performance optimization and effective state management."

const skills = ref([
  'Flutter',
  'Dart',
  'Firebase',
  'REST API',
  'State Management',
  'Clean Architecture',
  'Git',
  'Agile',
  'UI/UX Implementation'
])

const experience = ref([
  {
    company: 'App Station',
    role: 'Flutter Developer',
    period: '09/2024 - Current',
    description: 'Developed mobile applications using Flutter framework for user-friendly interfaces. Collaborated with designers and integrated APIs to enhance app performance.',
    location: 'Trivandrum, India'
  },
  {
    company: 'Active Lobby',
    role: 'Flutter Developer',
    period: '10/2022 - 09/2024',
    description: 'Developed intuitive mobile apps. Conducted code reviews and integrated APIs. Troubleshot and resolved bugs to improve reliability.',
    location: 'Kochi'
  },
  {
    company: 'Tazy Solution',
    role: 'Flutter Developer',
    period: '01/2022 - 10/2022',
    description: 'Implemented state management solutions. Participated in Agile ceremonies and optimized code.',
    location: 'Kannur, India'
  }
])

const projects = ref([
  {
    title: 'E-Commerce Mobile App',
    tags: ['Flutter', 'Firebase', 'Stripe'],
    description: 'A full-featured shopping app with real-time inventory, secure payments, and order tracking.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    detailsLink: '#',
    sourceLink: '#'
  },
  {
    title: 'Social Connect',
    tags: ['Flutter', 'Dart', 'Socket.io'],
    description: 'Real-time chat application with group messaging, media sharing, and push notifications.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    detailsLink: '#',
    sourceLink: '#'
  },
  {
    title: 'Task Manager',
    tags: ['Flutter', 'SQLite', 'Provider'],
    description: 'Productivity tool for tracking daily tasks with offline support and data synchronization.',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    detailsLink: '#',
// ... existing code ...
    sourceLink: '#'
  }
])

const contactDetails = ref({
  email: 'contact@stibinaugustine.com',
  phone: '+91 987 654 3210',
  location: 'Trivandrum, Kerala, India',
  social: [
    { name: 'GitHub', icon: 'code', link: '#', text: 'github.com/stibin' },
    { name: 'LinkedIn', icon: 'work', link: '#', text: 'linkedin.com/in/stibin' },
    { name: 'Twitter', icon: 'chat', link: '#', text: '@stibin_dev' }
  ]
})

const isMenuOpen = ref(false)

onMounted(() => {
  // Check for saved user preference
  if (localStorage.theme === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches)) {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  } else {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active')
      }
    })
  }, {
    threshold: 0.1
  })

  document.querySelectorAll('.reveal').forEach((el) => {
    observer.observe(el)
  })

  // Start animations
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
</script>

<template>
  <div class="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-x-hidden transition-colors duration-300">
    
    <!-- Navigation -->
    <header class="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md transition-colors duration-300">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <div class="flex items-center gap-3 group cursor-pointer" @click="scrollToSection('home')">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:bg-primary group-hover:text-white shadow-sm group-hover:shadow-primary/50">
            <span class="material-symbols-outlined text-2xl">terminal</span>
          </div>
          <span class="text-lg font-bold tracking-tight text-slate-900 dark:text-white transition-all duration-300 group-hover:tracking-wider group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-purple-500">{{ name }}</span>
        </div>
        <nav class="hidden md:flex items-center gap-8">
          <a @click.prevent="scrollToSection('home')" class="relative group text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors hover:text-primary cursor-pointer py-1" href="#home">
            Home
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a @click.prevent="scrollToSection('experience')" class="relative group text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors hover:text-primary cursor-pointer py-1" href="#experience">
            Experience
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a @click.prevent="scrollToSection('projects')" class="relative group text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors hover:text-primary cursor-pointer py-1" href="#projects">
            Projects
             <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a @click.prevent="scrollToSection('about')" class="relative group text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors hover:text-primary cursor-pointer py-1" href="#about">
            About Me
             <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a @click.prevent="scrollToSection('contact')" class="relative group text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors hover:text-primary cursor-pointer py-1" href="#contact">
            Contact
             <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </a>
        </nav>
        <div class="hidden md:flex items-center gap-4">
             <button @click="toggleTheme" class="flex items-center justify-center h-9 w-9 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                <span class="material-symbols-outlined text-[20px]">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
             </button>
             <button class="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-white dark:text-background-dark text-sm font-bold leading-normal tracking-[0.015em] hover:bg-sky-400 transition-colors gap-2">
                <span class="material-symbols-outlined text-[18px]">download</span>
                <span class="truncate">Resume</span>
            </button>
        </div>
        <div class="flex items-center md:hidden gap-4">
          <button @click="toggleTheme" class="flex items-center justify-center h-9 w-9 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
            <span class="material-symbols-outlined text-[20px]">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
          </button>
          <button @click="isMenuOpen = !isMenuOpen" class="text-slate-900 dark:text-white">
            <span class="material-symbols-outlined">{{ isMenuOpen ? 'close' : 'menu' }}</span>
          </button>
        </div>
      </div>

      <div v-show="isMenuOpen" class="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-background-dark border-b border-slate-200 dark:border-white/5 p-4 flex flex-col gap-4 shadow-xl z-40 transition-colors duration-300">
        <a @click.prevent="scrollToSection('home')" class="text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-all hover:translate-x-2" href="#home">Home</a>
        <a @click.prevent="scrollToSection('experience')" class="text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-all hover:translate-x-2" href="#experience">Experience</a>
        <a @click.prevent="scrollToSection('projects')" class="text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-all hover:translate-x-2" href="#projects">Projects</a>
        <a @click.prevent="scrollToSection('about')" class="text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-all hover:translate-x-2" href="#about">About Me</a>
        <a @click.prevent="scrollToSection('contact')" class="text-base font-medium text-slate-600 dark:text-slate-300 hover:text-primary cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-all hover:translate-x-2" href="#contact">Contact</a>
         <button class="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white dark:text-background-dark text-sm font-bold leading-normal tracking-[0.015em] hover:bg-sky-400 transition-colors gap-2">
            <span class="material-symbols-outlined text-[18px]">download</span>
            <span class="truncate">Resume</span>
        </button>
      </div>
    </header>

    <main class="flex flex-1 flex-col relative overflow-hidden mt-16">
      
      <!-- Hero Section -->
      <section id="home" class="relative flex flex-col justify-center min-h-[90vh] py-20 pb-0">
        <!-- Background Gradient Effect -->
        <div class="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none transition-transform duration-100 ease-out" :style="{ transform: `translate(${mouseX * -30}px, ${mouseY * -30}px)` }"></div>
        <div class="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none transition-transform duration-100 ease-out" :style="{ transform: `translate(${mouseX * 30}px, ${mouseY * 30}px)` }"></div>
        
        <div class="container mx-auto px-6 lg:px-8 relative z-10">
          <div class="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <!-- Text Content -->
            <div class="flex flex-col gap-6 max-w-2xl reveal">
              <div class="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm shadow-sm dark:shadow-none">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Available for new projects
              </div>
              <h1 class="text-5xl font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
                Hi, I'm Stibin. <br/>
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-slate-600 dark:to-white/60 min-h-[1.2em] inline-block">{{ typingText }}</span>
                <span class="animate-pulse text-primary font-thin">|</span>
              </h1>
              <p class="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                {{ summary }}
              </p>
              <div class="flex flex-wrap gap-4 pt-4">
                <button @click="scrollToSection('projects')" class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-lg bg-primary px-8 font-medium text-white dark:text-background-dark transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900">
                  <span class="mr-2">View Projects</span>
                  <span class="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                </button>
                <button @click="scrollToSection('contact')" class="inline-flex h-12 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-8 font-medium text-slate-900 dark:text-white transition-all hover:bg-slate-50 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900">
                  Get in Touch
                </button>
              </div>
              
              <!-- Tech Stack Indicators -->
               <div class="flex flex-col gap-3 pt-8">
                  <span class="text-sm font-medium uppercase tracking-wider text-slate-500">Tech Stack</span>
                  <div class="flex flex-wrap gap-2">
                      <span v-for="skill in skills" :key="skill" class="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                          {{ skill }}
                      </span>
                  </div>
              </div>

            </div>
            
            <!-- Visual Anchor -->
            <div class="relative lg:h-full flex items-center justify-center lg:justify-end reveal" style="transition-delay: 200ms;">
              <div class="relative aspect-square w-full max-w-md lg:max-w-lg rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-black border border-slate-200 dark:border-white/10 shadow-2xl group transition-all duration-100 ease-out"
                   :style="{ transform: `perspective(1000px) rotateY(${mouseX * 5}deg) rotateX(${mouseY * -5}deg)` }">
                 <!-- Profile Image -->
                 <!-- Replace the 'src' below with your actual photo URL -->
                <img src="/profile.png"
                     alt="Stibin Augustine" 
                     class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Experience Section -->
      <section id="experience" class="w-full xl:max-w-[1280px] mx-auto px-4 md:px-10 py-16">
           <div class="flex flex-col gap-2 mb-10 reveal">
              <h2 class="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white mb-2">Professional Journey</h2>
              <div class="h-1 w-20 bg-primary rounded-full"></div>
           </div>

           <div class="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-700 before:to-transparent">
              
              <div v-for="(job, index) in experience" :key="index" class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active reveal">
                  <!-- Icon -->
                  <div class="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-background-dark shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors duration-300">
                      <span class="material-symbols-outlined text-primary text-sm">work</span>
                  </div>
                  <!-- Card -->
                  <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm transition-transform hover:-translate-y-1 duration-300">
                      <div class="flex items-center justify-between space-x-2 mb-1">
                          <h3 class="font-bold text-slate-900 dark:text-white">{{ job.role }}</h3>
                          <time class="font-mono text-xs text-primary">{{ job.period }}</time>
                      </div>
                      <div class="text-slate-600 dark:text-slate-400 font-medium mb-2 text-sm">{{ job.company }} | {{ job.location }}</div>
                      <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {{ job.description }}
                      </p>
                  </div>
              </div>

           </div>
      </section>

      <!-- Projects Grid -->
      <section id="projects" class="w-full xl:max-w-[1280px] mx-auto px-4 md:px-10 py-16">
        <div class="flex flex-col gap-2 mb-10 reveal">
           <h2 class="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white mb-2">Selected Works</h2>
           <p class="text-slate-600 dark:text-slate-400">A showcase of mobile excellence.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <article v-for="(project, index) in projects" :key="index" class="reveal group flex flex-col bg-white dark:bg-card-dark rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300">
            <div class="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-[#111318]">
              <div class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" :style="{ backgroundImage: `url(${project.image})` }"></div>
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span class="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/20">View App</span>
              </div>
            </div>
            <div class="flex flex-col flex-1 p-5 md:p-6 gap-4">
              <div class="flex flex-wrap gap-2">
                <span v-for="tag in project.tags" :key="tag" class="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs font-semibold">{{ tag }}</span>
              </div>
              <div class="flex flex-col gap-2">
                <h3 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{{ project.title }}</h3>
                <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
                   {{ project.description }}
                </p>
              </div>
              <div class="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50">
                <a class="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white hover:text-primary transition-colors" href="#">
                  <span class="material-symbols-outlined text-[20px]">visibility</span>
                  Live Demo
                </a>
                <a class="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
                  <span class="material-symbols-outlined text-[20px]">code</span>
                  Code
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- About Me / Contact Details Section -->
      <section id="about" class="w-full xl:max-w-[1280px] mx-auto px-4 md:px-10 py-16">
        <div class="grid gap-12 lg:grid-cols-2 items-center reveal">
           <div class="flex flex-col gap-6">
              <div class="flex flex-col gap-2">
                 <h2 class="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white mb-2">About Me</h2>
                 <div class="h-1 w-20 bg-primary rounded-full"></div>
              </div>
              <p class="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                As a passionate Flutter Developer, I specialize in building high-performance mobile applications. 
                With a deep understanding of Clean Architecture and State Management, I create scalable and maintainable codebases.
                I am always eager to learn new technologies and improve my skills.
              </p>
              
              <div class="flex flex-col gap-4 mt-4">
                 <div class="flex items-center gap-4 group">
                    <div class="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary border border-slate-200 dark:border-slate-700 transition-colors group-hover:bg-primary group-hover:text-white">
                       <span class="material-symbols-outlined">call</span>
                    </div>
                    <div>
                       <div class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Phone</div>
                       <a :href="'tel:' + contactDetails.phone" class="text-slate-900 dark:text-white font-medium hover:text-primary transition-colors">{{ contactDetails.phone }}</a>
                    </div>
                 </div>
                 
                 <div class="flex items-center gap-4 group">
                    <div class="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary border border-slate-200 dark:border-slate-700 transition-colors group-hover:bg-primary group-hover:text-white">
                       <span class="material-symbols-outlined">mail</span>
                    </div>
                    <div>
                       <div class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email</div>
                       <a :href="'mailto:' + contactDetails.email" class="text-slate-900 dark:text-white font-medium hover:text-primary transition-colors">{{ contactDetails.email }}</a>
                    </div>
                 </div>

                 <div class="flex items-center gap-4 group">
                    <div class="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary border border-slate-200 dark:border-slate-700 transition-colors group-hover:bg-primary group-hover:text-white">
                       <span class="material-symbols-outlined">location_on</span>
                    </div>
                    <div>
                       <div class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Location</div>
                       <p class="text-slate-900 dark:text-white font-medium">{{ contactDetails.location }}</p>
                    </div>
                 </div>
              </div>
           </div>

           <!-- Social Links or Additional Info -->
           <div class="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 shadow-lg">
              <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-6">Connect with me</h3>
              <div class="grid gap-4">
                 <a v-for="social in contactDetails.social" :key="social.name" :href="social.link" target="_blank" class="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group">
                    <div class="flex items-center gap-3">
                       <span class="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors">{{ social.icon }}</span>
                       <span class="font-medium text-slate-700 dark:text-slate-200">{{ social.name }}</span>
                    </div>
                    <span class="text-sm text-slate-500">{{ social.text }}</span>
                 </a>
              </div>
           </div>
        </div>
      </section>

      <!-- Footer -->
      <footer id="contact" class="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-background-dark py-10 transition-colors duration-300">
        <div class="max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6 reveal">
          <div class="flex flex-col gap-2 text-center md:text-left">
            <p class="text-slate-900 dark:text-white text-lg font-bold">{{ name }}</p>
            <p class="text-slate-600 dark:text-slate-400 text-sm">Crafting exceptional mobile experiences.</p>
          </div>
          <div class="flex items-center gap-6">
            <a class="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors" href="mailto:contact@stibinaugustine.com">
               <span class="flex items-center gap-2">
                   <span class="material-symbols-outlined">mail</span>
                   <span class="text-sm">Contact Me</span>
               </span>
            </a>
          </div>
        </div>
        <div class="max-w-[1280px] mx-auto px-4 md:px-10 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center md:text-left">
          <p class="text-slate-500 text-sm">© 2026 {{ name }}. All rights reserved.</p>
        </div>
      </footer>

    </main>
  </div>
</template>

<style>
/* Utilities if needed */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}

.reveal.active {
  opacity: 1;
  transform: translateY(0);
}
</style>
