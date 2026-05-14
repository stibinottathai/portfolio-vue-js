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
  <section id="contact" class="section contact-section">
    <!-- Background decoration -->
    <div class="contact-bg-orb"></div>

    <div class="container">
      <div class="section-header reveal">
        <h2>Get In Touch</h2>
        <div class="accent-line"></div>
        <p class="section-subtitle">Have a project in mind or want to collaborate? I'd love to hear from you.</p>
      </div>

      <div class="contact-grid reveal reveal-delay-1">
        <!-- Info Side -->
        <div class="contact-info">
          <div class="contact-info-card glass-card">
            <div class="contact-info-item">
              <div class="contact-icon-wrap">
                <span class="material-symbols-outlined">mail</span>
              </div>
              <div>
                <div class="contact-info-label">Email</div>
                <a :href="'mailto:' + contactDetails.email" class="contact-info-value">
                  {{ contactDetails.email }}
                </a>
              </div>
            </div>

            <div class="contact-info-item">
              <div class="contact-icon-wrap">
                <span class="material-symbols-outlined">call</span>
              </div>
              <div>
                <div class="contact-info-label">Phone</div>
                <a :href="'tel:' + contactDetails.phone.replace(/\\s+/g, '')" class="contact-info-value">{{ contactDetails.phone }}</a>
              </div>
            </div>

            <div class="contact-info-item">
              <div class="contact-icon-wrap">
                <span class="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <div class="contact-info-label">Location</div>
                <span class="contact-info-value">{{ contactDetails.location }}</span>
              </div>
            </div>

            <div class="contact-info-item">
              <div class="contact-icon-wrap">
                <span class="material-symbols-outlined">schedule</span>
              </div>
              <div>
                <div class="contact-info-label">Response Time</div>
                <span class="contact-info-value">Within 24 hours</span>
              </div>
            </div>

            <div class="contact-socials">
              <a v-for="link in contactDetails.social" :key="link.name" :href="link.link" target="_blank" class="contact-social-btn">
                <span class="material-symbols-outlined">{{ link.icon }}</span>
                {{ link.name }}
              </a>
            </div>
          </div>
        </div>

        <!-- Form Side -->
        <div class="contact-form-wrap">
          <form class="contact-form glass-card" @submit.prevent="handleSubmit" novalidate>
            <div class="form-header">
              <h3>Send a Message</h3>
              <p>Fill out the form and I'll respond as soon as possible.</p>
            </div>

            <div class="form-group">
              <label for="contact-name">Full Name</label>
              <div class="input-wrap">
                <span class="input-icon material-symbols-outlined">person</span>
                <input
                  id="contact-name"
                  v-model="name"
                  type="text"
                  placeholder="Your full name"
                  autocomplete="name"
                  :disabled="isLoading"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="contact-email">Email Address</label>
              <div class="input-wrap">
                <span class="input-icon material-symbols-outlined">mail</span>
                <input
                  id="contact-email"
                  v-model="email"
                  type="email"
                  placeholder="your@email.com"
                  autocomplete="email"
                  :disabled="isLoading"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="contact-message">Message</label>
              <div class="input-wrap textarea-wrap">
                <span class="input-icon material-symbols-outlined" style="align-self: flex-start; margin-top: 0.9rem;">chat</span>
                <textarea
                  id="contact-message"
                  v-model="message"
                  placeholder="Tell me about your project or just say hi..."
                  rows="5"
                  :disabled="isLoading"
                ></textarea>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg submit-btn" :disabled="isLoading">
              <span v-if="isLoading" class="spinner"></span>
              <span v-else class="material-symbols-outlined" style="font-size:18px">send</span>
              {{ isLoading ? 'Sending…' : 'Send Message' }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast" :class="['toast', 'toast--' + toast.type]">
        <span class="material-symbols-outlined">{{ toast.type === 'success' ? 'check_circle' : 'error' }}</span>
        {{ toast.msg }}
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.contact-section {
  position: relative;
  overflow: hidden;
}

.contact-bg-orb {
  position: absolute;
  bottom: -200px;
  right: -200px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

/* Grid */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 0.5rem;
}

@media (min-width: 1024px) {
  .contact-grid {
    grid-template-columns: 0.85fr 1.15fr;
    gap: 2.5rem;
  }
}

/* Info Card */
.contact-info-card {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
}

.contact-info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.contact-icon-wrap {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(34, 211, 238, 0.1));
  border: 1px solid rgba(139, 92, 246, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-icon-wrap .material-symbols-outlined {
  font-size: 18px;
  color: var(--accent-violet);
}

.contact-info-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 0.2rem;
}

.contact-info-value {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.2s;
}

a.contact-info-value:hover {
  color: var(--accent-violet);
}

.contact-socials {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-subtle);
}

.contact-social-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  text-decoration: none;
  transition: all 0.2s;
}

.contact-social-btn:hover {
  color: var(--accent-violet);
  border-color: var(--accent-violet);
  background: rgba(139, 92, 246, 0.08);
}

.contact-social-btn .material-symbols-outlined {
  font-size: 16px;
}

/* Form */
.contact-form {
  padding: 2rem;
}

.form-header {
  margin-bottom: 1.75rem;
}

.form-header h3 {
  font-size: 1.25rem;
  color: var(--text-primary);
  margin-bottom: 0.35rem;
}

.form-header p {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.form-group label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.input-wrap {
  display: flex;
  align-items: center;
  gap: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-wrap:focus-within {
  border-color: var(--accent-violet);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.12);
}

.textarea-wrap {
  align-items: flex-start;
}

.input-icon {
  font-size: 18px;
  color: var(--text-muted);
  padding: 0 0.75rem;
  flex-shrink: 0;
}

.input-wrap input,
.input-wrap textarea {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  padding: 0.75rem 0.75rem 0.75rem 0;
  resize: none;
  line-height: 1.6;
}

.input-wrap input::placeholder,
.input-wrap textarea::placeholder {
  color: var(--text-muted);
  opacity: 0.7;
}

.input-wrap input:disabled,
.input-wrap textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-btn {
  width: 100%;
  justify-content: center;
  margin-top: 0.5rem;
  gap: 0.5rem;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Spinner */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Toast */
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 8px 30px rgba(0,0,0,0.25);
  backdrop-filter: blur(16px);
}

.toast--success {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #10b981;
}

.toast--error {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #ef4444;
}

.toast .material-symbols-outlined {
  font-size: 20px;
}

/* Toast transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(16px);
}
</style>
