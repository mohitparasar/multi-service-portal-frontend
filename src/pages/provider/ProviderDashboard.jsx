import { BriefcaseBusiness, FileCheck2, Wrench } from 'lucide-react'
import { Dashboard } from '../customer/CustomerDashboard'
export default function ProviderDashboard(){return <Dashboard title="Provider dashboard" subtitle="Complete onboarding and manage service requests." cards={[[BriefcaseBusiness,'Profile','Manage professional details'],[Wrench,'Skills','Set services and pricing'],[FileCheck2,'Documents','Track verification status']]}/>}
