"use client";

import MessagesInbox from "@/components/messages/messagesInbox";

export default function MessagesPage() {

  return (
    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-2xl font-semibold">Messages</h1>
        <p className="text-sm text-muted-foreground">
          Manage customer conversations
        </p>
      </div>

      <MessagesInbox />

    </div>

  );
}