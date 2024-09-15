import React, { useEffect,useState } from 'react'
import axios from 'axios'
import Markdown from 'markdown-to-jsx'


const Summary = (props) => {

    const [summary,setSummary]=useState()

    const getSummary=()=>{
        const meetingId = props.id
        axios.get(`http://127.0.0.1:5000/get-summary/${meetingId.meetingid}`).then((response)=>{
            console.log(summary)
            setSummary(response.data.summary)
        })
    }
    useEffect(()=>{
        getSummary()
    }, [])
    return (

    <div>
        <h2 className='text-3xl font-semibold my-3'>Summary </h2>
        <div>
            <Markdown>

        {summary}
            </Markdown>
        </div>
    </div>
  )
}

export default Summary