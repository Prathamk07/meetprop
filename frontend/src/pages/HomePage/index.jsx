import React from 'react'
import axios from 'axios'
import { useEffect ,useState } from 'react'

const HomePage = () => {
  const [meeting,setMeeting]=useState([])

  useEffect(()=>{
    axios.get('http://127.0.0.1:5000/new-meeting').then(data=>{
      console.log(data.data)
      // eslint-disable-next-line no-const-assign
      setMeeting(data.data)
    })  
  },[])
  return (
    <div>
      <div className='grid w-3/5 my-5 mx-auto'>
      <div className='flex justify-between my-2'>

        <h3 className='text-2xl'>Meetings </h3>  
        <a href='/create-meeting' className='bg-slate-200 px-3 py-2 rounded-xl'>Create New Meeting</a>
      </div>
        {meeting && meeting.map((meets)=>{
          return(
            <>
              <a key={meets._id} href={`meeting/${meets._id}`}>
          <div className='w-full bg-slate-200 my-5 px-3 py-2 rounded-xl relative'>
        <span className='text-md'>{meets.date} - {meets.time}</span>
        <br />
        <h4 className='text-xl mx-auto text-center my-5'>{meets.title}</h4>
        <p className='w-4/5 mx-auto text-slate-500 mb-10'>{meets.desc}</p>
        <div className='grid '>
          {/* <div className='bg-white my-2 rounded-xl px-2 py-1 w-4/5 mx-auto text-center'>
            Pre-Meeting Documents
          </div>
          <div className='bg-white my-2 rounded-xl px-2 py-1 w-4/5 mx-auto text-center'>
            Agenda
          </div>
          <div className='bg-white my-2 rounded-xl px-2 py-1 w-4/5 mx-auto text-center'>
            Meeting Minutes
          </div>
          <div className='bg-white my-2 rounded-xl px-2 py-1 w-4/5 mx-auto text-center'>
            Summary
          </div> */}
          <div className='w-full flex justify-end'>
            
          </div>
        </div>
        </div>
        
        </a>
            </>
          )     
      
        })}
      </div>
    </div>
  )
}

export default HomePage
