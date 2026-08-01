import { Plus, RefreshCw, Save, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { adminApi } from '../../api/adminApi'
import ApiState from '../../components/common/ApiState'
import EmptyState from '../../components/common/EmptyState'

const emptyForm = { name: '', description: '', active: true }

export default function CategoryManagement() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await adminApi.getCategories()
      setCategories(asArray(data))
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load categories.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const createCategory = async (event) => {
    event.preventDefault()
    const payload = normalizeCategory(form)
    if (!payload.name) return toast.error('Category name is required')
    setBusyId('create')
    try {
      await adminApi.createCategory(payload)
      toast.success('Category created')
      setForm(emptyForm)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Create failed')
    } finally {
      setBusyId('')
    }
  }

  const updateCategory = async (category) => {
    setBusyId(`save-${category.id}`)
    try {
      await adminApi.updateCategory(category.id, normalizeCategory(category))
      toast.success('Category updated')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setBusyId('')
    }
  }

  const deleteCategory = async (category) => {
    setBusyId(`delete-${category.id}`)
    try {
      await adminApi.deleteCategory(category.id)
      toast.success('Category deleted')
      setCategories((items) => items.filter((item) => item.id !== category.id))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    } finally {
      setBusyId('')
    }
  }

  return <div>
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="eyebrow">ADMIN SETUP</p>
        <h1 className="mt-3 display-title">Service categories</h1>
        <p className="mt-3 max-w-3xl text-msp-secondary">Create, update, enable, disable, and delete service categories.</p>
      </div>
      <button onClick={load} className="btn-secondary"><RefreshCw size={17} className="mr-2"/>Refresh</button>
    </div>

    <form onSubmit={createCategory} className="card mt-8 grid gap-3 p-5 lg:grid-cols-[1fr_2fr_auto_auto]">
      <input value={form.name} onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))} className="field" placeholder="Category name"/>
      <input value={form.description} onChange={(event) => setForm((value) => ({ ...value, description: event.target.value }))} className="field" placeholder="Description"/>
      <label className="flex items-center gap-2 text-sm font-bold text-msp-secondary">
        <input type="checkbox" checked={form.active} onChange={(event) => setForm((value) => ({ ...value, active: event.target.checked }))}/>
        Active
      </label>
      <button disabled={busyId === 'create'} className="btn-primary shrink-0"><Plus size={17} className="mr-2"/>Create</button>
    </form>

    <div className="mt-6">
      {loading ? <div className="card p-6 text-msp-secondary">Loading categories...</div> : error ? <ApiState message={error} onRetry={load}/> : categories.length === 0 ? <EmptyState title="No categories" message="Create the first service category."/> : <div className="grid gap-3">
        {categories.map((category) => <article key={category.id} className="card grid gap-3 p-4 lg:grid-cols-[1fr_2fr_auto_auto_auto]">
          <input value={category.name ?? ''} onChange={(event) => updateLocal(category.id, 'name', event.target.value, setCategories)} className="field"/>
          <input value={category.description ?? ''} onChange={(event) => updateLocal(category.id, 'description', event.target.value, setCategories)} className="field" placeholder="Description"/>
          <label className="flex items-center gap-2 text-sm font-bold text-msp-secondary">
            <input type="checkbox" checked={Boolean(category.active)} onChange={(event) => updateLocal(category.id, 'active', event.target.checked, setCategories)}/>
            Active
          </label>
          <button onClick={() => updateCategory(category)} disabled={busyId === `save-${category.id}`} className="btn-secondary px-4 py-2"><Save size={17} className="mr-2"/>Save</button>
          <button onClick={() => deleteCategory(category)} disabled={busyId === `delete-${category.id}`} className="rounded-lg border border-red-200 p-3 text-red-600 hover:bg-red-50" aria-label={`Delete ${category.name}`}><Trash2 size={17}/></button>
        </article>)}
      </div>}
    </div>
  </div>
}

function updateLocal(id, field, value, setCategories) {
  setCategories((items) => items.map((item) => item.id === id ? { ...item, [field]: value } : item))
}

function normalizeCategory(category) {
  return {
    name: category.name?.trim() ?? '',
    description: category.description?.trim() ?? '',
    active: Boolean(category.active)
  }
}

function asArray(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.data)) return data.data
  return []
}
