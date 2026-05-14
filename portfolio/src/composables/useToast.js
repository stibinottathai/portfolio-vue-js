import { ref } from 'vue'

export function useToast() {
  const toast = ref(null)
  let timer = null

  const showToast = (type, msg) => {
    toast.value = { type, msg }
    clearTimeout(timer)
    timer = setTimeout(() => { toast.value = null }, 4000)
  }

  return { toast, showToast }
}
