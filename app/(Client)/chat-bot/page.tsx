import { Suspense } from 'react';
import ChatbotClient from './_components/ChatbotClient';

export default function ChatbotPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatbotClient />
    </Suspense>
  );
}
