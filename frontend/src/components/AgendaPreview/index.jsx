import React, { useEffect, useState } from 'react'
import Markdown from 'markdown-to-jsx'
import axios from 'axios'

const AgendaPreview = (props) => {

    const [agenda,setAgenda]=useState()
    const fetchAgenda=()=>{
        const meetingId = props.id
        axios.get(`http://127.0.0.1:5000/get-agenda/${meetingId.meetingid}`).then((response)=>{
            // console.log(response)
            setAgenda(response.data.agenda)

        })


    }

    useEffect(()=>{
        fetchAgenda() 
    },[ ])

  return (
    <div className=''>
        <div className='bg-slate-200 w-5/5 my-10 text-start mx-auto opacity-100 rounded-xl'>
        <div className=' w-5/6 mx-auto'>
        <h2 className='text-3xl text-start font-semibold underline mt-5'>Agenda </h2>
            <Markdown className='mt-5'>
                {agenda}
            </Markdown>

        </div>
        </div>
    </div>
  )
}

export default AgendaPreview