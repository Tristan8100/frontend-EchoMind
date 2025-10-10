'use client';

import { useEffect, useState } from "react";
import { api2 } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { toast } from "sonner";

interface Professor {
  id: number;
  name: string;
  email: string;
  image?: string;
}

export default function ProfilePage() {
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfessor = async () => {
      try {
        const res = await api2.get("/api/professor-settings");
        setProfessor(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
      } catch {
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfessor();
  }, []);

  // Update name
  const handleUpdateInfo = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setUpdating(true);
    try {
      await api2.patch("/api/professor-name", { name });
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    if (!password || !newPassword || !passwordConfirm) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== passwordConfirm) {
      toast.error("Passwords do not match");
      return;
    }
    setUpdating(true);
    try {
      await api2.patch("/api/professor-password", {
        old_password: password,
        password: newPassword,
        password_confirmation: passwordConfirm,
      });
      toast.success("Password updated successfully!");
      setPassword("");
      setNewPassword("");
      setPasswordConfirm("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Password update failed");
    } finally {
      setUpdating(false);
    }
  };

  // Update photo
  const handleUpdatePhoto = async () => {
    if (!photo) {
      toast.error("Please select a photo first");
      return;
    }
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("image", photo);
      const res = await api2.post("/api/professor-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Photo updated successfully!");
      setProfessor((prev) => prev && { ...prev, image: res.data.image });
      setPhoto(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Photo update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>

      {/* Profile Photo Section */}
      <div className="border rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Profile Photo</h2>
        <div className="flex items-center gap-6">
          {photo ? (
            <Image
              src={URL.createObjectURL(photo)}
              alt="Preview"
              width={96}
              height={96}
              className="rounded-full w-24 h-24 object-cover border"
            />
          ) : professor?.image ? (
            <Image
              src={professor.image}
              alt="Profile"
              width={96}
              height={96}
              className="rounded-full w-24 h-24 object-cover border"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              N/A
            </div>
          )}
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            />
            <Button
              onClick={handleUpdatePhoto}
              disabled={!photo || updating}
              className="w-fit"
            >
              {updating ? "Updating..." : "Update Photo"}
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="border rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Basic Information</h2>
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            value={email}
            readOnly
            className="bg-gray-100 cursor-not-allowed"
          />
        </div>
        <Button onClick={handleUpdateInfo} disabled={updating}>
          {updating ? "Updating..." : "Update Info"}
        </Button>
      </div>

      {/* Password Section */}
      <div className="border rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Change Password</h2>
        <div>
          <Label>Old Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Label>New Password</Label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <Label>Confirm New Password</Label>
          <Input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </div>
        <Button onClick={handleUpdatePassword} disabled={updating}>
          {updating ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </div>
  );
}
