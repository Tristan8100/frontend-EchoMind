'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { api2 } from "@/lib/api";
import { toast } from "sonner";

interface EnrollDialogProps {
  onSuccess?: () => void;
}

export function EnrollDialog({ onSuccess }: EnrollDialogProps) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    if (!code.trim()) {
      toast.error("Please enter a classroom code.");
      return;
    }

    try {
      setLoading(true);
      const res = await api2.post("/api/classrooms-self-enroll", { code });
      toast.success(res.data.message);

      // Call
      if (onSuccess) onSuccess();

      setOpen(false);
      setCode("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to enroll.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          Enroll in Classroom
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Enroll in a Classroom</DialogTitle>
          <DialogDescription>
            Enter the classroom code provided by your professor.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Classroom Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={loading}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleEnroll} disabled={loading}>
            {loading ? "Enrolling..." : "Enroll"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
