
import './App.css'

function App() {


  return (
    <>
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
        <div className=''>
        <div className=' absolute p-6 bg-red-400'></div>
        <div className=' p-7 bg-blue-400'></div>
        <div className='p-8 bg-teal-400'></div>
      </div>
     
    </>
  )
}

export default App
