<!-- pages/files/[id].vue -->
<template>
    <div>
        <pre>{{ file }}</pre>
        <h2>File Details</h2>
        <v-card class="mx-auto" max-width="600">
            <v-list-item>
                <!-- <v-list-item-content>
                    <v-list-item-title>{{ file.filename }}</v-list-item-title>
                    <v-list-item-subtitle>
                        Size: {{ file.size }}<br>
                        Format: {{ file.format }}<br>
                        Author: {{ file.author }}<br>
                        <!-- Add any other details you need -->
                <!-- </v-list-item-subtitle>
                </v-list-item-content> --> -->
            </v-list-item>
        </v-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const file = ref(null);

onMounted(async () => {
    try {
        const response = await fetch(`http://localhost:3002/files/${route.params.id}`);
        const data = await response.json();
        file.value = data;
    } catch (error) {
        console.error('Error fetching file details:', error);
    }
});
</script>