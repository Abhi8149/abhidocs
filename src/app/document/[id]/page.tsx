"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import Quill, { Delta } from 'quill'
import 'quill/dist/quill.snow.css'
import { useParams, useRouter } from 'next/navigation'
import { TOOLBAR_OPTIONS } from '../../../../helper/Toolbar'
import { FiArrowLeft, FiClock, FiShare2, FiCheck, FiCopy } from 'react-icons/fi'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

const Page = () => {
    const [socket, setSocket] = useState<Socket>()
    const [quill, setQuill] = useState<Quill>()
    const [lastSaved, setLastSaved] = useState<Date>()
    const [copied, setCopied] = useState(false)
    const params = useParams()
    const router = useRouter()
    const documentId = params.id
    const documentName=localStorage.getItem(`document-name-for-${documentId}}`)|| 'Untitled';
    useEffect(() => {
      
        const skt=io(`http://localhost:3000`);
        setSocket(skt);
        console.log('socket connected')
      return () => {
        skt.disconnect();
      }
    }, [])

    const wrapperRef=useCallback((wrapper:HTMLDivElement)=>{
            if(!wrapper) return;
            wrapper.innerHTML='';

            const editor=document.createElement("div");
            wrapper.append(editor);

            const qul=new Quill(editor,{
                theme:"snow",
                modules:{
                    toolbar:TOOLBAR_OPTIONS
                }
            });
            qul.disable();
            // qul.setText("Loading...");
            setQuill(qul);
    },[]);

   useEffect(() => {
     if(!socket || !quill) return;

    interface Delta {
      ops: Array<{
        insert?: string;
        delete?: number;
        retain?: number;
        attributes?: object;
      }>;
    }
    const handler = (delta: Delta, oldDelta: Delta, source: string) => {
      if(source !== 'user') return;
      socket.emit("send-changes", delta);
    };

     quill.on("text-change", handler);

     
     return () => {
       quill.off("text-change", handler)
     }
   }, [socket,quill])
   
   useEffect(() => {
     if(!socket || !quill) return;

     const handler=(delta:Delta)=>{
        quill.updateContents(delta);
     }

     socket.on("receive-changes", handler);
   
     return () => {
       socket.off("receive-changes", handler);
     }
   }, [socket,quill])
   
    useEffect(() => {
      if(!socket || !quill){
        return;
      }

      socket.once("load-document", document=>{
        quill.setContents(document);
        quill.enable();
        console.log("Document loaded and editor enabled");
      })
      const documentName=localStorage.getItem(`document-name-for-${documentId}}`)|| 'Untitled';
      socket.emit("get-document", {documentId, documentName})
    }, [socket,quill,documentId])

    useEffect(() => {
       if(!socket || !quill) return;

       const interval=setInterval(()=>{
        socket.emit("save-document", quill.getContents());
       }, 10000)
    
      return () => {
        clearInterval(interval);
        localStorage.clear();
      }
    }, [socket,quill])

    const handleCopyLink = () => {
        const link = `${window.location.origin}/document/${documentId}`
        navigator.clipboard.writeText(link)
        setCopied(true)
        toast.success('Link copied to clipboard!')
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="p-2.5 rounded-full hover:bg-gray-100 transition-all duration-200"
                            >
                                <FiArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h1 className="text-xl font-semibold text-gray-900">
                                {documentName || 'Untitled'}
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            {lastSaved && (
                                <div className="flex items-center text-sm text-gray-500">
                                    <FiClock className="w-4 h-4 mr-2" />
                                    <span>
                                        Saved {lastSaved.toLocaleTimeString()}
                                    </span>
                                </div>
                            )}

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="flex items-center space-x-2">
                                        <FiShare2 className="w-4 h-4" />
                                        <span>Share</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Share document</DialogTitle>
                                    </DialogHeader>
                                    <div className="flex items-center space-x-2 p-4">
                                        <Input
                                            readOnly
                                            value={`${window.location.origin}/document/${documentId}`}
                                            className="flex-1"
                                        />
                                        <Button
                                            onClick={handleCopyLink}
                                            className="flex items-center space-x-2"
                                        >
                                            {copied ? (
                                                <FiCheck className="w-4 h-4" />
                                            ) : (
                                                <FiCopy className="w-4 h-4" />
                                            )}
                                            <span>{copied ? 'Copied!' : 'Copy'}</span>
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div 
                    ref={wrapperRef}
                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100
                        [&_.ql-toolbar.ql-snow]:border-0 [&_.ql-toolbar.ql-snow]:border-b [&_.ql-toolbar.ql-snow]:border-gray-200 
                        [&_.ql-toolbar.ql-snow]:bg-gray-50 [&_.ql-toolbar.ql-snow]:px-6 [&_.ql-toolbar.ql-snow]:py-3
                        [&_.ql-container.ql-snow]:border-0 [&_.ql-container.ql-snow]:font-sans
                        [&_.ql-editor]:p-6 [&_.ql-editor]:min-h-[calc(100vh-16rem)]
                        [&_.ql-editor_p]:leading-relaxed [&_.ql-editor_p]:text-gray-800
                        [&_.ql-toolbar_button]:rounded [&_.ql-toolbar_button]:hover:bg-gray-200 
                        [&_.ql-toolbar_button]:transition-colors [&_.ql-toolbar_button]:p-1.5
                        [&_.ql-formats]:mr-4
                        [&_.ql-tooltip]:shadow-lg [&_.ql-tooltip]:border-gray-200"
                />
            </div>
        </div>
    )
}

export default Page