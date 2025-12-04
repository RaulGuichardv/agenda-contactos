import { defineStore } from 'pinia'

// ✔ URL REAL de tu backend en InfinityFree
const API_BASE = 'https://agenda-contactos-jwt.infinityfreeapp.com/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    loading: false,
    error: null,
    isInitialized: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {

    initFromStorage() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      if (token) this.token = token
      if (user) this.user = JSON.parse(user)

      this.isInitialized = true
    },

    setSession(token, user) {
      this.token = token
      this.user = user

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },

    clearSession() {
      this.token = null
      this.user = null

      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    // LOGIN
    async login(username, password) {
      this.loading = true
      this.error = null

      try {
        const res = await fetch(`${API_BASE}/auth/login.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        })

        const data = await res.json()

        if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión')

        this.setSession(data.token, data.user)

      } catch (err) {
        this.error = err.message
        throw err

      } finally {
        this.loading = false
      }
    },

    // REGISTRO
    async register(username, password) {
      this.loading = true
      this.error = null

      try {
        const res = await fetch(`${API_BASE}/auth/register.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        })

        const data = await res.json()

        if (!res.ok) throw new Error(data.error || 'Error al registrar usuario')

        return data

      } catch (err) {
        this.error = err.message
        throw err

      } finally {
        this.loading = false
      }
    },

    // PERFIL
    async fetchProfile() {
      this.loading = true
      this.error = null

      try {
        const res = await fetch(`${API_BASE}/perfil.php`, {
          headers: {
            // ✔ FIX: InfinityFree no acepta Authorization
            'X-Auth-Token': `Bearer ${this.token}`
          }
        })

        const data = await res.json()

        if (!res.ok) throw new Error(data.error || 'Error al obtener perfil')

        this.user = data
        localStorage.setItem('user', JSON.stringify(data))

      } catch (err) {
        this.error = err.message

      } finally {
        this.loading = false
      }
    },

    // LOGOUT
    logout() {
      this.clearSession()
    },

    // Headers estándar
    authHeaders() {
      return {
        'Content-Type': 'application/json',
        // ✔ Cambiado por X-Auth-Token
        'X-Auth-Token': `Bearer ${this.token}`
      }
    },

    apiBase() {
      return API_BASE
    }

  }
})
