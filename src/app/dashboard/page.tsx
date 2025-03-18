'use client'
import React, { useEffect, useState } from 'react'
import DocCard from '@/components/DocCard'
import axios from 'axios'
import { toast } from 'sonner';
import { DialogDemo } from '@/components/DiaglogBox';
import { useRouter } from 'next/navigation';

interface Docs {
  _id: string;
  name: string;
  data: Object;
  time: Date;
}

const Page = () => {
  const [documents, setDocuments] = useState<Docs[]>([])
  const [flag, setFlag] = useState<Boolean>(false)
  const [docName, setDocName] = useState('');
  const router = useRouter();

  const handleFlagChange = (name: string) => {
    setFlag(true)
    setDocName(name)
  }

  useEffect(() => {
    if (flag === true) {
      const handleSubmit = async () => {
        try {
          const response = await axios.post('/api/setName', { docName });
          if (response.data.success) {
            console.log('Name updated successfully');
            const id = response.data.message;
            localStorage.setItem(`document-name-for-${id}`, docName)
            router.push(`/document/${id}`);
          } else {
            toast.error(response.data.message);
          }
        } catch (error: any) {
          console.log(error);
          toast.error(error.message);
        }
      };
      handleSubmit();
    }
  }, [flag, docName, router]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get('/api/getdocuments');
        console.log(response)
        if (response.data.success) {
          const dummydoc = response.data.message
          console.log(dummydoc)
          dummydoc.sort((a: Docs, b: Docs) => new Date(b.time).getTime() - new Date(a.time).getTime())
          setDocuments(dummydoc)
        } else {
          toast.error(response.data.message)
        }
      } catch (error: any) {
        console.log(error.message)
        toast.error(error.message)
      }
    };
    fetchDocuments();
  }, [])

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to Your Documents</h1>
        <p className="text-gray-600">Create, view, and manage your documents easily</p>
      </div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <DialogDemo onFlagChange={handleFlagChange} />
          <p className="ml-4 mt-2 font-semibold text-blue-600">Start a new document</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {documents.length > 0 && documents.map((item) => (
          <div key={item._id} onClick={() => router.push(`/document/${item._id}`)} className="cursor-pointer">
            <DocCard name={item.name} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page