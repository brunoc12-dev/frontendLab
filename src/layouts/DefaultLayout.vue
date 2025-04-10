<template>
    <v-app>
        <TheHeader/>

        <TheNavigation/>

        <v-main>
            <v-container fluid>
                <router-view/>
            </v-container>
        </v-main>

        <TheFooter/>
    </v-app>
</template>

<script setup>
import TheHeader from '@/components/TheHeader.vue';
import TheNavigation from '@/components/TheNavigation.vue';
import TheFooter from '@/components/TheFooter.vue';
import { ref, provide } from 'vue';

const drawerOpen = ref(false);
provide('menu', drawerOpen);

</script>