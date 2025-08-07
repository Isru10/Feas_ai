import ContactPage from '@/components/Contactpage'
import GeminiTest from '@/components/GeminiTest'
import HomePage from '@/components/Homepage'
import ServicesPage from '@/components/Servicespage'
import React from 'react'

const page = () => {
  return (
    <div>
      
      <HomePage/>
      <ServicesPage/>
      <ContactPage/>
      <GeminiTest/>
    </div>
  )
}

export default page