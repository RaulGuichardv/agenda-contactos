<template>
  <section class="card form-card">
    <h2>{{ isEdit ? 'Editar contacto' : 'Crear contacto' }}</h2>

    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label>Nombre *</label>
        <input v-model="form.nombre" type="text" required />
      </div>
      <div class="form-group">
        <label>Apellido</label>
        <input v-model="form.apellido" type="text" />
      </div>
      <div class="form-group">
        <label>Teléfono *</label>
        <input v-model="form.telefono" type="text" required />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" />
      </div>
      <div class="form-group">
        <label>Dirección</label>
        <input v-model="form.direccion" type="text" />
      </div>
      <div class="form-group">
        <label>Notas</label>
        <textarea v-model="form.notas"></textarea>
      </div>
      <button type="submit">{{ isEdit ? 'Actualizar' : 'Crear' }}</button>
    </form>

    <p v-if="loading">Guardando...</p>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const API_BASE = auth.apiBase()
const form = ref({
  nombre: '',
  apellido: '',
  telefono: '',
  email: '',
  direccion: '',
  notas: ''
})

const loading = ref(false)
const error = ref(null)
const successMessage = ref('')
const isEdit = computed(() => !!route.params.id)

const loadContact = async () => {
  if (!isEdit.value) return
  loading.value = true
  error.value = null
  try {
    const res = await fetch(`${API_BASE}/contactos/index.php`, {
      headers: auth.authHeaders() // ✔ Usamos X-Auth-Token
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Error al obtener contactos')
    const c = data.find((c) => String(c.id) === String(route.params.id))
    if (!c) throw new Error('Contacto no encontrado')
    form.value = {
      nombre: c.nombre,
      apellido: c.apellido,
      telefono: c.telefono,
      email: c.email,
      direccion: c.direccion,
      notas: c.notas
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

const onSubmit = async () => {
  if (!form.value.nombre || !form.value.telefono) {
    error.value = 'Nombre y teléfono son obligatorios'
    return
  }
  loading.value = true
  error.value = null
  successMessage.value = ''
  try {
    let res
    if (isEdit.value) {
      res = await fetch(
        `${API_BASE}/contactos/actualizar.php?id=${route.params.id}`,
        {
          method: 'PUT',
          headers: auth.authHeaders(), // ✔ X-Auth-Token
          body: JSON.stringify(form.value)
        }
      )
    } else {
      res = await fetch(`${API_BASE}/contactos/crear.php`, {
        method: 'POST',
        headers: auth.authHeaders(), // ✔ X-Auth-Token
        body: JSON.stringify(form.value)
      })
    }
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || (isEdit.value ? 'Error al actualizar' : 'Error al crear'))
    successMessage.value = isEdit.value ? 'Contacto actualizado' : 'Contacto creado'
    if (!isEdit.value) {
      form.value = {
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        direccion: '',
        notas: ''
      }
    }
    router.push({ name: 'agenda' })
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(loadContact)
</script>
