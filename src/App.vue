<template>
  <div class="app-container">
    <header class="app-header">
      <h1>Agenda JWT</h1>
      <nav class="nav">
        <RouterLink to="/">Inicio</RouterLink>
        <RouterLink v-if="!auth.isAuthenticated" to="/login">Login</RouterLink>
        <RouterLink v-if="!auth.isAuthenticated" to="/registro">Registro</RouterLink>
        <RouterLink v-if="auth.isAuthenticated" to="/agenda">Agenda</RouterLink>
        <RouterLink v-if="auth.isAuthenticated" to="/perfil">Perfil</RouterLink>
        <button v-if="auth.isAuthenticated" @click="logout">Salir</button>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()
const router = useRouter()

const logout = () => {
  auth.logout()
  router.push({ name: 'home' })
}
</script>
