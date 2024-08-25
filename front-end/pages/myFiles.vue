<template>
    <div>
        <h2>My Files</h2>
        <p>This section contains all your files and related information.</p>
        <v-card class="mx-auto" max-width="600">
            <v-list>
                <v-list-item-group v-if="files.length">
                    <v-list-item v-for="file in files" :key="file._id">
                        <v-list-item-content>
                            <v-list-item-title>
                                <a :href="`/files/${file._id}`" target="_blank">{{ file.filename }}</a>
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                Size: {{ file.size }}<br>
                                Format: {{ file.format }}<br>
                                <!-- Pages: {{ file.pages || 'N/A' }} -->
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
                <v-list-item v-else>
                    <v-list-item-content>No files available.</v-list-item-content>
                </v-list-item>
            </v-list>
        </v-card>

        <v-btn @click="loadMoreFiles" class="mt-4" :disabled="!hasMoreFiles">
            Load More Files
        </v-btn>
    </div>
</template>

<script>
export default {
    data() {
        return {
            files: [],
            page: 1,
            limit: 3,
            userId: '66c8fdfea8db753709855293',
            hasMoreFiles: true, // Track if there are more files to load
        };
    },
    methods: {
        async fetchFiles() {
            try {
                const response = await fetch(`http://localhost:3002/users/${this.userId}?page=${this.page}&limit=${this.limit}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                console.log("Fetched data:", data);

                if (data && Array.isArray(data.files)) {
                    this.files = [...this.files, ...data.files];
                    this.hasMoreFiles = data.files.length >= this.limit; // Update based on response length
                    console.log("Updated files array:", this.files);
                } else {
                    this.hasMoreFiles = false;
                    console.warn('No files found in response.');
                }
            } catch (error) {
                console.error('Error fetching files:', error.message);
            }
        },
        async loadMoreFiles() {
            if (this.hasMoreFiles) {
                this.page += 1;
                await this.fetchFiles();
            }
        }
    },
    async created() {
        await this.fetchFiles();
    }
};
</script>

<style scoped>
h2 {
    margin-bottom: 20px;
    font-size: 36px;
}

p {
    margin: 20px 0;
}

a {
    text-decoration: none;
    color: blue;
}
</style>
