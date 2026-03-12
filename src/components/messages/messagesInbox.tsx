"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { groupMessagesByDate } from "@/utils/groupMessagesByDate";

import { useMessages } from "@/context/messagesContext";
import { IMessage } from "@/data/mockMessages";

export default function MessagesInbox() {
  const { messages, selectMessage } = useMessages();

  const [selected, setSelected] = useState<IMessage | null>(null);
  const [search, setSearch] = useState("");

  const filtered = messages.filter((msg) =>
    msg.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleClick = (msg: IMessage) => {
    setSelected(msg);
    selectMessage(msg.id);
  };

  const { today, yesterday, older } = groupMessagesByDate(filtered);

  return (
    <div className="flex gap-6 h-[calc(100vh-180px)]">

      {/* LEFT PANEL (Inbox) */}
      <Card className="w-[360px] flex flex-col overflow-hidden">

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto">

          {/* TODAY */}
          {today.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground">
                Today
              </div>

              {today.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleClick(msg)}
                  className={`cursor-pointer border-b px-4 py-3 hover:bg-muted transition
                  ${selected?.id === msg.id ? "bg-muted" : ""}`}
                >
                  <div className="flex items-center gap-3">

                    <Avatar>
                      <AvatarFallback>
                        {msg.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">

                      <div className="flex justify-between items-center">
                        <p className="font-medium text-sm">{msg.name}</p>

                        <span className="text-xs text-muted-foreground">
                          {msg.date}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground truncate">
                        {msg.message}
                      </p>

                    </div>

                    {msg.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"/>
                    )}

                  </div>
                </div>
              ))}
            </>
          )}

          {/* YESTERDAY */}
          {yesterday.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground">
                Yesterday
              </div>

              {yesterday.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleClick(msg)}
                  className={`cursor-pointer border-b px-4 py-3 hover:bg-muted transition
                  ${selected?.id === msg.id ? "bg-muted" : ""}`}
                >
                  <div className="flex items-center gap-3">

                    <Avatar>
                      <AvatarFallback>
                        {msg.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">

                      <div className="flex justify-between items-center">
                        <p className="font-medium text-sm">{msg.name}</p>

                        <span className="text-xs text-muted-foreground">
                          {msg.date}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground truncate">
                        {msg.message}
                      </p>

                    </div>

                    {msg.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"/>
                    )}

                  </div>
                </div>
              ))}
            </>
          )}

          {/* OLDER */}
          {older.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground">
                Older
              </div>

              {older.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleClick(msg)}
                  className={`cursor-pointer border-b px-4 py-3 hover:bg-muted transition
                  ${selected?.id === msg.id ? "bg-muted" : ""}`}
                >
                  <div className="flex items-center gap-3">

                    <Avatar>
                      <AvatarFallback>
                        {msg.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">

                      <div className="flex justify-between items-center">
                        <p className="font-medium text-sm">{msg.name}</p>

                        <span className="text-xs text-muted-foreground">
                          {msg.date}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground truncate">
                        {msg.message}
                      </p>

                    </div>

                    {msg.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"/>
                    )}

                  </div>
                </div>
              ))}
            </>
          )}

        </div>
      </Card>

      {/* MIDDLE PANEL (Conversation) */}
      <Card className="flex-1 flex flex-col overflow-hidden">

        {selected ? (
          <>
            <div className="border-b p-6 flex items-center justify-between">

              <div>
                <h2 className="text-lg font-semibold">{selected.name}</h2>
                <p className="text-xs text-muted-foreground">
                  Customer conversation
                </p>
              </div>

              <Badge variant="secondary">
                Open
              </Badge>

            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">

              {/* CLIENT MESSAGE */}
              <div className="flex justify-start">

                <div className="space-y-2 max-w-[70%]">

                  {selected.media?.type === "image" && (
                    <img
                      src={selected.media.url}
                      className="rounded-lg max-h-[220px] object-cover"
                    />
                  )}

                  {selected.media?.type === "video" && (
                    <video
                      controls
                      className="rounded-lg max-h-[220px]"
                    >
                      <source src={selected.media.url}/>
                    </video>
                  )}

                  <div className="bg-muted px-4 py-2 rounded-lg text-sm">
                    {selected.message}
                  </div>

                </div>

              </div>

              {/* ADMIN REPLY */}
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm max-w-[70%]">
                  Thanks for contacting Handworks!
                </div>
              </div>

            </div>

            {/* REPLY AREA */}
            <div className="border-t p-4 flex gap-3">

              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                id="mediaUpload"
              />

              <label
                htmlFor="mediaUpload"
                className="cursor-pointer text-sm px-3 py-2 border rounded-md hover:bg-muted"
              >
                📎
              </label>

              <Input placeholder="Type a reply..." />

            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">

            <div className="text-lg font-medium">
              No conversation selected
            </div>

            <p className="text-sm">
              Select a message from the inbox to start viewing the conversation.
            </p>

          </div>
        )}

      </Card>

      {/* RIGHT PANEL (Customer Info) */}
      <Card className="w-[300px] flex flex-col overflow-hidden">

        {selected ? (
          <div className="p-6 space-y-6">

            <div className="flex items-center gap-4">

              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {selected.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="font-semibold">{selected.name}</p>

                <Link
                  href="/clients"
                  className="text-xs text-blue-500 hover:underline"
                >
                  View client profile
                </Link>
              </div>

            </div>

            <div className="space-y-4 text-sm">

              <div>
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground">
                  {selected.name.toLowerCase().replace(" ", ".")}@email.com
                </p>
              </div>

              <div>
                <p className="font-medium">Phone</p>
                <p className="text-muted-foreground">
                  +63 912 345 6789
                </p>
              </div>

            </div>

            <div className="space-y-3">

              <p className="font-medium text-sm">
                Previous Bookings
              </p>

              <div className="text-xs text-muted-foreground space-y-2">

                <div className="border rounded-md p-2">
                  Deep Cleaning — Feb 20 2026
                </div>

                <div className="border rounded-md p-2">
                  Sofa Cleaning — Jan 10 2026
                </div>

                <div className="border rounded-md p-2">
                  General Cleaning — Dec 12 2025
                </div>

              </div>

            </div>

          </div>
        ) : (

          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2 p-6">

            <div className="font-medium">
              No customer selected
            </div>

            <p className="text-center">
              Select a conversation to view customer information.
            </p>

          </div>

        )}

      </Card>

    </div>
  );
}