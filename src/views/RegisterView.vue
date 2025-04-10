<template>
  <v-card-text class="pa-8">
    <v-form @submit.prevent="handleRegister" ref="form">
      <v-alert v-if="authStore.error" type="error" class="rounded-xl mb-6" closable @click:close="authStore.clearError">
        {{ authStore.error }}
      </v-alert>

      <v-text-field v-model="firstName" label="Nombre(s)" prepend-inner-icon="mdi-account" class="mb-3"
                    :rules="[rules.requiered]" autocomplete="firstName" variant="outlined" rounded/>
      <v-text-field v-model="lastName" label="Apellidos" prepend-inner-icon="mdi-account"  class="mb-3"
                    :rules="[rules.requiered]" autocomplete="lastName" variant="outlined" rounded/>
      <v-text-field v-model="userName" label="Nombre Usuario" prepend-inner-icon="mdi-account-circle"  class="mb-3"
                    :rules="[rules.requiered]" autocomplete="userName" variant="outlined" rounded/>
      <v-text-field v-model="email" type="email" label="Correo Electrónico" prepend-inner-icon="mdi-email" class="mb-3"
                    :rules="[rules.email, rules.requiered]" autocomplete="email" variant="outlined" rounded/>

      <v-text-field v-model="password" label="Contraseña" :type="showPassword ? 'text':'password'"
                    prepend-inner-icon="mdi-lock" :append-icon="showPassword ? 'mdi-eye-off':'mdi-eye'"
                    @click:append="showPassword = !showPassword" variant="outlined" rounded
                    :rules="[rules.minLength, rules.requiered]" autocomplete="new-password" class="mb-3"
      />

      <v-text-field v-model="confirmPassword" label="Confirmar Contraseña" :type="showPassword ? 'text':'password'" variant="outlined" rounded
                    prepend-inner-icon="mdi-lock-check" :rules="[rules.passwordMatch, rules.requiered]" autocomplete="new-password"
      />

      <v-checkbox v-model="acceptTerms" label="Acepto los términos y condiciones" :rules="[rules.acceptTermsValidation]"/>

      <v-btn type="submit" variant="tonal" color="primary" rounded block class="mt-2" :loading="authStore.loading">
        Registrarse
      </v-btn>

    </v-form>
  </v-card-text>

  <v-card-actions class="justify-center pb-6">
    <p>¿Ya tienes una cuenta?</p>
    <v-btn variant="text" to="/login" color="accent" rounded>
      Inicia Sesión aquí
    </v-btn>
  </v-card-actions>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const form = ref(null);
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const userName = ref('');
const password = ref('');
const confirmPassword = ref('');
const acceptTerms = ref(false);
const showPassword = ref(false);

const rules = {
  requiered: v => !!v || 'Este campo es obligatorio.',
  email: value => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Correo inválido.'
  },
  minLength: v => (v && v.length >= 8) || 'La contraseña debe contener al menos 8 caracteres.',
  passwordMatch: v => v === password.value || 'Las contraseñas no coinciden.',
  acceptTermsValidation: v => v || 'Debes aceptar los terminos y condciones.'
}

const handleRegister = async () => {
  const isValid = await form.value?.validate();

  if (isValid){
    await authStore.register({
      "first_name": firstName.value,
      "last_name": lastName.value,
      "email": email.value,
      "username": userName.value,
      "password": password.value
    })
  }

}

</script>
