type Message = {
createdAt: string | Date
[key: string]: unknown
}

export function groupMessagesByDate(messages: Message[]) {
const today: Message[] = []
const yesterday: Message[] = []
const older: Message[] = []

const now = new Date()

messages.forEach((msg) => {
const date = new Date(msg.createdAt)

```
const diff = now.getTime() - date.getTime()
const days = diff / (1000 * 60 * 60 * 24)

if (days < 1) {
  today.push(msg)
} else if (days < 2) {
  yesterday.push(msg)
} else {
  older.push(msg)
}
```

})

return {
today,
yesterday,
older
}
}
