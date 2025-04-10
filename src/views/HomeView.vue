<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card elevation="0" class="rounded-xl pa-2" color="cardColor">
          <v-img src="https://cdn.prod.website-files.com/5f7cf835bc0fc5eb13e5c57d/65ef763f685dc4979bc2b362_ODT-tability_understanding-tasks-projects-goals.jpg" height="200px" cover class="rounded-xl"></v-img>
          <v-card-title>App de Tareas</v-card-title>
          <v-card-text>
            <p>Para acceder a las funcionalidades de la aplicación, inicia sesión o registrate</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn to="/login" variant="text" color="primary" rounded>Iniciar Sesión</v-btn>
            <v-btn to="/register" variant="text" color="secondary" rounded>Registrarse</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup></script>