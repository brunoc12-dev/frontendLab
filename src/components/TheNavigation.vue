<template>
  <v-navigation-drawer v-model="drawerOpen" app>
    <v-list>
      <v-list-item prepend-icon="mdi-home" title="Dashboard" to="/dashboard" />
      <v-list-item prepend-icon="mdi-check-circle" title="Tareas" to="/tasks" />
      <v-divider class="my-3"></v-divider>
      
      <v-list-group value="Contabilidad">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-file-document"
            title="Contabilidad"
          ></v-list-item>
        </template>
        
        <v-list-item
          prepend-icon="mdi-upload"
          title="Subir XML"
          to="/contabilidad"
          class="pl-4"
        />
        <v-list-item
          prepend-icon="mdi-chart-box"
          title="Dashboard"
          to="/contabilidad/dashboard"
          class="pl-4"
        />
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import {ref, provide} from "vue";
import {useAuthStore} from "@/stores/auth";
import { inject } from 'vue';

const drawerOpen = inject('menu');

const authStore = useAuthStore();

const logout = () => {
  authStore.logout()
}
</script>