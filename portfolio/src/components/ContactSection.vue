<script setup>
import { ref } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const props = defineProps({
  contactDetails: {
    type: Object,
    required: false,
    default: () => ({
      email: 'stibinaugustine3047@gmail.com',
      phone: '+971 58 308 1024',
      location: 'Bur Dubai, Dubai, UAE',
      social: [
        { name:'GitHub', icon:'code', link: 'https://github.com/stibinottathai' },
        { name:'LinkedIn', icon:'work', link: 'https://in.linkedin.com/in/stibin-augustine-8075b1197' }
      ]
    })
  }
})

const name = ref('')
const email = ref('')
const message = ref('')
const isLoading = ref(false)
const toast = ref(null) // { type: 'success'|'error', msg: '' }

let toastTimer = null

const showToast = (type, msg) => {
  toast.value = { type, msg }
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = null }, 4500)
}

const handleSubmit = async () => {
  if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
    showToast('error', 'Please fill in all fields.')
    return
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email.value)) {
    showToast('error', 'Please enter a valid email address.')
    return
  }

  isLoading.value = true
  try {
    await addDoc(collection(db, 'contacts'), {
      name: name.value.trim(),
      email: email.value.trim(),
      message: message.value.trim(),
      timestamp: serverTimestamp(),
      read: false
    })
    showToast('success', "Message sent! I'll get back to you soon. 🚀")
    name.value = ''
    email.value = ''
    message.value = ''
  } catch (err) {
    console.error(err)
    showToast('error', 'Something went wrong. Please try again.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section id="contact" class="py-section-gap relative overflow-hidden bg-surface-container-low/30 dark:bg-surface-container-low/5 transition-colors duration-300">
    <!-- Background Orb -->
    <div class="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-gradient-to-tr from-secondary/5 to-transparent rounded-full pointer-events-none"></div>

    <div class="max-w-container-max mx-auto px-gutter">
      <div class="text-center mb-16 space-y-4">
        <h2 class="font-headline-lg text-primary dark:text-primary-fixed">Get In Touch</h2>
        <div class="w-24 h-1 bg-secondary dark:bg-secondary-fixed mx-auto rounded-full"></div>
        <p class="text-on-surface-variant dark:text-on-surface-variant/80 max-w-xl mx-auto">
          Have a project in mind or want to collaborate? I'd love to hear from you.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        <!-- Info Side -->
        <div class="lg:col-span-5 flex">
          <div class="w-full bg-white dark:bg-surface-container p-8 md:p-10 rounded-[2rem] shadow-lg border border-surface-container dark:border-outline/20 flex flex-col justify-between gap-10">
            <div class="space-y-8">
              <!-- Email -->
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-2xl bg-secondary-container dark:bg-secondary/20 flex items-center justify-center text-on-secondary-container dark:text-on-secondary shrink-0">
                  <span class="material-symbols-outlined text-2xl">mail</span>
                </div>
                <div>
                  <div class="font-bold text-xs uppercase tracking-wider text-on-surface-variant/65 mb-1">Email</div>
                  <a :href="'mailto:' + contactDetails.email" class="text-base font-semibold text-primary dark:text-primary-fixed hover:underline break-all">
                    {{ contactDetails.email }}
                  </a>
                </div>
              </div>

              <!-- Phone -->
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center text-white dark:text-on-primary-container shrink-0">
                  <span class="material-symbols-outlined text-2xl">call</span>
                </div>
                <div>
                  <div class="font-bold text-xs uppercase tracking-wider text-on-surface-variant/65 mb-1">Phone</div>
                  <a :href="'tel:' + contactDetails.phone.replace(/\s+/g, '')" class="text-base font-semibold text-primary dark:text-primary-fixed hover:underline">
                    {{ contactDetails.phone }}
                  </a>
                </div>
              </div>

              <!-- Location -->
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-2xl bg-error-container dark:bg-error/20 flex items-center justify-center text-on-error-container dark:text-on-error shrink-0">
                  <span class="material-symbols-outlined text-2xl">location_on</span>
                </div>
                <div>
                  <div class="font-bold text-xs uppercase tracking-wider text-on-surface-variant/65 mb-1">Location</div>
                  <span class="text-base font-semibold text-primary dark:text-primary-fixed">
                    {{ contactDetails.location }}
                  </span>
                </div>
              </div>

              <!-- Response Time -->
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-2xl bg-surface-container-high dark:bg-surface-container-highest flex items-center justify-center text-primary dark:text-primary-fixed shrink-0">
                  <span class="material-symbols-outlined text-2xl">schedule</span>
                </div>
                <div>
                  <div class="font-bold text-xs uppercase tracking-wider text-on-surface-variant/65 mb-1">Response Time</div>
                  <span class="text-base font-semibold text-primary dark:text-primary-fixed">
                    Within 24 hours
                  </span>
                </div>
              </div>
            </div>

            <!-- Social Links -->
            <div class="flex flex-wrap gap-3 pt-6 border-t border-outline-variant/30">
              <a v-for="link in contactDetails.social" :key="link.name" :href="link.link" target="_blank" 
                 class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant dark:text-on-surface-variant/80 bg-background dark:bg-background/30 border border-outline-variant/30 dark:border-outline/20 hover:border-secondary hover:text-secondary dark:hover:text-secondary-fixed transition-all">
                <span class="material-symbols-outlined text-sm">{{ link.icon }}</span>
                {{ link.name }}
              </a>
            </div>
          </div>
        </div>

        <!-- Form Side -->
        <div class="lg:col-span-7">
          <form class="bg-white dark:bg-surface-container p-8 md:p-10 rounded-[2rem] shadow-lg border border-surface-container dark:border-outline/20 space-y-6" @submit.prevent="handleSubmit" novalidate>
            <div class="mb-4">
              <h3 class="font-headline-md text-primary dark:text-primary-fixed mb-1">Send a Message</h3>
              <p class="text-on-surface-variant dark:text-on-surface-variant/80 text-sm">Fill out the form and I'll respond as soon as possible.</p>
            </div>

            <!-- Name Input -->
            <div class="flex flex-col gap-2">
              <label for="contact-name" class="text-xs font-bold uppercase tracking-wider text-on-surface-variant/75">Full Name</label>
              <div class="relative flex items-center bg-background dark:bg-background/20 border border-outline-variant/50 dark:border-outline/20 rounded-xl overflow-hidden focus-within:border-secondary transition-all">
                <span class="absolute left-4 material-symbols-outlined text-on-surface-variant/50">person</span>
                <input
                  id="contact-name"
                  v-model="name"
                  type="text"
                  placeholder="Your full name"
                  autocomplete="name"
                  :disabled="isLoading"
                  class="w-full pl-12 pr-4 py-3 bg-transparent text-on-background dark:text-on-surface focus:outline-none text-base"
                />
              </div>
            </div>

            <!-- Email Input -->
            <div class="flex flex-col gap-2">
              <label for="contact-email" class="text-xs font-bold uppercase tracking-wider text-on-surface-variant/75">Email Address</label>
              <div class="relative flex items-center bg-background dark:bg-background/20 border border-outline-variant/50 dark:border-outline/20 rounded-xl overflow-hidden focus-within:border-secondary transition-all">
                <span class="absolute left-4 material-symbols-outlined text-on-surface-variant/50">mail</span>
                <input
                  id="contact-email"
                  v-model="email"
                  type="email"
                  placeholder="your@email.com"
                  autocomplete="email"
                  :disabled="isLoading"
                  class="w-full pl-12 pr-4 py-3 bg-transparent text-on-background dark:text-on-surface focus:outline-none text-base"
                />
              </div>
            </div>

            <!-- Message Input -->
            <div class="flex flex-col gap-2">
              <label for="contact-message" class="text-xs font-bold uppercase tracking-wider text-on-surface-variant/75">Message</label>
              <div class="relative flex items-start bg-background dark:bg-background/20 border border-outline-variant/50 dark:border-outline/20 rounded-xl overflow-hidden focus-within:border-secondary transition-all">
                <span class="absolute left-4 top-4.5 material-symbols-outlined text-on-surface-variant/50">chat</span>
                <textarea
                  id="contact-message"
                  v-model="message"
                  placeholder="Tell me about your project or just say hi..."
                  rows="4"
                  :disabled="isLoading"
                  class="w-full pl-12 pr-4 py-3 bg-transparent text-on-background dark:text-on-surface focus:outline-none text-base resize-none"
                ></textarea>
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="w-full py-4 bg-primary text-white hover:bg-secondary dark:bg-primary-container dark:text-on-primary-container dark:hover:bg-primary transition-all rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer" :disabled="isLoading">
              <span v-if="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span v-else class="material-symbols-outlined text-lg">send</span>
              {{ isLoading ? 'Sending…' : 'Send Message' }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="toast" :class="[
        'fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-4 rounded-2xl shadow-xl font-bold text-sm backdrop-blur-md transition-all',
        toast.type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/15 border border-rose-500/40 text-rose-600 dark:text-rose-400'
      ]">
        <span class="material-symbols-outlined">{{ toast.type === 'success' ? 'check_circle' : 'error' }}</span>
        {{ toast.msg }}
      </div>
    </Transition>
  </section>
</template>

<style scoped>
/* Toast transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 16px);
}
</style>
