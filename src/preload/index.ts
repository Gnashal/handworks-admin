import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('Context isolation must be enabled for security reasons.')
}
try {
  contextBridge.exposeInMainWorld('context', {
    // TODO: expose api's here
    notify: (title: string, body: string) => {
      ipcRenderer.send('show-notification', { title, body })
    }
  })
} catch (error) {
  console.error('Failed to expose APIs in preload script:', error)
  throw error
}
