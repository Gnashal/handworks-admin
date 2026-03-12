"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { mockMessages, IMessage } from "@/data/mockMessages";

interface MessagesContextType {
  messages: IMessage[];
  unreadCount: number;
  selectMessage: (id: string) => void;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<IMessage[]>(mockMessages);

  const selectMessage = (id: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, unread: false } : msg
      )
    );
  };

  const unreadCount = messages.filter((m) => m.unread).length;

  return (
    <MessagesContext.Provider
      value={{
        messages,
        unreadCount,
        selectMessage,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);

  if (!context) {
    throw new Error("useMessages must be used within MessagesProvider");
  }

  return context;
}