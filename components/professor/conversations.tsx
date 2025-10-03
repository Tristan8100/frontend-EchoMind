"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api2 } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Conversation {
  id: number;
  title: string;
  messages?: { message: string }[];
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  // fetch conversations
  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await api2.get("/api/conversations");
      setConversations(res.data.content || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // add new conversation
  const addConversation = async () => {
    const res = await api2.post("/api/conversations");
    await fetchConversations();
  };

  // update conversation
  const updateConversation = async (id: number) => {
    await api2.put(`/api/conversations/${id}`, { title: editTitle });
    setEditingId(null);
    await fetchConversations();
  };

  // delete conversation
  const deleteConversation = async (id: number) => {
    await api2.delete(`/api/conversations/${id}`);
    await fetchConversations();
  };

  return (
    <div className="w-64 border-r h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <h2 className="font-semibold">Conversations</h2>
        <Button size="sm" onClick={addConversation}>
          <Plus className="w-4 h-4 mr-1" /> New
        </Button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading && <p className="p-3 text-sm text-muted-foreground">Loading...</p>}
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className="flex items-center justify-between px-3 py-2 hover:bg-accent/50 group"
          >
            {/* Link to conversation page */}
            <Link href={`/professor/conversations/${conv.id}`} className="flex-1 truncate">
              {conv.title}
            </Link>

            {/* Actions */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
              {/* Edit dialog */}
              <Dialog
                open={editingId === conv.id}
                onOpenChange={(open) => {
                  if (!open) setEditingId(null);
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditingId(conv.id);
                      setEditTitle(conv.title || "");
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Conversation</DialogTitle>
                  </DialogHeader>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Conversation title"
                  />
                  <Button className="mt-2" onClick={() => updateConversation(conv.id)}>
                    Save
                  </Button>
                </DialogContent>
              </Dialog>

              {/* Delete alert dialog */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Delete conversation “{conv.title}”?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <div className="flex justify-end gap-2 mt-4">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => deleteConversation(conv.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
