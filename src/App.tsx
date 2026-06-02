import { ColorPicker } from './components/ColorPicker'
import { useColorState } from './hooks/useColorState'
import { useUrlHashSync } from './hooks/useUrlHashSync'
import './App.css'

function App() {
  const { color, setColor, setChannel } = useColorState()
  useUrlHashSync(color, setColor)

  return (
    <main className="app">
      <ColorPicker
        color={color}
        onColorChange={setColor}
        onChannelChange={setChannel}
      />
    </main>
  )
}

export default App
