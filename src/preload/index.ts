import { contextBridge } from 'electron'

if (!process.contextIsolated) {
  throw new Error('Context isolation must be enabled for security reasons.')
}
try {
  contextBridge.exposeInMainWorld('context', {
    // TODO: expose api's here
  })
} catch (error) {
  console.error('Failed to expose APIs in preload script:', error)
  throw error
}
