<template>
    <div>
        <h2>File Details</h2>
        <v-card class="mx-auto" max-width="600">
            <v-list-item v-if="file">
                <v-list-item-content>
                    <v-list-item-title>{{ file.filename }}</v-list-item-title>
                    <v-list-item-subtitle>
                        Size: {{ file.size }}<br>
                        Format: {{ file.format }}<br>
                        Author: {{ file.user?.name || 'Unknown' }}<br>
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item v-else>
                <v-list-item-content>Loading file details...</v-list-item-content>
            </v-list-item>
        </v-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRuntimeConfig } from '#app';

const route = useRoute();
const config = useRuntimeConfig();
const file = ref(null);

onMounted(async () => {
    try {
        const fileId = route.params.id;
        const response = await fetch(`${config.public.apiUrl}/files/${fileId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        file.value = data;
    } catch (error) {
        console.error('Error fetching file details:', error);
    }
});
</script>
