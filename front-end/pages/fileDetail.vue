<template>
    <div>
        <v-card class="mx-auto" max-width="600">
            <v-card-title>
                <h2>{{ file.filename }}</h2>
            </v-card-title>
            <v-card-subtitle>
                <strong>Author:</strong> {{ user.name }}<br>
                <strong>Size:</strong> {{ file.size }}<br>
                <strong>Format:</strong> {{ file.format }}<br>
                <!-- Additional details here -->
            </v-card-subtitle>
            <v-card-text>
                <!-- Add more details or content as needed -->
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            file: {},
            user: {},
        };
    },
    async created() {
        const fileId = this.$route.params.id;
        try {
            const response = await fetch(`http://localhost:3002/files/${fileId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            this.file = data.file;
            this.user = data.user;
        } catch (error) {
            console.error('Error fetching file details:', error.message);
        }
    }
};
</script>

<style scoped>
/* Add your styles here */
</style>
