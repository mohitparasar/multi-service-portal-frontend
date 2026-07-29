export default function EmptyState({ title, message, action }) {
  return <div className="rounded-2xl border border-dashed border-msp-border bg-white p-10 text-center shadow-sm">
    <h3 className="font-display text-2xl font-bold text-msp-primary">{title}</h3>
    <p className="mx-auto mt-2 max-w-lg text-msp-secondary">{message}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
}
