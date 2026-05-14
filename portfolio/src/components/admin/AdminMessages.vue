<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { db } from '../../firebase'
import {
  collection, onSnapshot, updateDoc, deleteDoc,
  doc, query, orderBy, writeBatch
} from 'firebase/firestore'

const messages = ref([])
const filter = ref('all')
const selectedMessage = ref(null)
let unsubMessages = null

const formatDate = (ts) => {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const unreadCount = () => messages.value.filter(m => !m.read).length

const filteredMessages = () => {
  if (filter.value === 'unread') return messages.value.filter(m => !m.read)
  if (filter.value === 'read') return messages.value.filter(m => m.read)
  return messages.value
}

const markRead = async (id, current) => {
  await updateDoc(doc(db, 'contacts', id), { read: !current })
  if (selectedMessage.value?.id === id) {
    selectedMessage.value = { ...selectedMessage.value, read: !current }
  }
}

const deleteMsg = async (id) => {
  if (selectedMessage.value?.id === id) selectedMessage.value = null
  await deleteDoc(doc(db, 'contacts', id))
}

const openMsg = async (msg) => {
  selectedMessage.value = msg
  if (!msg.read) await markRead(msg.id, false)
}

const isClearing = ref(false)
const clearAll = async () => {
  if (!messages.value.length) return
  if (!confirm('Are you sure you want to permanently delete ALL messages?')) return
  isClearing.value = true
  try {
    const batch = writeBatch(db)
    messages.value.forEach(msg => {
      const ref = doc(db, 'contacts', msg.id)
      batch.delete(ref)
    })
    await batch.commit()
    selectedMessage.value = null
  } catch (e) {
    console.error('Failed to clear messages', e)
  } finally {
    isClearing.value = false
  }
}

onMounted(() => {
  const q = query(collection(db, 'contacts'), orderBy('timestamp', 'desc'))
  unsubMessages = onSnapshot(q, (snap) => {
    messages.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  })
})

onUnmounted(() => { if (unsubMessages) unsubMessages() })
</script>

<template>
  <div class="panel-section" style="max-width:100%">
    <div class="panel-header" style="display:flex; justify-content:space-between; align-items:flex-start;">
      <div>
        <h2>Messages</h2>
        <p>{{ messages.length }} total · <span style="color:var(--accent-violet)">{{ unreadCount() }} unread</span></p>
      </div>
      <button v-if="messages.length" @click="clearAll" class="btn btn-ghost" style="color:#ef4444;" :disabled="isClearing">
        <span v-if="isClearing" class="spinner" style="border-color:rgba(239,68,68,0.3);border-top-color:#ef4444"></span>
        <span v-else class="material-symbols-outlined" style="font-size:18px">delete_sweep</span>
        Clear All
      </button>
    </div>

    <!-- Filter tabs -->
    <div class="filter-tabs">
      <button :class="['filter-tab', filter==='all'?'active':'']" @click="filter='all'">All ({{ messages.length }})</button>
      <button :class="['filter-tab', filter==='unread'?'active':'']" @click="filter='unread'">Unread ({{ unreadCount() }})</button>
      <button :class="['filter-tab', filter==='read'?'active':'']" @click="filter='read'">Read</button>
    </div>

    <div v-if="!filteredMessages().length" class="empty-msg">
      <span class="material-symbols-outlined">inbox</span>
      <p>No messages in this view.</p>
    </div>

    <div v-else class="messages-layout">
      <!-- List -->
      <div class="messages-list">
        <div
          v-for="msg in filteredMessages()" :key="msg.id"
          :class="['msg-row', !msg.read?'msg-row--unread':'', selectedMessage?.id===msg.id?'msg-row--selected':'']"
          @click="openMsg(msg)"
        >
          <div class="msg-avatar">{{ msg.name?.charAt(0).toUpperCase() }}</div>
          <div class="msg-preview">
            <div class="msg-preview-top">
              <span class="msg-name">{{ msg.name }}</span>
              <span class="msg-time">{{ formatDate(msg.timestamp) }}</span>
            </div>
            <span class="msg-email-text">{{ msg.email }}</span>
            <p class="msg-text-preview">{{ msg.message }}</p>
          </div>
          <div v-if="!msg.read" class="unread-dot"></div>
        </div>
      </div>

      <!-- Detail -->
      <div class="msg-detail glass-card" v-if="selectedMessage">
        <div class="detail-header">
          <div class="detail-avatar">{{ selectedMessage.name?.charAt(0).toUpperCase() }}</div>
          <div>
            <h3>{{ selectedMessage.name }}</h3>
            <a :href="'mailto:'+selectedMessage.email" class="detail-email">{{ selectedMessage.email }}</a>
          </div>
          <div class="detail-actions">
            <button class="icon-btn" @click="markRead(selectedMessage.id, selectedMessage.read)" :title="selectedMessage.read?'Mark unread':'Mark read'">
              <span class="material-symbols-outlined">{{ selectedMessage.read ? 'mark_email_unread' : 'drafts' }}</span>
            </button>
            <button class="icon-btn icon-btn--danger" @click="deleteMsg(selectedMessage.id)" title="Delete">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
        <div class="detail-meta">
          <span class="tag">{{ formatDate(selectedMessage.timestamp) }}</span>
          <span :class="['tag', selectedMessage.read?'tag--read':'tag--unread']">{{ selectedMessage.read?'Read':'Unread' }}</span>
        </div>
        <div class="detail-body"><p>{{ selectedMessage.message }}</p></div>
        <a :href="'mailto:'+selectedMessage.email+'?subject=Re: Your message'" class="btn btn-primary" style="margin-top:1.5rem;align-self:flex-start">
          <span class="material-symbols-outlined" style="font-size:18px">reply</span>
          Reply via Email
        </a>
      </div>
      <div class="msg-detail-empty glass-card" v-else>
        <span class="material-symbols-outlined">mail_open</span>
        <p>Select a message to read it</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './admin-shared.css';

.filter-tabs { display:flex; gap:0.5rem; margin-bottom:1.25rem; }
.filter-tab {
  padding:0.4rem 1rem; border-radius:8px; border:1px solid var(--border-subtle);
  background:var(--bg-secondary); color:var(--text-muted); font-size:0.8125rem;
  font-weight:600; cursor:pointer; transition:all 0.2s;
}
.filter-tab.active { background:rgba(139,92,246,0.12); border-color:rgba(139,92,246,0.3); color:var(--accent-violet); }

.empty-msg { display:flex; flex-direction:column; align-items:center; gap:0.75rem; padding:3rem; color:var(--text-muted); }
.empty-msg .material-symbols-outlined { font-size:40px; opacity:0.3; }

.messages-layout { display:grid; grid-template-columns:320px 1fr; gap:1rem; height:calc(100vh - 220px); }
@media(max-width:1100px){ .messages-layout{ grid-template-columns:1fr; } }

.messages-list { overflow-y:auto; border:1px solid var(--border-subtle); border-radius:14px; background:var(--bg-secondary); }
.msg-row { display:flex; align-items:flex-start; gap:0.75rem; padding:0.875rem 1rem; cursor:pointer; border-bottom:1px solid var(--border-subtle); transition:background 0.15s; position:relative; }
.msg-row:last-child { border-bottom:none; }
.msg-row:hover { background:var(--bg-card); }
.msg-row--selected { background:rgba(139,92,246,0.08)!important; border-left:3px solid var(--accent-violet); }
.msg-row--unread .msg-name { font-weight:700; }
.msg-avatar { width:38px;height:38px;min-width:38px;border-radius:50%;background:linear-gradient(135deg,var(--accent-violet),var(--accent-cyan));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;color:#fff; }
.msg-preview { flex:1;min-width:0; }
.msg-preview-top { display:flex;align-items:center;justify-content:space-between;gap:0.5rem;margin-bottom:0.15rem; }
.msg-name { font-size:0.875rem;font-weight:500;color:var(--text-primary); }
.msg-time { font-size:0.7rem;color:var(--text-muted);white-space:nowrap; }
.msg-email-text { font-size:0.75rem;color:var(--text-muted);display:block;margin-bottom:0.2rem; }
.msg-text-preview { font-size:0.8rem;color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
.unread-dot { width:8px;height:8px;min-width:8px;border-radius:50%;background:var(--accent-violet);margin-top:0.35rem; }

.msg-detail { padding:1.5rem;display:flex;flex-direction:column;overflow-y:auto; }
.msg-detail-empty { display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.75rem;color:var(--text-muted); }
.msg-detail-empty .material-symbols-outlined { font-size:40px;opacity:0.3; }
.detail-header { display:flex;align-items:center;gap:0.875rem;margin-bottom:0.875rem; }
.detail-avatar { width:48px;height:48px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,var(--accent-violet),var(--accent-cyan));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem;color:#fff; }
.detail-header h3 { font-size:1rem;color:var(--text-primary);margin-bottom:0.1rem; }
.detail-email { font-size:0.8125rem;color:var(--accent-violet);text-decoration:none; }
.detail-email:hover { text-decoration:underline; }
.detail-actions { margin-left:auto;display:flex;gap:0.4rem; }
.detail-meta { display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1rem; }
.tag--read { background:rgba(16,185,129,0.1);border-color:rgba(16,185,129,0.3);color:#10b981; }
.tag--unread { background:rgba(139,92,246,0.1);border-color:rgba(139,92,246,0.3);color:var(--accent-violet); }
.detail-body { background:var(--bg-secondary);border:1px solid var(--border-subtle);border-radius:10px;padding:1.1rem;flex:1; }
.detail-body p { font-size:0.9rem;line-height:1.75;color:var(--text-primary);white-space:pre-wrap; }
</style>
