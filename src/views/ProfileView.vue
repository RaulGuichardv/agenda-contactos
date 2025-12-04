<template>
  <section class="card form-card">
    <h2>Perfil de usuario</h2>

    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label>Usuario</label>
        <input v-model="username" type="text" required />
      </div>

      <div class="form-group">
        <label>Nueva contraseña (opcional)</label>
        <input v-model="password" type="password" />
      </div>

      <button type="submit" :disabled="loading">Guardar cambios</button>
    </form>

    <p v-if="loading">Guardando...</p>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const API_BASE = auth.apiBase()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)
const successMessage = ref('')

onMounted(async () => {
  if (!auth.user) {
    await auth.fetchProfile()
  }
  username.value = auth.user?.nombre_de_usuario || auth.user?.username || ''
})

const onSubmit = async () => {
  loading.value = true
  error.value = null
  successMessage.value = ''
  try {
    const body = {
      username: username.value,
      password: password.value || undefined
    }
    const res = await fetch(`${API_BASE}/editar.php`, {
      method: 'PUT',
      headers: auth.authHeaders(), // ✔ Aquí usamos X-Auth-Token
      body: JSON.stringify(body)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Error al actualizar perfil')
    successMessage.value = 'Perfil actualizado'
    await auth.fetchProfile()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
