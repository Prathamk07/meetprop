import React, { useEffect, useState } from 'react'
import axios from 'axios';


const CreateMeeting = () => {

  const [title,setTitle]=useState('')
  const [desc, setDesc] = useState('')
  const [time,setTime]=useState('')
  const [date, setDate]=useState('')
  const [meeting,setMeeting]=useState()

  // const updateMeeting=(data)=>{
  //   setMeeting(data)
  // }
  useEffect(()=>{
    axios.get('http://127.0.0.1:5000/new-meeting').then(data=>{
      console.log(data)
      // eslint-disable-next-line no-const-assign
      setMeeting(data)
    })  
  },[])
  const values=() =>{
    axios.post('http://127.0.0.1:5000/new-meeting', {
      'title': title,
      'date':date,
      'desc':desc,
      'time':time
    }).then(data=>{
      console.log(data)
    })
  }

  return (
    <div>
        <div className='w-3/5 mx-auto bg-slate-200 rounded-xl p-5 my-5'>
            
            <h3 className='text-xl'>
                New Meeting
            </h3>

            <input className='text-md p-2 rounded-xl my-2 w-1/2' onChange={e=>setTitle(e.target.value)} type="text" placeholder='Title of the Meeting' />
            <input className='text-md p-2 rounded-xl my-2 mx-2 w-1/5' placeholder='hrs:mins' onChange={e=>setTime(e.target.value)} type="time" />
            <input className='text-md p-2 rounded-xl my-2 mx-2 w-1/4' onChange={e=>setDate(e.target.value)} type="date" placeholder='Date' />
            <textarea name="description" placeholder='description' onChange={e=>setDesc(e.target.value)} className='rounded-xl p-2 w-full' rows={10} id=""></textarea>
            <div className='flex justify-center'>

            <button onClick={values} className='bg-blue-800 text-white w-2/5 px-3 py-2 rounded-xl '>Create</button>
            </div>
        </div>
    </div>
  )
}

export default CreateMeeting
