import React, { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {

  const [loading, setLoading] = useState(false)
  const [loadingPage, setLoadingPage] = useState(false)
  const [messages, setMessages] = useState([])
  const [name, setName] = useState('')

  useEffect(() => {
    const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    setMessages(messages)
  }, [])

  async function handleSubmit(event) {
    event.preventDefault();

    setLoadingPage(true)

    await axios.post("http://localhost:8000", {topic:'Criação', username: name}).then(resp => {
      const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
      messages.push(resp.data)
      setLoadingPage(false)
      localStorage.setItem('username', JSON.stringify(name))
      localStorage.setItem('chatMessages', JSON.stringify(messages))
      setMessages(messages)
    }).catch(resp => {
        setLoading(false)
    })
  }

  async function handleRadioChange(event) {
    event.preventDefault();

    setLoading(true)
    const value = event.target.value
    console.log(value)

    await axios.post("http://localhost:8000", {topic:value, username: name}).then(resp => {
      const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
      messages.push(resp.data)
      setLoading(false)
      localStorage.setItem('chatMessages', JSON.stringify(messages))
      setMessages(messages)
    }).catch(resp => {
        setLoading(false)
    })
  }

  return (
    <>
      <div className='md:p-10 relative md:container md:mx-auto min-h-screen bg-neutral-50 md:bg-white rounded-md'>

        <div className='mb-10 flex justify-between'>
          <div className='text-2xl text-neutral-600 font-extrabold uppercase'><span className='text-green-400'>Introduceme</span>.ia</div>
        </div>

        { loadingPage &&
          <div className="flex items-center justify-center min-h-screen gap-2">
            <div className="relative p-6 border-4 border-green-200 rounded-full animate-pulse before:absolute before:inset-0 before:-m-2 before:border-4 before:border-green-300 before:rounded-full before:content-[''] before:animate-pulse"></div>
          </div>
        }

        { messages.length == 0 &&
          <div className='flex min-h-screen items-center justify-center'>
              <form onSubmit={handleSubmit} className="flex items-center border border-gray-300 rounded-lg w-full md:w-6/12">
                <input 
                  type="text" 
                  className="p-5 text-neutral-500 border-r border-neutral-50 rounded-l-lg w-full focus:outline-none" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder='Como posso te chamar ?'

                />
                <button
                  class="p-5 bg-green-300 text-green-900 rounded-r-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  Começar!
                </button>
              </form>
          </div>
        }

        <div className='h-auto'>
          { messages.map((item, key) => 
            <div key={key} className='mb-5'>
              <div className='mb-2 w-full flex justify-start'>
                <span className='text-neutral-500 text-sm'>Introduceme.ia</span>
              </div>
              <div className='mb-2 p-10 bg-white md:bg-neutral-50 text-neutral-500 text-left text-sm rounded-md'>
                <span className=''>{ item.text }</span>
              </div>

              <div className='w-full flex flex-col items-end md:flex-row md:justify-end gap-2'>
                { item.options.map((item, key) =>
                  <label key={key} className="block cursor-pointer px-2 py-1 border rounded-full w-28 text-sm text-green-900 bg-green-300 hover:bg-green-400 border-none peer-checked:bg-green-200 peer-checked:border-green-400 transition">
                    <input 
                      type="radio"
                      name="option"
                      value={item}
                      className="peer hidden"
                      onChange={handleRadioChange}/> {item}
                  </label>
                )}
              </div>
            </div>
          )}

          { loading &&
            <div className='animate-pulse'>
              <div className='mb-2 p-10 bg-neutral-100 text-left text-sm rounded-md flex flex-col gap-1'>
                <div class="h-3 bg-neutral-300 rounded w-10/12"></div>
                <div class="h-3 bg-neutral-300 rounded w-8/12"></div>
                <div class="h-3 bg-neutral-300 rounded w-8/12"></div>
              </div>
            </div>
          }
        </div>
      </div> 
    </>
  )
}

export default App
