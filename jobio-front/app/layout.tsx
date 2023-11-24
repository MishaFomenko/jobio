import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css'
import type { Metadata } from 'next'
import ClientRootLayout from './layout-client';


export const metadata: Metadata = {
  title: 'Jobio',
  description: 'Web app for jonior web developers who are looking for their first job',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientRootLayout>
      {children}
    </ClientRootLayout>
  )
}
