declare global {
  interface Window {
    context: {
      notify: (title: string, body: string) => void
     }
  }
}
