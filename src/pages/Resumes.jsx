import { useEffect, useState } from 'react'
import { listResumes, deleteResume } from '../services/resumes'
import { Link } from 'react-router-dom'

export default function ResumesPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      setLoading(true)
      const data = await listResumes()
      setItems(data)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  const onDelete = async (id) => {
    if (!confirm('Delete this resume?')) return
    await deleteResume(id)
    await load()
  }

  return (
    <div>
      <h2>My Resumes</h2>
      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No resumes yet. Create one in the Editor.</p>
      ) : (
        <div className="list">
          {items.map(item => (
            <div key={item.id} className="list-item">
              <div>
                <strong>{item.title}</strong>
                <div style={{ color: '#94a3b8', fontSize: 12 }}>{new Date(item.created_at).toLocaleString()}</div>
              </div>
              <div className="row">
                <Link to={`/preview?id=${item.id}`}>
                  <button type="button">Preview</button>
                </Link>
                <button onClick={() => onDelete(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

