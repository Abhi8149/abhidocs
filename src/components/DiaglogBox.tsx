'use client'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"


interface DiaglogDemo{
  onFlagChange:(name:string)=>void
}
export function  DialogDemo({onFlagChange}:DiaglogDemo) {
 const [docName, setdocName] = useState('');
 const handleSubmit=async()=>{
     onFlagChange(docName)
 }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <Image  className="h-full w-full cursor-pointer" src="/Create-New-Image.png" alt="Create New Document"  width={200} height={200}/> */}
        <img className="cursor-pointer" src="/Create-New-Image.png" alt="create-image-doc" height={200} width={200} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New document</DialogTitle>
          <DialogDescription>
            Click create when you are done
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={docName} className="col-span-3" onChange={(e)=>setdocName(e.target.value)}/>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} type="submit">create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
