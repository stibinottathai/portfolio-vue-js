<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useToast } from '../../composables/useToast'

const { toast, showToast } = useToast()
const isSaving = ref(false)

const form = ref({
  content: 'As a passionate Flutter Developer, I specialize in building high-performance mobile applications. With a deep understanding of Clean Architecture and State Management, I create scalable and maintainable codebases. I am always eager to learn new technologies and improve my skills.',
  phone: '+971 58 308 1024',
  email: 'stibinaugustine3047@gmail.com',
  location: 'Bur Dubai, Dubai, UAE',
  github: 'https://github.com/stibinottathai',
  linkedin: 'https://in.linkedin.com/in/stibin-augustine-8075b1197'
})

onMounted(async () => {
  const snap = await getDoc(doc(db, 'portfolio', 'config'))
  if (snap.exists() && snap.data().about) {
    Object.assign(form.value, snap.data().about)
  }
})

const save = async () => {
  isSaving.value = true
  try {
    await setDoc(doc(db, 'portfolio', 'config'), { about: { ...form.value } }, { merge: true })
    showToast('success', 'About section saved!')
  } catch {
    showToast('error', 'Failed to save.')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="panel-section">
    <div class="panel-header">
      <h2>About Me</h2>
      <p>Edit your about section and contact details.</p>
    </div>

    <div class="glass-card panel-form">
      <div class="form-group">
        <label>About Text</label>
        <textarea v-model="form.content" rows="5" placeholder="Write about yourself..."></textarea>
      </div>

      <div class="section-divider">Contact Details</div>

      <div class="form-row">
        <div class="form-group">
          <label>Phone</label>
          <input v-model="form.phone" type="text" placeholder="+971 58 308 1024" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="you@email.com" />
        </div>
      </div>

      <div class="form-group">
        <label>Location</label>
        <input v-model="form.location" type="text" placeholder="City, Country" />
      </div>

      <div class="section-divider">Social Links</div>

      <div class="form-group">
        <label>GitHub URL</label>
        <input v-model="form.github" type="url" placeholder="https://github.com/username" />
      </div>
      <div class="form-group">
        <label>LinkedIn URL</label>
        <input v-model="form.linkedin" type="url" placeholder="https://linkedin.com/in/username" />
      </div>

      <div class="form-actions">
        <button @click="save" class="btn btn-primary" :disabled="isSaving">
          <span v-if="isSaving" class="spinner"></span>
          <span v-else class="material-symbols-outlined" style="font-size:18px">save</span>
          {{ isSaving ? 'Saving…' : 'Save Changes' }}
        </button>
      </div>
    </div>

    <Transition name="toast">
      <div v-if="toast" :class="['admin-toast', 'admin-toast--' + toast.type]">
        <span class="material-symbols-outlined">{{ toast.type === 'success' ? 'check_circle' : 'error' }}</span>
        {{ toast.msg }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@import './admin-shared.css';
</style>
