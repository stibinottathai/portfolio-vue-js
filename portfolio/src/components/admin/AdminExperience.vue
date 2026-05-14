<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../../firebase'
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, orderBy, serverTimestamp
} from 'firebase/firestore'
import { useToast } from '../../composables/useToast'

const { toast, showToast } = useToast()
const experiences = ref([])
const showForm = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const editId = ref(null)

const emptyForm = () => ({
  company: '', role: '', period: '', location: '',
  description: '', order: 0
})
const form = ref(emptyForm())

onMounted(() => {
  const q = query(collection(db, 'experiences'), orderBy('order', 'asc'))
  onSnapshot(q, (snap) => {
    experiences.value = snap.docs.map(d => ({
      id: d.id, ...d.data(),
      descriptionText: Array.isArray(d.data().description)
        ? d.data().description.join('\n') : d.data().description
    }))
  })
})

const openAdd = () => {
  form.value = emptyForm()
  form.value.order = experiences.value.length
  isEditing.value = false
  editId.value = null
  showForm.value = true
}

const openEdit = (exp) => {
  form.value = {
    company: exp.company, role: exp.role,
    period: exp.period, location: exp.location,
    description: exp.descriptionText,
    order: exp.order ?? 0
  }
  isEditing.value = true
  editId.value = exp.id
  showForm.value = true
}

const cancel = () => { showForm.value = false; form.value = emptyForm() }

const save = async () => {
  if (!form.value.company || !form.value.role) {
    showToast('error', 'Company and Role are required.')
    return
  }
  isSaving.value = true
  const descArr = form.value.description.split('\n').map(s => s.trim()).filter(Boolean)
  const payload = {
    company: form.value.company,
    role: form.value.role,
    period: form.value.period,
    location: form.value.location,
    description: descArr,
    order: Number(form.value.order) || 0
  }
  try {
    if (isEditing.value) {
      await updateDoc(doc(db, 'experiences', editId.value), payload)
      showToast('success', 'Experience updated!')
    } else {
      payload.createdAt = serverTimestamp()
      await addDoc(collection(db, 'experiences'), payload)
      showToast('success', 'Experience added!')
    }
    cancel()
  } catch {
    showToast('error', 'Failed to save.')
  } finally {
    isSaving.value = false
  }
}

const remove = async (id) => {
  if (!confirm('Delete this experience?')) return
  await deleteDoc(doc(db, 'experiences', id))
  showToast('success', 'Deleted.')
}
</script>

<template>
  <div class="panel-section">
    <div class="panel-header">
      <h2>Experience</h2>
      <p>Manage your professional experience entries.</p>
    </div>

    <!-- List -->
    <div class="item-list" v-if="!showForm">
      <div v-if="!experiences.length" class="empty-state-inline">No experience entries yet. Click 'Add Experience' to create one.</div>
      <div v-for="exp in experiences" :key="exp.id" class="item-card">
        <div class="item-card-body">
          <div class="item-card-title">{{ exp.role }}</div>
          <div class="item-card-sub">{{ exp.company }} · {{ exp.location }} · {{ exp.period }}</div>
        </div>
        <div class="item-card-actions">
          <button class="icon-btn" @click="openEdit(exp)" title="Edit">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button class="icon-btn icon-btn--danger" @click="remove(exp.id)" title="Delete">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
      <button @click="openAdd" class="btn btn-primary" style="align-self:flex-start;margin-top:0.5rem">
        <span class="material-symbols-outlined" style="font-size:18px">add</span>
        Add Experience
      </button>
    </div>

    <!-- Form -->
    <div v-else class="glass-card panel-form">
      <div class="add-form-header">
        <h3>{{ isEditing ? 'Edit Experience' : 'Add Experience' }}</h3>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Company *</label>
          <input v-model="form.company" type="text" placeholder="Company Name" />
        </div>
        <div class="form-group">
          <label>Role *</label>
          <input v-model="form.role" type="text" placeholder="Flutter Developer" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Period</label>
          <input v-model="form.period" type="text" placeholder="01/2022 - 12/2023" />
        </div>
        <div class="form-group">
          <label>Location</label>
          <input v-model="form.location" type="text" placeholder="Dubai, UAE" />
        </div>
      </div>
      <div class="form-group">
        <label>Description (one bullet per line)</label>
        <textarea v-model="form.description" rows="6" placeholder="Built cross-platform apps with Flutter&#10;Integrated REST APIs&#10;Used Riverpod for state management"></textarea>
      </div>
      <div class="form-group" style="max-width:120px">
        <label>Display Order</label>
        <input v-model="form.order" type="number" min="0" placeholder="0" />
      </div>
      <div class="form-actions">
        <button @click="cancel" class="btn btn-ghost">Cancel</button>
        <button @click="save" class="btn btn-primary" :disabled="isSaving">
          <span v-if="isSaving" class="spinner"></span>
          <span v-else class="material-symbols-outlined" style="font-size:18px">save</span>
          {{ isSaving ? 'Saving…' : isEditing ? 'Update' : 'Add' }}
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
.empty-state-inline { font-size:0.875rem; color:var(--text-muted); padding:1rem 0; }
</style>
