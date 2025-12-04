<template>
  <section class="card form-card">
    <h2>Registro de usuario</h2>

    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label>Usuario</label>
        <input v-model="username" type="text" required />
      </div>

      <div class="form-group">
        <label>Contraseña</label>
        <input v-model="password" type="password" required minlength="4" />
      </div>

      <button type="submit" :disabled="auth.loading">Registrar</button>
    </form>

    <p v-if="auth.error" class="error">{{ auth.error }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const username = ref('')
const password = ref('')
const successMessage = ref('')

const onSubmit = async () => {
  if (!username.value || !password.value) return
  try {
    await auth.register(username.value, password.value)
    successMessage.value = 'Usuario registrado, ahora puedes iniciar sesión'
    username.value = ''
    password.value = ''
  } catch (e) {
    // error ya en auth.error
  }
}
</script>
