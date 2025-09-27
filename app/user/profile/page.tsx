'use client';

import { useEffect, useState } from "react";
import { api2 } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Student {
  id: number;
  name: string;
  email: string;
}

export default function StudentProfilePage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const res = await api2.get("/api/student-settings");
        setStudent(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  // Update name
  const handleUpdateName = async () => {
    if (!student) return;
    try {
      setUpdating(true);
      await api2.patch("/api/student-name", { name });
      alert("Name updated successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    if (!student) return;
    try {
      setUpdating(true);
      await api2.patch("/api/student-password", {
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

  if (loading) return <p>Loading student profile...</p>;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Student Profile</h1>

      {/* Name & Email */}
      <div className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Email</Label>
          <Input value={email} readOnly className="bg-gray-100 cursor-not-allowed" />
        </div>
        <Button onClick={handleUpdateName} disabled={updating}>
          Update Name
        </Button>
      </div>

      {/* Password */}
      <div className="space-y-4">
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
          Update Password
        </Button>
      </div>
    </div>
  );
}
