'use client';
import { ChatInterfaceChats } from '@/components/chat-interface-chats';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; 
import { api2 } from '@/lib/api';

export default function Page() {
    const params = useParams();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        console.log('Page params:', params.id);
        fetchMessages();
        console.log(messages);
    }, []);



    const fetchMessages = async () => {
        try {
            const response = await api2.get(`/api/conversations/${params.id}/messages`);
            setMessages(response.data.content);
        } catch (error) {
            console.error('Error fetching messages:', error);
            return [];
        }
    }

    return (
        <>
            <ChatInterfaceChats messages={messages} id={params.id} />
        </>
    );
}