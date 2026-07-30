import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

const initialCategories = ['Electrician', 'Plumber', 'Cleaner', 'Mechanic', 'Painter', 'AC Repair']

export default function CategoryManagement() {
  const [categories, setCategories] = useState(initialCategories.map((name, index) => ({ id: index + 1, name, enabled: true })))
  const [name, setName] = useState('')

  const addCategory = (event) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setCategories((items) => [...items, { id: Date.now(), name: trimmed, enabled: true }])
    setName('')
  }

  return <div>
    <p className="eyebrow">ADMIN SETUP</p>
    <h1 className="mt-3 display-title">Service categories</h1>
    <p className="mt-3 max-w-3xl text-msp-secondary">Manage the category workspace while the backend category APIs are being exposed.</p>
    <form onSubmit={addCategory} className="card mt-8 flex flex-col gap-3 p-5 sm:flex-row">
      <input value={name} onChange={(event) => setName(event.target.value)} className="field" placeholder="Add category"/>
      <button className="btn-primary shrink-0"><Plus size={17} className="mr-2"/>Create</button>
    </form>
    <div className="mt-6 grid gap-3">
      {categories.map((category) => <article key={category.id} className="card flex flex-wrap items-center justify-between gap-4 p-4">
        <input value={category.name} onChange={(event) => setCategories((items) => items.map((item) => item.id === category.id ? { ...item, name: event.target.value } : item))} className="field max-w-md"/>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-bold text-msp-secondary">
            <input type="checkbox" checked={category.enabled} onChange={(event) => setCategories((items) => items.map((item) => item.id === category.id ? { ...item, enabled: event.target.checked } : item))}/>
            Enabled
          </label>
          <button onClick={() => setCategories((items) => items.filter((item) => item.id !== category.id))} className="rounded-lg border border-red-200 p-3 text-red-600 hover:bg-red-50" aria-label={`Delete ${category.name}`}><Trash2 size={17}/></button>
        </div>
      </article>)}
    </div>
  </div>
}
