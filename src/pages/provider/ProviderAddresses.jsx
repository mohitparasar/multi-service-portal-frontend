import { MapPin, Pencil, Plus, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { providerApi } from '../../api/providerApi'
import ApiState from '../../components/common/ApiState'
import EmptyState from '../../components/common/EmptyState'
import { getApiErrorMessage } from '../../utils/apiError'

const blank = { addressLine: '', city: '', state: '', pincode: '', latitude: '', longitude: '', primaryAddress: true }

export default function ProviderAddresses() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(blank)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const load = useCallback(async()=>{setLoading(true);setError('');try{const {data}=await providerApi.getAddresses();setItems(Array.isArray(data)?data:[])}catch(err){setError(getApiErrorMessage(err,'Unable to load service addresses. Create your provider profile first.'))}finally{setLoading(false)}},[])
  useEffect(()=>{load()},[load])
  const update = (event) => setForm({...form,[event.target.name]:event.target.type==='checkbox'?event.target.checked:event.target.value})
  const submit = async(event)=>{event.preventDefault();setSaving(true);setError('');try{const payload={...form,latitude:Number(form.latitude),longitude:Number(form.longitude)};if(editing)await providerApi.updateAddress(editing.id,payload);else await providerApi.createAddress(payload);toast.success(editing?'Address updated':'Service address added');setEditing(null);setForm(blank);await load()}catch(err){setError(getApiErrorMessage(err,'Could not save this address.'))}finally{setSaving(false)}}
  const edit=(item)=>{setEditing(item);setForm({...blank,...item})}
  const remove=async(id)=>{if(!window.confirm('Delete this service address?'))return;try{await providerApi.deleteAddress(id);toast.success('Address deleted');load()}catch(err){toast.error(getApiErrorMessage(err))}}
  return <div className="mx-auto max-w-6xl"><p className="eyebrow">SERVICE AREAS</p><h1 className="mt-2 display-title">Your addresses</h1><p className="mt-3 text-msp-secondary">Your primary address supplies the city shown in public provider search.</p>{error&&<div className="mt-6"><ApiState message={error} onRetry={load}/></div>}
    <div className="mt-7 grid gap-6 lg:grid-cols-[390px_1fr]"><form onSubmit={submit} className="card h-fit grid gap-4 p-6"><h2 className="font-display text-2xl font-bold text-msp-primary">{editing?'Edit address':'Add an address'}</h2>
      {[['addressLine','Address line','text'],['city','City','text'],['state','State','text'],['pincode','Pincode','text'],['latitude','Latitude','number'],['longitude','Longitude','number']].map(([name,label,type])=><label key={name} className="text-sm font-semibold text-msp-primary">{label}<input required name={name} type={type} step={type==='number'?'any':undefined} value={form[name]} onChange={update} className="field mt-2"/></label>)}
      <label className="flex items-center gap-3 text-sm font-semibold text-msp-primary"><input name="primaryAddress" type="checkbox" checked={Boolean(form.primaryAddress)} onChange={update} className="h-4 w-4"/>Use as primary address</label>
      <button disabled={saving} className="btn-primary"><Plus size={18} className="mr-2"/>{saving?'Saving...':editing?'Update address':'Add address'}</button>{editing&&<button type="button" className="btn-secondary" onClick={()=>{setEditing(null);setForm(blank)}}>Cancel</button>}
    </form><div>{loading&&<p className="text-msp-secondary">Loading addresses...</p>}{!loading&&!error&&items.length===0&&<EmptyState title="No service addresses" message="Add an address so customers can find you by city."/>}<div className="space-y-4">{items.map(item=><article key={item.id} className="card p-5"><div className="flex justify-between gap-4"><div className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-msp-softGreen text-msp-primary"><MapPin size={21}/></span><div><h2 className="font-bold text-msp-primary">{item.addressLine}</h2><p className="mt-1 text-sm text-msp-secondary">{item.city}, {item.state} — {item.pincode}</p>{item.primaryAddress&&<span className="mt-2 inline-block rounded-full bg-msp-softWarm px-3 py-1 text-xs font-bold text-msp-accent">PRIMARY</span>}</div></div><div className="flex gap-2"><button onClick={()=>edit(item)} className="h-fit rounded-lg border border-msp-border p-2 text-msp-primary"><Pencil size={17}/></button><button onClick={()=>remove(item.id)} className="h-fit rounded-lg border border-red-200 p-2 text-red-600"><Trash2 size={17}/></button></div></div></article>)}</div></div></div>
  </div>
}
