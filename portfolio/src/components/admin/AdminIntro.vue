<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useToast } from '../../composables/useToast'

const { toast, showToast } = useToast()
const isSaving = ref(false)

const form = ref({
  name: 'Stibin Augustine',
  typingText: 'Flutter Developer.',
  summary: 'Flutter Developer with 4+ years of experience and strong skills in mobile application design and API integration. Committed to enhancing user experience through performance optimization and effective state management.',
  badgeText: 'Available for new projects',
  available: true,
  profileImageUrl: ''
})

onMounted(async () => {
  const snap = await getDoc(doc(db, 'portfolio', 'config'))
  if (snap.exists() && snap.data().intro) {
    Object.assign(form.value, snap.data().intro)
  }
})

const save = async () => {
  isSaving.value = true
  try {
    await setDoc(doc(db, 'portfolio', 'config'), { intro: { ...form.value } }, { merge: true })
    showToast('success', 'Introduction saved!')
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
      <h2>Introduction / Hero</h2>
      <p>Edits the hero section of your portfolio.</p>
    </div>

    <div class="glass-card panel-form">
      <div class="form-row">
        <div class="form-group">
          <label>Your Name</label>
          <input v-model="form.name" type="text" placeholder="Stibin Augustine" />
        </div>
        <div class="form-group">
          <label>Typing Text (after "I'm …")</label>
          <input v-model="form.typingText" type="text" placeholder="Flutter Developer." />
        </div>
      </div>

      <div class="form-group">
        <label>Badge Text</label>
        <div class="input-with-toggle">
          <input v-model="form.badgeText" type="text" placeholder="Available for new projects" />
          <label class="toggle-label">
            <input type="checkbox" v-model="form.available" />
            <span class="toggle-switch"></span>
            {{ form.available ? 'Visible' : 'Hidden' }}
          </label>
        </div>
      </div>

      <div class="form-group">
        <label>Summary Paragraph</label>
        <textarea v-model="form.summary" rows="4" placeholder="Your professional summary..."></textarea>
      </div>

      <div class="section-divider">Profile Photo</div>
      
      <div class="form-group">
        <label>Profile Image URL</label>
        <input v-model="form.profileImageUrl" type="url" placeholder="https://example.com/my-photo.jpg" />
        <div v-if="form.profileImageUrl" class="image-preview" style="margin-top: 1rem; text-align: center;">
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">Live Preview:</p>
          <img :src="form.profileImageUrl" alt="Profile Preview" style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%; border: 3px solid var(--accent-violet); box-shadow: var(--shadow-glow);" @error="form.profileImageUrl = ''" />
        </div>
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
