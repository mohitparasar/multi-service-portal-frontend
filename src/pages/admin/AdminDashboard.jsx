import { FileClock, ShieldCheck, Users } from 'lucide-react'
import CustomerDashboard from "../customer/CustomerDashboard";
export default function AdminDashboard(){return <Dashboard title="Admin dashboard" subtitle="Review providers, documents and platform activity." cards={[[Users,'Pending providers','Review provider applications'],[FileClock,'Documents','Approve submitted documents'],[ShieldCheck,'Platform control','Manage trusted operations']]}/>}
