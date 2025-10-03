import ConversationsPage from "@/components/professor/conversations";

export default function ChatBotPage() {
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4">Chat Bot</h1>
      <p>Welcome to the Chat Bot page. Here you can interact with the AI-powered chat bot to assist you with your queries and tasks.</p>
      <ConversationsPage/>
    </div>
  );
}