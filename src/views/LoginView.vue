<template>
  <v-card-text class="pa-6">
    <v-form @submit.prevent="handleLogin" ref="form">
      <v-alert v-if="authStore.error" type="error" class="mb-4 rounded-xl"
                closable @click:close="authStore.clearError">
        {{ authStore.error }}
      </v-alert>

      <v-text-field v-model="email" type="email" variant="outlined" rounded
                    label="Correo Electrónico" prepend-inner-icon="mdi-email"
                    :rules="[rules.email, rules.requiered]" autocomplete="email" class="mb-4"
      />

      <v-text-field v-model="password" label="Contraseña" :type="showPassword ? 'text':'password'" variant="outlined" rounded
                    prepend-inner-icon="mdi-lock" :append-icon="showPassword ? 'mdi-eye-off':'mdi-eye'"
                    @click:append="showPassword = !showPassword"
                    :rules="[rules.password, rules.requiered]"
      />

      <v-row align="center" justify="center" class="mt-4 pa-4">
        <v-btn type="submit" variant="tonal" color="primary" rounded :loading="authStore.loading" class="mr-4">
          Iniciar Sesión
        </v-btn>
        <v-btn variant="tonal" to="/register" color="accent" rounded>
          Registrate aquí
        </v-btn>
      </v-row>

    </v-form>
  </v-card-text>

</template>

<script setup>
import {ref} from "vue";
import {useAuthStore} from "@/stores/auth";

const authStore = useAuthStore();

// Referencia al formulario
const form = ref(null);

// Variables para el form
const email = ref('');
const password = ref('');
const showPassword = ref(false);

const rules = {
  requiered: value => !!value || 'Este campo es obligatorio.',
  email: value => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Correo inválido.'
  },
  password: value => (value && value.length >= 8) || 'La contraseña debe contener al menos 8 caracteres.'
}

const handleLogin = async () => {
  const isValid = await form.value?.validate();

  if (isValid){
    await authStore.login({
      email:email.value,
      password:password.value
    });
  }
}
</script>
