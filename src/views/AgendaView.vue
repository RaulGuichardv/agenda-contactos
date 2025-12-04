<template>
  <section class="card">
    <div class="card-header">
      <h2>Mis contactos</h2>
      <RouterLink class="btn" to="/agenda/crear">Nuevo contacto</RouterLink>
    </div>

    <div class="form-group">
      <label>Buscar:</label>
      <input v-model="query" type="text" placeholder="Nombre o apellido" />
    </div>

    <p v-if="loading">Cargando contactos...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <table v-if="filteredContacts.length" class="contacts-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Teléfono</th>
          <th>Email</th>
          <th>Notas</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in filteredContacts" :key="c.id">
          <td>{{ c.nombre }} {{ c.apellido }}</td>
          <td>{{ c.telefono }}</td>
          <td>{{ c.email }}</td>
          <td>{{ c.notas }}</td>
          <td>
            <RouterLink class="btn-sm" :to="`/agenda/${c.id}`">Editar</RouterLink>
            <button class="btn-sm danger" @click="removeContact(c.id)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else-if="!loading">No hay contactos.</p>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const contacts = ref([])
const loading = ref(false)
const error = ref(null)
const query = ref('')

// Usamos apiBase y authHeaders del store
const API_BASE = auth.apiBase()

const fetchContacts = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await fetch(`${API_BASE}/contactos/index.php`, {
      headers: auth.authHeaders() // ✔ Aquí ya usamos X-Auth-Token
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Error al obtener contactos')
    contacts.value = data
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

const removeContact = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar este contacto?')) return
  try {
    const res = await fetch(`${API_BASE}/contactos/eliminar.php?id=${id}`, {
      method: 'DELETE',
      headers: auth.authHeaders() // ✔ También aquí usamos X-Auth-Token
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Error al eliminar')
    await fetchContacts()
  } catch (e) {
    error.value = e.message
  }
}

const filteredContacts = computed(() => {
  if (!query.value) return contacts.value
  const q = query.value.toLowerCase()
  return contacts.value.filter(
    (c) =>
      (c.nombre && c.nombre.toLowerCase().includes(q)) ||
      (c.apellido && c.apellido.toLowerCase().includes(q))
  )
})

onMounted(fetchContacts)
</script>