<script setup>
import { ref } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const props = defineProps({
  contactDetails: {
    type: Object,
    required: true
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
    showToast('success', "Message sent! I will get back to you shortly.")
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
  <section id="contact" class="py-20 transition-colors duration-300">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-8">
      <div class="md:col-span-4">
        <h2 class="font-sans font-medium text-xs uppercase tracking-[0.18em] text-mute">
          06 / Contact
        </h2>
      </div>
      <div class="md:col-span-8">
        <h3 class="font-sans font-semibold text-3xl tracking-tight text-ink">
          Let's discuss new projects and opportunities.
        </h3>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-8">
      <!-- Info Column -->
      <div class="lg:col-span-5 flex">
        <div class="w-full bg-canvas-soft border border-hairline p-6 md:p-8 rounded-lg flex flex-col justify-between gap-10">
          <div class="space-y-6">
            <!-- Email -->
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 border border-hairline rounded-md flex items-center justify-center text-ink shrink-0 bg-canvas-mid">
                <span class="material-symbols-outlined text-sm">mail</span>
              </div>
              <div>
                <div class="font-mono text-[10px] uppercase tracking-wider text-mute mb-1">Email</div>
                <a :href="'mailto:' + contactDetails.email" class="text-sm font-sans text-ink hover:underline break-all">
                  {{ contactDetails.email }}
                </a>
              </div>
            </div>

            <!-- Phone -->
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 border border-hairline rounded-md flex items-center justify-center text-ink shrink-0 bg-canvas-mid">
                <span class="material-symbols-outlined text-sm">call</span>
              </div>
              <div>
                <div class="font-mono text-[10px] uppercase tracking-wider text-mute mb-1">Phone</div>
                <a :href="'tel:' + contactDetails.phone.replace(/\s+/g, '')" class="text-sm font-sans text-ink hover:underline">
                  {{ contactDetails.phone }}
                </a>
              </div>
            </div>

            <!-- Location -->
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 border border-hairline rounded-md flex items-center justify-center text-ink shrink-0 bg-canvas-mid">
                <span class="material-symbols-outlined text-sm">location_on</span>
              </div>
              <div>
                <div class="font-mono text-[10px] uppercase tracking-wider text-mute mb-1">Location</div>
                <span class="text-sm font-sans text-ink">
                  {{ contactDetails.location }}
                </span>
              </div>
            </div>

            <!-- Response time indicator -->
            <div class="flex items-start gap-4">
              <div class="w-8 h-8 border border-hairline rounded-md flex items-center justify-center text-ink shrink-0 bg-canvas-mid">
                <span class="material-symbols-outlined text-sm">schedule</span>
              </div>
              <div>
                <div class="font-mono text-[10px] uppercase tracking-wider text-mute mb-1">Response Time</div>
                <span class="text-sm font-sans text-ink">
                  Within 24 hours
                </span>
              </div>
            </div>
          </div>

          <!-- Social link row -->
          <div class="flex flex-wrap gap-3 pt-6 border-t border-hairline">
            <a :href="contactDetails.github" target="_blank" 
               class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-hairline text-xs font-mono text-mute hover:text-ink hover:border-ink transition-all bg-canvas-mid">
              <span class="material-symbols-outlined text-xs">code</span>
              GitHub
            </a>
            <a :href="contactDetails.linkedin" target="_blank" 
               class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-hairline text-xs font-mono text-mute hover:text-ink hover:border-ink transition-all bg-canvas-mid">
              <span class="material-symbols-outlined text-xs">share</span>
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <!-- Form Column -->
      <div class="lg:col-span-7">
        <form class="bg-canvas-soft border border-hairline p-6 md:p-8 rounded-lg space-y-6" @submit.prevent="handleSubmit" novalidate>
          <div class="mb-4">
            <h4 class="font-sans font-semibold text-lg text-ink mb-1">Send a Message</h4>
            <p class="text-mute text-xs">Complete the fields below and I will respond to your inquiry shortly.</p>
          </div>

          <!-- Name Input -->
          <div class="flex flex-col gap-2">
            <label for="contact-name" class="font-mono text-[10px] uppercase tracking-wider text-mute">Full Name</label>
            <div class="relative flex items-center border border-hairline rounded-md bg-canvas focus-within:border-primary transition-all">
              <span class="absolute left-4 material-symbols-outlined text-sm text-mute">person</span>
              <input
                id="contact-name"
                v-model="name"
                type="text"
                placeholder="Name"
                autocomplete="name"
                :disabled="isLoading"
                class="w-full pl-10 pr-4 py-2.5 bg-transparent text-ink focus:outline-none text-sm"
              />
            </div>
          </div>

          <!-- Email Input -->
          <div class="flex flex-col gap-2">
            <label for="contact-email" class="font-mono text-[10px] uppercase tracking-wider text-mute">Email Address</label>
            <div class="relative flex items-center border border-hairline rounded-md bg-canvas focus-within:border-primary transition-all">
              <span class="absolute left-4 material-symbols-outlined text-sm text-mute">mail</span>
              <input
                id="contact-email"
                v-model="email"
                type="email"
                placeholder="Email"
                autocomplete="email"
                :disabled="isLoading"
                class="w-full pl-10 pr-4 py-2.5 bg-transparent text-ink focus:outline-none text-sm"
              />
            </div>
          </div>

          <!-- Message Input -->
          <div class="flex flex-col gap-2">
            <label for="contact-message" class="font-mono text-[10px] uppercase tracking-wider text-mute">Message</label>
            <div class="relative flex items-start border border-hairline rounded-md bg-canvas focus-within:border-primary transition-all">
              <span class="absolute left-4 top-3.5 material-symbols-outlined text-sm text-mute">chat</span>
              <textarea
                id="contact-message"
                v-model="message"
                placeholder="Write your message here..."
                rows="4"
                :disabled="isLoading"
                class="w-full pl-10 pr-4 py-2.5 bg-transparent text-ink focus:outline-none text-sm resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" 
                  class="w-full py-3 bg-primary text-on-primary hover:bg-primary-hover hover:border hover:border-hairline transition-all rounded-md font-mono text-xs uppercase tracking-[0.1em] flex items-center justify-center gap-2 cursor-pointer" 
                  :disabled="isLoading">
            <span v-if="isLoading" class="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></span>
            <span v-else class="material-symbols-outlined text-sm">send</span>
            {{ isLoading ? 'Sending…' : 'Submit Message' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="toast" 
           :class="[
             'fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-4 rounded border backdrop-blur-md transition-all font-mono text-xs uppercase tracking-wider',
             toast.type === 'success' ? 'bg-canvas-soft border-emerald-500/40 text-emerald-500' : 'bg-canvas-soft border-rose-500/40 text-rose-500'
           ]">
        <span class="material-symbols-outlined text-base">{{ toast.type === 'success' ? 'check_circle' : 'error' }}</span>
        {{ toast.msg }}
      </div>
    </Transition>
  </section>
</template>

<style scoped>
/* Toast transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 16px);
}
</style>
