<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isDark = ref(false)

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
const textToType = 'Flutter Developer.'
const isTyping = ref(true)
let charIndex = 0

const typeEffect = () => {
  if (charIndex <= textToType.length) {
    typingText.value = textToType.substring(0, charIndex)
    charIndex++
    setTimeout(typeEffect, 100)
  } else {
    isTyping.value = false
  }
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
  'Riverpod',
  'Bloc',
  'Provider',
  'UI/UX Implementation'
])

const experience = ref([
  {
    company: 'App Station',
    role: 'Flutter Developer',
    period: '09/2024 - Current',
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
    title: 'Spendly',
    tags: ['Flutter', 'Dart', 'Firebase','Riverpod'],
    description: 'Spendly is a smart expense tracker that helps you easily monitor your daily spending with clear and detailed statistics. It allows you to track expenses over time, understand your spending habits, and manage your finances more effectively with monthly and yearly insights.',
    image: '/spendly.png',
    detailsLink: '#',
    sourceLink: '#'
  },
  {
    title: 'Luckey Spinner',
    tags: ['Flutter', 'Dart', 'SqfLite','Riverpod'],
    description: 'Lucky Spinner lets you add names, spin the wheel, and instantly pick a random winner. It’s perfect for games, quick decisions, giveaways, and fun group activities.',
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
// ... existing code ...
    sourceLink: '#'
  }
])

const contactDetails = ref({
  email: 'stibinaugustine3047@gmail.com',
  phone: '+91 884 805 3964',
  location: 'Kannur, Kerala, India',
  social: [
    { name: 'GitHub', icon: 'code', link: 'https://github.com/stibinottathai', text: 'github.com/stibin' },
    { name: 'LinkedIn', icon: 'work', link: 'https://in.linkedin.com/in/stibin-augustine-8075b1197', text: 'linkedin.com/in/stibin' },
    
  ]
})

const isMenuOpen = ref(false)

onMounted(() => {
  // Check for saved user preference
  if (localStorage.theme === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
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

// Project Description Expansion
const expandedProjects = ref([])

const toggleExpand = (index) => {
  if (expandedProjects.value.includes(index)) {
    expandedProjects.value = expandedProjects.value.filter(i => i !== index)
  } else {
    expandedProjects.value.push(index)
  }
}

// Image Modal State
const selectedImage = ref(null)

const openImageModal = (imageUrl) => {
  selectedImage.value = imageUrl
  document.body.style.overflow = 'hidden' // Prevent scrolling when modal is open
}

const closeImageModal = () => {
  selectedImage.value = null
  document.body.style.overflow = 'auto'
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
            About
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
      <section id="home" class="relative flex flex-col justify-start lg:justify-center min-h-[90vh] pt-8 lg:py-20 pb-0">
        <!-- Background Gradient Effect -->
        <div class="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none transition-transform duration-100 ease-out" :style="{ transform: `translate(${mouseX * -30}px, ${mouseY * -30}px)` }"></div>
        <div class="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none transition-transform duration-100 ease-out" :style="{ transform: `translate(${mouseX * 30}px, ${mouseY * 30}px)` }"></div>
        
        <div class="container mx-auto px-6 lg:px-8 relative z-10">
          <div class="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <!-- Text Content -->
            <div class="flex flex-col gap-6 max-w-2xl reveal">
              
              <!-- Mobile Header: Image + Name -->
              <div class="flex items-center gap-6 lg:block">
                  <!-- Mobile Image -->
                  <div class="lg:hidden shrink-0 relative w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200 dark:border-white/10 shadow-lg">
                      <img src="/profile.png" alt="Stibin Augustine" class="absolute inset-0 h-full w-full object-cover" />
                  </div>
                  
                  <div class="flex flex-col gap-4">
                      <div class="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm shadow-sm dark:shadow-none">
                        <span class="relative flex h-2 w-2">
                          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Available for new projects
                      </div>
                      <h1 class="text-3xl md:text-5xl font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
                        Hi, I'm Stibin. <br class="hidden lg:block"/>
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-slate-600 dark:to-white/60 min-h-[1.2em] inline-block">{{ typingText }}</span>
                        <span v-show="isTyping" class="animate-pulse text-primary font-thin">|</span>
                      </h1>
                  </div>
              </div>

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
            
            <!-- Visual Anchor (Desktop Only) -->
            <div class="hidden lg:flex relative h-full items-center justify-end reveal" style="transition-delay: 200ms;">
              <div class="relative aspect-square w-full max-w-lg rounded-2xl overflow-hidden bg-gradient-to-br from-background-light to-slate-100 dark:from-background-dark dark:to-[#020617] border border-slate-200 dark:border-white/10 shadow-2xl group transition-all duration-100 ease-out"
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
                      <ul v-if="Array.isArray(job.description)" class="list-disc list-outside ml-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed space-y-1">
                        <li v-for="(point, i) in job.description" :key="i">{{ point }}</li>
                      </ul>
                      <p v-else class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
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
              <div @click="openImageModal(project.image)" class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer z-10">
                <span class="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/20 hover:bg-white/20 transition-colors">View Full Image</span>
              </div>
            </div>
            <div class="flex flex-col flex-1 p-5 md:p-6 gap-4">
              <div class="flex flex-wrap gap-2">
                <span v-for="tag in project.tags" :key="tag" class="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs font-semibold">{{ tag }}</span>
              </div>
              <div class="flex flex-col gap-2">
                <h3 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{{ project.title }}</h3>
                <p :class="['text-slate-600 dark:text-slate-400 text-sm leading-relaxed transition-all duration-300', expandedProjects.includes(index) ? '' : 'line-clamp-3']">
                   {{ project.description }}
                </p>
                <button 
                  @click.stop="toggleExpand(index)" 
                  class="text-primary text-sm font-medium mt-1 hover:underline focus:outline-none self-start flex items-center gap-1"
                >
                  {{ expandedProjects.includes(index) ? 'Show Less' : 'Read More' }}
                  <span class="material-symbols-outlined text-sm transition-transform duration-300" :class="{ 'rotate-180': expandedProjects.includes(index) }">expand_more</span>
                </button>
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
            <a class="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors" href="mailto:stibinaugustine3047@gmail.com">
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

    <!-- Image Modal -->
    <div v-if="selectedImage" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-10 transition-all duration-300" @click="closeImageModal">
      <div class="relative w-full max-w-5xl h-full max-h-[90vh] flex items-center justify-center">
        <button @click="closeImageModal" class="absolute -top-12 right-0 text-white hover:text-primary transition-colors">
          <span class="material-symbols-outlined text-4xl">close</span>
        </button>
        <img :src="selectedImage" alt="Project Preview" class="max-w-full max-h-full object-contain rounded-lg shadow-2xl" @click.stop />
      </div>
    </div>
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
