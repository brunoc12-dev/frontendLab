<template>
    <v-app-bar app color="primary" dark>
        <v-btn @click="menuAction" icon="mdi-menu" class="ml-3"></v-btn>
        <v-app-title>
          <h1 class="text-subtitle-1 ml-4">Aplicación de Tareas</h1>
          <h1 class="text-subtitle-1 ml-4"></h1>
        </v-app-title>
        <v-spacer/>
        <v-menu min-width="200">
            <template v-slot:activator="{ props }" v-if="authStore.user">
                <v-btn icon v-bind="props">
                    <v-avatar size="36">
                        <v-icon>mdi-account-circle</v-icon>
                    </v-avatar>
                </v-btn>
            </template>

            <v-card>
                <v-card-text>
                    <div class="text-h6 mb-1" v-if="authStore.user">
                        {{ authStore.user.username }}
                    </div>
                    <v-divider/>
                    <v-list density="compact" nav>
                        <v-list-item to="/dashboard" prepend-icon="mdi-view-dashboard">
                            Dashboard
                        </v-list-item>
                        <v-list-item @click="logout" prepend-icon="mdi-logout">
                            Cerrar Sesión
                        </v-list-item>
                    </v-list>
                </v-card-text>
            </v-card>
        </v-menu>
    </v-app-bar>
</template>


<script setup>
import {inject} from 'vue';
import {useAuthStore} from '@/stores/auth';

// para acceder al store de autenticación
const authStore = useAuthStore();
// para obtener la función para cerrar o abrir el drawer desde el provide
let toggleDrawer = inject('menu');

const menuAction = () => {
    toggleDrawer.value = !toggleDrawer.value;
}

const logout = () => {
    authStore.logout();
}

</script>