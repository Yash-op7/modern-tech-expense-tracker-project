
import { Button } from "@/components/ui/button"
import { useState } from "react"

function App() {
const [count, setCount] = useState(0);
  return (
    <>
    <div className="flex flex-col max-w-md m-auto gap-y-5">
      <Button onClick={() => setCount(count => count + 1)}>up</Button>
      <Button onClick={() => setCount(count => count - 1)}>down</Button>
      Count is {count}
    </div>
    </>
  )
}

export default App
