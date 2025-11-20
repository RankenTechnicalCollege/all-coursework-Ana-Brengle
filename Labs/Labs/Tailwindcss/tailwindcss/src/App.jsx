import { useState } from 'react'
import './App.css'

function App() {
 const [isOpen, setIsOpen] = useState(false);
 const [selectValue, setSelectValue] = useState("Select an option");
  const updateValue = (value) => {
    setSelectValue(value);
    setIsOpen(false);
  };

  return (
    <><div className='dark'>
      <div className='wrap-break p-5 bg-amber-800 space-y-4'>
        <h1 className='text-green-500 line-through decoration-red-700 decoration-wavy'>Hello World</h1>
        <h1 className='text-3xl'>Hello World</h1>
        <h1 className='text-purple font-display'>Hello World</h1>
        <h1 className='lowercase bg-yellow-50 py-2 m-3'>Hello World</h1>s
        <h1 className='text-green bg-blue-300'>Hello World</h1>
        <h1 className='border-6 border-solid'>Hello World</h1>
        <h1 className=''>Hello World</h1>
        <h1 className='uppercase text-blue-400 text-center'>Hello World</h1>
        <h1 className='truncate'>Hello World!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</h1>
        <h1 className='text-xl'>Hello World</h1>
      </div>

      <div className='flex flex-col '>
        <div className='bg-cyan-400 min-h-3 w-1/3 '></div>
        <div className='bg-emerald-500  mt-2 pt-6 h-15 w-5/6'></div>
        <div className='bg-orange-400 w-1/2 h-6 m-1 pe-6'></div>
        <div className='bg-fuchsia-900 min-h-3 w-3/4'></div>
      </div>
      <div className='flex basis-2xl space-x-2 mt-4'>
        <div className='  bg-green-400'></div>
        <div className=' w-1/6 h-16 bg-yellow-400'></div>
        <div className='w-1/6 h-16 bg-red-400'></div>
        <div className='w-1/6 h-16 bg-blue-400'></div>
        <div className='w-1/6 h-16 bg-teal-400'></div>
      </div>
      <div className=' space-between justify-center flex md:flex-row mt-10'>
        <div className=' mb-4 w-1/6 h-16 bg-stone-400'></div>
        <div className=' p-4 w-1/6 h-16 bg-fuchsia-400'></div>
        <div className='w-1/6 h-16 bg-pink-400'></div>
        <div className='w-1/6 h-16 bg-cyan-400'></div>
        <div className='w-1/6 h-16 bg-lime-400'></div>
      </div>
      <div className='grid lg:grid-cols-12 gap-4 mt-10'>
        <div className='p-6 rounded-lg bg-green-400'></div>
        <div className=' col-start-1 col-end-3 p-6 bg-yellow-400'></div>
        <div className='col-start-2 col-end-1 p-6 bg-red-400'></div>
        <div className='p-6 bg-blue-400'></div>
        <div className=' bg-teal-400'></div>
      </div>
      <div className='justify-end grid grid-flow-col-dense'>
        <div className=' bg-green-400'></div>
        <div className=' bg-yellow-400'></div>
        <div className=' bg-red-400'></div>
        <div className=' bg-blue-400'></div>
        <div className=' bg-teal-400'></div>
      </div>
      <div className='grid grid-cols-3 content-end gap-4'>
        <div className=' w-full grow bg-green-400'></div>
        <div className='w-full grow bg-yellow-400'></div>
        <div className=' bg-red-400'></div>
        <div className=' bg-blue-400'></div>
        <div className=' bg-teal-400'></div>
      </div>
      <div className='container mx-auto columns-3 space-between mb-10'>
        <div className='p-6 bg-green-400'></div>
        <div className='p-6 bg-yellow-400'></div>
        <div className='p-6 bg-red-400'></div>
        <div className='p-6 bg-blue-400'></div>
        <div className='p-6 bg-teal-400'></div>
      </div>
      <div className='container'>
        <div className='sr-only text-stone-950'>hello mommy</div>
        <div className='relative p-5 bg-yellow-400'></div>
        </div>
        <div className='container mt-5'>
        <img className='w-64 float-left rounded-2xl' src="https://images.unsplash.com/photo-1565829577241-474d81bf757c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" srcset="" />
        <img className='w-64 float-right rounded-2xl' src="https://images.unsplash.com/photo-1565829577241-474d81bf757c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" srcset="" />
        <h1 className='text-stone-950'>isploasdbflasdbhflajsdhbfslhdf</h1>
      </div>
       <div className='container mt-10'>
        <div className='grid grid-cols-3 gap-4 text-center'>
          <div className='bg-teal-500'><p>hello</p></div>
          <div className='invisible bg-teal-500'><p>hello</p></div>
          <div className='bg-teal-500'><p>hello</p></div>
        </div>
      </div>
      <div className='mt-64'>
        <p className='border-b-8 pb-3 border-l border-t-2'>Hello world</p>
      </div>
      <div className='mt-10 divide-y divide-blue-700'>
        <h1 className='blur-xs hover:blur-none'>Hello world</h1>
        <h1 className='blur-xs hover:blur-none'>Hello world</h1>
        <h1 className='blur-xs hover:blur-none'>Hello world</h1>
        <h1 className='blur-xs hover:blur-none'>Hello world</h1>
        <h1 className='blur-xs hover:blur-none'>Hello world</h1>
      </div>
      <input type="text" className='border-2 border-double border-rose-700 outline-none' />
      <input type="button" value="Button" className='outline-offset-2 outline-4 outline-cyan-400 ring-4' />
      <br></br>
      <div className='inline-block p-4 text-black bg-white border rounded-lg mt-10 shadow-2xl shadow-blue-900'>
        <h1 className='opacity-100'>Hello World</h1>
        <h1 className='opacity-75'>Hello World</h1>
        <h1 className='opacity-50'>Hello World</h1>
        <h1 className='opacity-25'>Hello World</h1>
      </div>
      <div className='m-10'>
        <input type="button" value="Hover" className='bg-blue-500 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-red-500 skew-6' />
        <input type="button" value="Hover" className='bg-blue-500 hover:animate-spin' />
        <input type="button" value="Hover" className='bg-blue-500 hover:animate-ping origin-top-left rotate-90' />
        <input type="button" value="Hover" className='bg-blue-500 hover:animate-bounce origin-bottom -rotate-12' />
        <input type="button" value="Hover" className='bg-blue-500 hover:animate-pulse rotate-45' />
      </div>


       <div className='dark:my-72'>
        <h1>This is a title</h1>
        <h2>This is a subtitle</h2>
        <p className='text-base'>This is a paragraph</p>
        <a href="https://insideranken.org/ICS/">This is an anchor</a>
        <div className='my-4'>
          <input type="button" value="This is a primary button" className="btn btn-primary" />
        </div>
        <div className='my-4'>
          <input type="button" value="This is a secondary button" className="btn btn-secondary" />
        </div>
        <div className='my-4'>
          <input disabled type="button" value="This is a primary button" className="btn btn-primary" />
        </div>
        <div>
          <input type="text" name="textbox" id="txtInput" placeholder='E-mail' />
        </div>
        <div>
          <input disabled type="text" name="textbox" id="txtInput" placeholder='E-mail' />
        </div>
        <div>
          <input type="date" name="date" id="date" />
        </div>
        <div className='flex items-start my-4'>
          <input type="checkbox" name="checkbox" id="cbxInput" />
          <label htmlFor="checkbox">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</label>
        </div>
        <div>
          <select name="dropdown" id="rbnInput">
            <option value="option 1">first option</option>
            <option value="option 2">second option</option>
          </select>
        </div>
        <div className='Select'>
          <div className='child flex items-center justify-between' onClick={() => setIsOpen(!isOpen)}>
            <span>{selectValue}</span>
            <div className={isOpen ? "rotate-180" : "rotate-0"}>
              <arrowDown /> 
            </div>
            
          </div>
          {isOpen && (
            <div>
              <ul className='flex flex-col divide-y border-t-2'>
                <li className='child' onClick={() => updateValue("option 1")}>option 1</li>
                <li className='child' onClick={() => updateValue("option 2")}>option 2</li>
                <li className='child' onClick={() => updateValue("option 3")}>option 3</li>
              </ul>
            </div>
          )}
        </div>
        <h1>This is another title</h1>
        <h2>This is another subtitle</h2>
      </div>
     </div>
    </>
  )
}

export default App
