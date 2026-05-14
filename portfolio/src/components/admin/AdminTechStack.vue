<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useToast } from '../../composables/useToast'

const { toast, showToast } = useToast()
const isSaving = ref(false)
const newSkill = ref('')

const skills = ref([
  'Flutter','Dart','Firebase','REST API','State Management',
  'Clean Architecture','Git','Riverpod','Bloc','Provider','UI/UX Implementation'
])

onMounted(async () => {
  const snap = await getDoc(doc(db, 'portfolio', 'config'))
  if (snap.exists() && snap.data().skills?.length) {
    skills.value = snap.data().skills
  }
})

const addSkill = () => {
  const s = newSkill.value.trim()
  if (s && !skills.value.includes(s)) {
    skills.value.push(s)
    newSkill.value = ''
  }
}

const removeSkill = (i) => skills.value.splice(i, 1)

const save = async () => {
  isSaving.value = true
  try {
    await setDoc(doc(db, 'portfolio', 'config'), { skills: [...skills.value] }, { merge: true })
    showToast('success', 'Tech stack saved!')
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
      <h2>Tech Stack</h2>
      <p>Manage the skills shown in the hero section.</p>
    </div>

    <div class="glass-card panel-form">
      <div class="form-group">
        <label>Current Skills ({{ skills.length }})</label>
        <div class="chip-list">
          <span v-for="(skill, i) in skills" :key="skill" class="chip">
            {{ skill }}
            <button class="chip-remove" @click="removeSkill(i)" title="Remove">
              <span class="material-symbols-outlined">close</span>
            </button>
          </span>
          <span v-if="!skills.length" style="font-size:0.875rem;color:var(--text-muted)">No skills yet.</span>
        </div>
      </div>

      <div class="form-group">
        <label>Add a Skill</label>
        <div class="chip-add-row">
          <input
            v-model="newSkill"
            type="text"
            placeholder="e.g. GetX, SQLite…"
            @keyup.enter="addSkill"
          />
          <button @click="addSkill" class="btn btn-ghost">
            <span class="material-symbols-outlined" style="font-size:18px">add</span>
            Add
          </button>
        </div>
      </div>

      <div class="form-actions">
        <button @click="save" class="btn btn-primary" :disabled="isSaving">
          <span v-if="isSaving" class="spinner"></span>
          <span v-else class="material-symbols-outlined" style="font-size:18px">save</span>
          {{ isSaving ? 'Saving…' : 'Save Tech Stack' }}
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
