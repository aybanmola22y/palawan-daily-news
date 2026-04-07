"use client";

import React from "react";
import { PlusCircle, Loader2, Camera, Check, UserPlus } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { inviteUserAction, uploadAvatarAction } from "./actions";
import { useRouter } from "next/navigation";
import Image from "next/image";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=User&background=random";

export default function InviteUserModal() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    role: "writer",
    department: "",
    title: "",
    avatar_url: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await inviteUserAction(formData);
      if (result.success) {
        setOpen(false);
        setFormData({
            name: "",
            email: "",
            password: "",
            role: "writer",
            department: "",
            title: "",
            avatar_url: ""
        });
        router.refresh();
      } else {
        setError(result.error || "Failed to create user.");
      }
    } catch (err: any) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const publicUrl = await uploadAvatarAction(uploadData);
      if (publicUrl) {
        setFormData({ ...formData, avatar_url: publicUrl });
      } else {
        alert("Failed to upload image.");
      }
    } catch (error) {
      alert("Error uploading image.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm">
          <UserPlus className="h-4 w-4" />
          Invite User
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-playfair flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-red-600" />
            Invite New Team Member
          </DialogTitle>
        </DialogHeader>
        
        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 animate-pulse">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Avatar Section */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold text-gray-700">Profile Picture</Label>
            <div className="flex flex-wrap gap-3 items-center">
              {/* Current Preview */}
              <div className="relative h-16 w-16 rounded-2xl overflow-hidden border-2 border-red-100 shadow-sm bg-gray-50 flex-shrink-0">
                {formData.avatar_url ? (
                  <Image src={formData.avatar_url} alt="Avatar" fill className="object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-muted">
                    <UserPlus className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* Custom Upload */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-10 w-10 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-red-400 hover:text-red-500 transition-all bg-gray-50"
                title="Upload Photo"
              >
                <Camera className="h-5 w-5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept="image/*" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Juan Dela Cruz"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email"
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="juan@palawandailynews.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Initial Password</Label>
              <Input 
                id="password" 
                type="password"
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={(val) => setFormData({...formData, role: val})}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="writer">Writer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Senior Staff Writer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input 
                id="department" 
                value={formData.department} 
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                placeholder="e.g. Editorial, Digital"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : "Create & Invite User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
