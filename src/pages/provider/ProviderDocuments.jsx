import { ExternalLink, FileCheck2, Trash2, Upload } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { providerApi } from '../../api/providerApi'
import ApiState from '../../components/common/ApiState'
import EmptyState from '../../components/common/EmptyState'
import { getApiErrorMessage } from '../../utils/apiError'

const documentTypes = ['AADHAR', 'PAN', 'LICENSE', 'CERTIFICATE']

export default function ProviderDocuments() {
  const [items,setItems]=useState([]);const [documentType,setDocumentType]=useState('AADHAR');const [file,setFile]=useState(null);const [loading,setLoading]=useState(true);const [saving,setSaving]=useState(false);const [error,setError]=useState('')
  const load=useCallback(async()=>{setLoading(true);setError('');try{const {data}=await providerApi.getDocuments();setItems(Array.isArray(data)?data:[])}catch(err){setError(getApiErrorMessage(err,'Unable to load verification documents. Create your provider profile first.'))}finally{setLoading(false)}},[])
  useEffect(()=>{load()},[load])
  const submit=async(event)=>{event.preventDefault();if(!file)return;setSaving(true);setError('');try{await providerApi.uploadDocument(documentType,file);toast.success('Document uploaded for verification');event.target.reset();setFile(null);setDocumentType('AADHAR');await load()}catch(err){setError(getApiErrorMessage(err,'Document upload failed.'))}finally{setSaving(false)}}
  const remove=async(id)=>{if(!window.confirm('Delete this document?'))return;try{await providerApi.deleteDocument(id);toast.success('Document deleted');load()}catch(err){toast.error(getApiErrorMessage(err))}}
  return <div className="mx-auto max-w-6xl"><p className="eyebrow">VERIFICATION</p><h1 className="mt-2 display-title">Provider documents</h1><p className="mt-3 text-msp-secondary">Upload identity or professional documents. Admin verification status appears here.</p>{error&&<div className="mt-6"><ApiState message={error} onRetry={load}/></div>}
    <form onSubmit={submit} className="card mt-7 grid items-end gap-4 p-6 md:grid-cols-[220px_1fr_auto]"><label className="text-sm font-semibold text-msp-primary">Document type<select value={documentType} onChange={(e)=>setDocumentType(e.target.value)} className="field mt-2">{documentTypes.map(type=><option key={type}>{type}</option>)}</select></label><label className="text-sm font-semibold text-msp-primary">Choose file<input required type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e)=>setFile(e.target.files?.[0]||null)} className="field mt-2"/></label><button disabled={saving||!file} className="btn-primary disabled:opacity-60"><Upload size={18} className="mr-2"/>{saving?'Uploading...':'Upload'}</button></form>
    {loading&&<p className="mt-6 text-msp-secondary">Loading documents...</p>}{!loading&&!error&&items.length===0&&<div className="mt-6"><EmptyState title="No documents uploaded" message="Upload a document to begin provider verification."/></div>}
    <div className="mt-6 grid gap-4 md:grid-cols-2">{items.map(item=><article key={item.id} className="card p-5"><div className="flex justify-between gap-3"><div className="flex gap-4"><span className="grid h-12 w-12 place-items-center rounded-xl bg-msp-softGreen text-msp-primary"><FileCheck2 size={23}/></span><div><h2 className="font-display text-xl font-bold text-msp-primary">{item.documentType}</h2><p className="mt-1 text-sm font-bold text-msp-accent">{item.verificationStatus}</p></div></div><button onClick={()=>remove(item.id)} className="h-fit rounded-lg border border-red-200 p-2 text-red-600"><Trash2 size={17}/></button></div>{item.remarks&&<p className="mt-4 rounded-lg bg-msp-softWarm p-3 text-sm text-msp-secondary">{item.remarks}</p>}{item.documentUrl&&<a href={item.documentUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-msp-accent">View document <ExternalLink size={15}/></a>}</article>)}</div>
  </div>
}
