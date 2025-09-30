export default function App() {
  const handleNotify = () => {
    window.context.notify('Handworks Admin', 'This is a test notification 🎉')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Handworks Admin</h1>
      <button
        onClick={handleNotify}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Show Test Notification
      </button>
    </div>
  )
}