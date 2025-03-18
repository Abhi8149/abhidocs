'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

const VerifyPage = () => {
  const [verificationCode, setVerificationCode] = useState('')
  const params = useParams()
  const router = useRouter()
  const email = params.email as string

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/verify', {
        email: decodeURIComponent(email),
        verificationCode
      })

      if (response.data.success) {
        toast.success('Email verified successfully!')
        router.push('/login')
      } else {
        toast.error(response.data.message)
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Verification failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter the verification code sent to {decodeURIComponent(email)}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <Input
              type="text"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </div>

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Verify Email
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VerifyPage