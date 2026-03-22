import { useState } from 'react'
import { supabase } from '../supabaseClient'

function Admin() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  async function handleUpload() {
    if (!file) return
    
    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    
    const { error } = await supabase.storage
      .from('products')
      .upload(fileName, file)
    
    if (error) {
      alert('Ошибка загрузки: ' + error.message)
    } else {
      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(fileName)
      alert('Фото загружено! URL: ' + data.publicUrl)
    }
    setUploading(false)
  }

  return (
    <div className="page admin">
      <h1>📸 Загрузка фото</h1>
      <input 
        type="file" 
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button 
        onClick={handleUpload} 
        disabled={uploading}
        className="btn-primary"
      >
        {uploading ? 'Загрузка...' : 'Загрузить фото'}
      </button>
    </div>
  )
}

export default Admin
