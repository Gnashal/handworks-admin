import { IMessage } from "@/data/mockMessages";

export function groupMessagesByDate(messages: IMessage[]) {
  const today: IMessage[] = [];
  const yesterday: IMessage[] = [];
  const older: IMessage[] = [];

  const now = new Date();

  messages.forEach((msg) => {
    if (!msg.createdAt) return;

    const date = new Date(msg.createdAt);

    const diff = now.getTime() - date.getTime();
    const days = diff / (1000 * 60 * 60 * 24);

    if (days < 1) {
      today.push(msg);
    } else if (days < 2) {
      yesterday.push(msg);
    } else {
      older.push(msg);
    }
  });

  return {
    today,
    yesterday,
    older,
  };
}