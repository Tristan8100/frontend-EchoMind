'use client';

import { useEffect, useState } from "react";
import { api2 } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image  from "next/image";

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

  useEffect(() => {
    const fetchProfessor = async () => {
      try {
        setLoading(true);
        const res = await api2.get("/api/professor-settings");
        setProfessor(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessor();
  }, []);

  // Update info
  const handleUpdateInfo = async () => {
    if (!professor) return;
    try {
      setUpdating(true);
      await api2.patch("/api/professor-name", { name });
      await api2.patch("/api/professor-email", { email });
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    if (!professor) return;
    try {
      setUpdating(true);
      await api2.patch("/api/professor-password", {
        old_password: password,
        password: newPassword,
        password_confirmation: passwordConfirm,
      });
      alert("Password updated successfully!");
      setPassword("");
      setNewPassword("");
      setPasswordConfirm("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Password update failed");
    } finally {
      setUpdating(false);
    }
  };

  // Update photo
  const handleUpdatePhoto = async () => {
    if (!photo) return;
    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append("image", photo);
      const res = await api2.post("/api/professor-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Photo updated successfully!");
      setProfessor((prev) => prev ? { ...prev, image: res.data.image } : prev);
      setPhoto(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Photo update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Profile</h1>

      {/* Profile Photo */}
      <div className="flex items-center gap-4">
        {professor?.image && (
          <img
            src={`${api2.defaults.baseURL}${professor.image}`}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
        )}
        <input type="file" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
        <Button onClick={handleUpdatePhoto} disabled={!photo || updating}>
          Update Photo
        </Button>
      </div>

      {/* Name & Email */}
      <div className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <Button onClick={handleUpdateInfo} disabled={updating}>
          Update Info
        </Button>
      </div>

      {/* Password */}
      <div className="space-y-4">
        <div>
          <Label>Old Password</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <Label>New Password</Label>
          <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <div>
          <Label>Confirm New Password</Label>
          <Input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
        </div>
        <Button onClick={handleUpdatePassword} disabled={updating}>
          Update Password
        </Button>
      </div>
    </div>
  );
}
