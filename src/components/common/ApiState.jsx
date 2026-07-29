import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ApiState({ title = 'We are working to resolve this issue', message, onRetry }) {
  return <div className="rounded-2xl border border-msp-accent/25 bg-msp-softWarm p-6 text-center">
    <AlertTriangle className="mx-auto text-msp-accent" size={30}/>
    <h3 className="mt-3 font-display text-xl font-bold text-msp-primary">{title}</h3>
    <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-msp-secondary">{message || 'The service is temporarily unavailable. Your data is safe; please retry in a moment.'}</p>
    {onRetry && <button onClick={onRetry} className="btn-secondary mt-4"><RefreshCw size={16} className="mr-2"/>Retry</button>}
  </div>
}
