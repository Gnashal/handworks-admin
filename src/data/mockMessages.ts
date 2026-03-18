export interface IMessage {
  id: string;
  name: string;
  message: string;
  date: string;
  unread?: boolean;
  createdAt?: string;

  media?: {
    type: "image" | "video";
    url: string;
  };
}

export const mockMessages: IMessage[] = [
  {
    id: "msg_001",
    name: "John Doe",
    message: "Hello, I would like to ask about your cleaning services.",
    date: "2:30 PM",
    unread: true,
    createdAt: new Date().toISOString(),
    media: {
      type: "image",
      url: "https://via.placeholder.com/150",
    },
  },
  {
    id: "msg_002",
    name: "Jane Doe",
    message: "Can I schedule a general cleaning tomorrow?",
    date: "1:15 PM",
    unread: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "msg_003",
    name: "Robert Tan",
    message: "Thank you for the excellent service!",
    date: "Yesterday",
    unread: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];