"use client";

import React from "react";
import { Edit, Loader2, Camera, Check } from "lucide-react";
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
import { updateAuthorAction, uploadAvatarAction } from "./actions";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface EditUserModalProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    department?: string;
    title?: string;
    avatar_url?: string;
    active: boolean;
  };
}


export default function EditUserModal({ user }: EditUserModalProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = React.useState({
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department || "",
    title: user.title || "",
    avatar_url: user.avatar_url || "",
    active: user.active
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const success = await updateAuthorAction(user.id, formData);
      if (success) {
        setOpen(false);
        router.refresh();
      } else {
        alert("Failed to update user. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while updating the user.");
    } finally {
      setIsUpdating(false);
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
        alert("Failed to upload image. Make sure the 'avatars' storage bucket is created in Supabase.");
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
        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="Edit User">
          <Edit className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-playfair">Edit Reporter Profile</DialogTitle>
        </DialogHeader>
        
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
                    <span className="text-xl font-bold text-muted-foreground">
                      {formData.name[0]}
                    </span>
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
                placeholder="Reporter Name"
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
                placeholder="email@palawandaily.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.active ? "active" : "inactive"} 
                onValueChange={(val) => setFormData({...formData, active: val === "active"})}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
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
                placeholder="e.g. Senior Journalist"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input 
                id="department" 
                value={formData.department} 
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                placeholder="e.g. News, Digital"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input 
              id="avatar" 
              value={formData.avatar_url} 
              onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating} className="bg-red-600 hover:bg-red-700">
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
