<template>
    <div>
        <h2>Мої файли</h2>
        <p>Список завантажених мною файлів</p>
        <v-card class="mx-auto" max-width="600">
            <v-file-input v-model="selectedFile" label="Select a PDF file" accept=".pdf" @change="handleFileChange" />

            <v-btn @click="uploadFile" :disabled="!selectedFile" class="upload-btn">
                Upload File 
            </v-btn>
            <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

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
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
                <v-list-item v-else>
                    <v-list-item-content>No files available.</v-list-item-content>
                </v-list-item>
            </v-list>
        </v-card>

        <v-btn @click="loadMoreFiles" class="load-more-btn" :disabled="!hasMoreFiles">
            Load More Files
        </v-btn>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const config = useRuntimeConfig();

const selectedFile = ref(null);
const files = ref([]);
const page = ref(1);
const hasMoreFiles = ref(true);
const errorMessage = ref('');
const successMessage = ref('');

const handleFileChange = (event) => {
    selectedFile.value = event.target.files[0];
    errorMessage.value = '';
};

const validateFileSize = (file) => {
    const MAX_SIZE_MB = 5;
    const fileSizeMB = file.size / (1024 * 1024);
    return fileSizeMB <= MAX_SIZE_MB;
};

const uploadFile = async () => {
    if (!selectedFile.value) return;

    if (!validateFileSize(selectedFile.value)) {
        errorMessage.value = 'File size exceeds 5 MB limit.';
        successMessage.value = '';
        return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile.value);

    try {
        const response = await fetch(`${config.public.apiUrl}/files/upload/66c8fdfea8db753709855293`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        successMessage.value = 'Файл успішно завантажено!';
        errorMessage.value = '';

        files.value.push(data.file);
        selectedFile.value = null;

        page.value = 1;
        await fetchFiles(true); 

    } catch (error) {
        errorMessage.value = `Error uploading file: ${error.message}`;
        successMessage.value = '';
    }
};

const fetchFiles = async (reset = false) => {
    if (reset) {
        files.value = [];
        hasMoreFiles.value = true;  // Ensure the "Load More" button is enabled when fetching files
        page.value = 1;
    }

    try {
        const response = await fetch(`${config.public.apiUrl}/users/66c8fdfea8db753709855293?page=${page.value}&limit=3`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        if (data && Array.isArray(data.files)) {
            files.value = [...files.value, ...data.files];
            hasMoreFiles.value = data.files.length >= 3;  
        } else {
            hasMoreFiles.value = false; 
        }
    } catch (error) {
        errorMessage.value = `Error fetching files: ${error.message}`;
    }
};

const loadMoreFiles = async () => {
    if (hasMoreFiles.value) {
        page.value += 1;
        await fetchFiles();
    }
};

onMounted(() => {
    fetchFiles();
});
</script>

<style scoped>
h2 {
    margin-bottom: 20px;
    font-size: 36px;
    text-align: center;
}

p {
    text-align: center;
    margin: 20px 0;
}

a {
    text-decoration: none;
    color: blue;
}
.upload-btn {
    display: block;
    margin: 10px auto;
}

.success-message {
    color: green;
    text-align: center;
}

.error-message {
    color: red;
    text-align: center;
}

.load-more-btn {
    display: block;
    margin: 20px auto;
}
</style>
