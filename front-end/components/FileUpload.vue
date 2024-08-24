const { $axios } = useNuxtApp()

const uploadFile = async () => {
  if (!file.value) return
  const formData = new FormData()
  formData.append('file', file.value)
  formData.append('userId', 'YOUR_USER_ID')

  try {
    await $axios.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    fetchFiles()
  } catch (error) {
    console.error(error)
  }
}

const fetchFiles = async () => {
  try {
    const { data } = await $axios.get(`/files?page=${page.value}`)
    files.value = data.files
    totalPages.value = data.totalPages
  } catch (error) {
    console.error(error)
  }
}
