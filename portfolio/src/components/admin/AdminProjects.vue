<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../../firebase'
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, orderBy, serverTimestamp
} from 'firebase/firestore'
import { useToast } from '../../composables/useToast'

const { toast, showToast } = useToast()
const projects = ref([])
const showForm = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const editId = ref(null)
const imgPreview = ref('')

const emptyForm = () => ({
  title: '', tags: '', description: '',
  image: '', image2: '', detailsLink: '#', sourceLink: '#', websiteLink: '', order: 0
})
const form = ref(emptyForm())

onMounted(() => {
  const q = query(collection(db, 'projects'), orderBy('order', 'asc'))
  onSnapshot(q, (snap) => {
    projects.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  })
})

const openAdd = () => {
  form.value = emptyForm()
  form.value.order = projects.value.length
  imgPreview.value = ''
  isEditing.value = false
  editId.value = null
  showForm.value = true
}

const openEdit = (p) => {
  form.value = {
    title: p.title, tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags,
    description: p.description, image: p.image, image2: p.image2 || '',
    detailsLink: p.detailsLink || '#', sourceLink: p.sourceLink || '#',
    websiteLink: p.websiteLink || '',
    order: p.order ?? 0
  }
  imgPreview.value = p.image
  isEditing.value = true
  editId.value = p.id
  showForm.value = true
}

const cancel = () => { showForm.value = false; form.value = emptyForm(); imgPreview.value = '' }

const onImageInput = () => { imgPreview.value = form.value.image }

const save = async () => {
  if (!form.value.title) {
    showToast('error', 'Project title is required.')
    return
  }
  isSaving.value = true
  const tagsArr = form.value.tags.split(',').map(s => s.trim()).filter(Boolean)
  const payload = {
    title: form.value.title,
    tags: tagsArr,
    description: form.value.description,
    image: form.value.image,
    image2: form.value.image2 || '',
    detailsLink: form.value.detailsLink || '#',
    sourceLink: form.value.sourceLink || '#',
    websiteLink: form.value.websiteLink || '',
    order: Number(form.value.order) || 0
  }
  try {
    if (isEditing.value) {
      await updateDoc(doc(db, 'projects', editId.value), payload)
      showToast('success', 'Project updated!')
    } else {
      payload.createdAt = serverTimestamp()
      await addDoc(collection(db, 'projects'), payload)
      showToast('success', 'Project added!')
    }
    cancel()
  } catch {
    showToast('error', 'Failed to save.')
  } finally {
    isSaving.value = false
  }
}

const remove = async (id) => {
  if (!confirm('Delete this project?')) return
  await deleteDoc(doc(db, 'projects', id))
  showToast('success', 'Deleted.')
}
</script>

<template>
  <div class="panel-section">
    <div class="panel-header">
      <h2>Projects</h2>
      <p>Add, edit, or remove portfolio projects.</p>
    </div>

    <!-- List -->
    <div class="item-list" v-if="!showForm">
      <div v-if="!projects.length" class="empty-state-inline">No projects yet. Click 'Add Project' to create one.</div>
      <div v-for="proj in projects" :key="proj.id" class="item-card">
        <img v-if="proj.image" :src="proj.image" :alt="proj.title" class="proj-thumb" />
        <div class="item-card-body">
          <div class="item-card-title">{{ proj.title }}</div>
          <div class="item-card-sub">{{ Array.isArray(proj.tags) ? proj.tags.join(', ') : proj.tags }}</div>
        </div>
        <div class="item-card-actions">
          <button class="icon-btn" @click="openEdit(proj)" title="Edit">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button class="icon-btn icon-btn--danger" @click="remove(proj.id)" title="Delete">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
      <button @click="openAdd" class="btn btn-primary" style="align-self:flex-start;margin-top:0.5rem">
        <span class="material-symbols-outlined" style="font-size:18px">add</span>
        Add Project
      </button>
    </div>

    <!-- Form -->
    <div v-else class="glass-card panel-form">
      <div class="add-form-header">
        <h3>{{ isEditing ? 'Edit Project' : 'Add Project' }}</h3>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Project Title *</label>
          <input v-model="form.title" type="text" placeholder="QuickReceipt" />
        </div>
        <div class="form-group" style="max-width:120px">
          <label>Display Order</label>
          <input v-model="form.order" type="number" min="0" placeholder="0" />
        </div>
      </div>

      <div class="form-group">
        <label>Tags (comma separated)</label>
        <input v-model="form.tags" type="text" placeholder="Flutter, Dart, Firebase, Bloc" />
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea v-model="form.description" rows="4" placeholder="Describe the project..."></textarea>
      </div>

      <div class="form-group">
        <label>Image 1 (URL or /filename.png)</label>
        <input v-model="form.image" type="text" placeholder="/quick_receipt.jpg or https://..." @input="onImageInput" />
        <div v-if="imgPreview" class="img-preview">
          <img :src="imgPreview" alt="Preview" @error="imgPreview = ''" />
        </div>
      </div>

      <div class="form-group">
        <label>Image 2 (Optional URL or /filename.png)</label>
        <input v-model="form.image2" type="text" placeholder="/second_image.jpg or https://..." />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Details Link</label>
          <input v-model="form.detailsLink" type="text" placeholder="#" />
        </div>
        <div class="form-group">
          <label>GitHub Link (Optional)</label>
          <input v-model="form.sourceLink" type="text" placeholder="https://github.com/..." />
        </div>
        <div class="form-group">
          <label>Website Link (Optional)</label>
          <input v-model="form.websiteLink" type="text" placeholder="https://" />
        </div>
      </div>

      <div class="form-actions">
        <button @click="cancel" class="btn btn-ghost">Cancel</button>
        <button @click="save" class="btn btn-primary" :disabled="isSaving">
          <span v-if="isSaving" class="spinner"></span>
          <span v-else class="material-symbols-outlined" style="font-size:18px">save</span>
          {{ isSaving ? 'Saving…' : isEditing ? 'Update' : 'Add Project' }}
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
.proj-thumb {
  width: 56px; height: 56px; object-fit: cover;
  border-radius: 8px; border: 1px solid var(--border-subtle); flex-shrink: 0;
}
.img-preview {
  margin-top: 0.5rem; border-radius: 10px; overflow: hidden;
  border: 1px solid var(--border-subtle); max-width: 280px;
}
.img-preview img { width: 100%; height: 160px; object-fit: cover; display: block; }
</style>
