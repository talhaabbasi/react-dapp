import { useState } from "react"
import "./App.css"
import { ethers } from "ethers"
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json"

const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

function App() {
  const [greeting, setGreetingValue] = useState("")

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" })
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      )
      try {
        const data = await contract.greet()
        console.log("data: ", data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }
  async function setGreeting() {
    if (!greeting) return
    if (typeof window.ethereum !== "undefined") {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      setGreetingValue("")
      await transaction.wait()
      fetchGreeting()
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <input
          onChange={(e) => setGreetingValue(e.target.value)}
          placeholder="Set greeting"
          value={greeting}
        />
        <button onClick={setGreeting}>Fetch Greeting</button>
      </header>
    </div>
  )
}

export default App
