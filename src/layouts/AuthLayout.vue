<template>
<v-app>
  <v-main>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card elevation="0" class="rounded-xl pa-2" color="cardColor">
            <v-card-title class="text-center py-5">
              <h1 class="text-h4 font-weight-bold primary--text">App de Tareas</h1>
            </v-card-title>
            <!-- donde se van a renderizar los componentes -->
            <router-view/>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</v-app>
</template>

<script setup></script>
