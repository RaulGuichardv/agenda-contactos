<template>
  <section class="card form-card">
    <h2>Iniciar sesión</h2>

    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label>Usuario</label>
        <input v-model="username" type="text" required />
      </div>

      <div class="form-group">
        <label>Contraseña</label>
        <input v-model="password" type="password" required />
      </div>

      <button type="submit" :disabled="auth.loading">Entrar</button>
    </form>

    <p v-if="auth.error" class="error">{{ auth.error }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const successMessage = ref('')

const onSubmit = async () => {
  if (!username.value || !password.value) return
  try {
    await auth.login(username.value, password.value)
    successMessage.value = 'Login exitoso'
    router.push({ name: 'agenda' })
  } catch (e) {
    // error ya está en auth.error
  }
}
</script>
