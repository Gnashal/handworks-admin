export function groupMessagesByDate(messages: any[]) {
  const today: any[] = []
  const yesterday: any[] = []
  const older: any[] = []

  const now = new Date()

  messages.forEach((msg) => {
    const date = new Date(msg.createdAt)

    const diff = now.getTime() - date.getTime()
    const days = diff / (1000 * 60 * 60 * 24)

    if (days < 1) {
      today.push(msg)
    } else if (days < 2) {
      yesterday.push(msg)
    } else {
      older.push(msg)
    }
  })

  return {
    today,
    yesterday,
    older
  }
}