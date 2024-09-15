import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import DocumentUpload from '../../components/DocumentUpload'
import AgendaPreview from '../../components/AgendaPreview'
import VideoHandler from '../../components/VideoHandler'
import Summary from '../../components/Summary'

const Meeting = () => {

    const meetingId = useParams() 
    const [data,setData]=useState({})
    const [visibility,setVisibility]=useState(1)
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');


    useEffect(()=>{
        axios.get(`http://127.0.0.1:5000/meeting/${(meetingId.meetingid).toString()}`).then((response)=>{
            console.log(response.data)
            setData(response.data)
        })
    },[])


    const setVideo=(e)=>{
        const video = e.target.files[0]
        const maxFileSize = 100 * 1024 * 1024; // 100 MB in bytes
        console.log(video.size)
        if (video.size > maxFileSize) {
            alert("File is too large. Please select a file smaller than 100 MB.");
            return;
        }
        setFile(video)
    }
        // axios.post(`http://127.0.0.1:5000/summarize/${meetingId.meetingid}`, formData ,{
        //     headers: {
        //         'Content-Type': 'multipart/form-data',
        //         // 'setContentType' : 'multipart/form-data'
        //     },
        // }).then((response)=>{
        //     console.log(response)
        // })
    

    return (
        <div>
            <div className='bg-slate-200 py-2 w-4/5 mx-auto my-5 rounded-xl overflow-hidden '>
                       <div className='mx-4 text-lg my-2 flex justify-between'>

                        <span>{data.date}</span>
                        {/* <br /> */}
                        <span>{(data.time)}</span>
                       </div>
                <div className='w-5/6 mx-auto my-5'>
                    <div className='flex my-2'>
                        <div className=''>
                            <h3 className='text-2xl text-slate-500 flex'>Title :</h3>
                        </div>
                        <div className='5/6'>
                            <h3 className='text-2xl text-slate-800 mx-2'>
                                {data.title}
                            </h3>
                        </div>
                    </div>
                    <div className='flex'>
                        <div className='w-2/5'>
                            <h5 className='text-sm text-slate-500'>Description : </h5>
                        </div>
                        <div className=''>
                            <h5>
                                <span>{data.desc}</span>
                            </h5>
                        </div>
                    </div>

                    <div className='grid grid-cols-2'>
                        <div className='bg-white rounded-xl p-3 w-4/5 text-center my-2'>
                            <span>Upload Document + </span>
                            <DocumentUpload id={meetingId} />
                        </div>
                        
                        <div className='bg-white rounded-xl p-3 w-4/5 text-center my-2'>
                            <span>Upload .mp4 video to generate summary</span>
                            <VideoHandler id={meetingId} />
                        </div>
                        <a href="#agenda">

                        <div className='bg-blue-400 p-4 rounded-xl w-4/5 text-center'>
                            Agenda 
                        </div>
                        </a>
                        <a href="#summary">

                        <div className='bg-blue-400 p-4 rounded-xl w-4/5 text-center'>
                            Summary 
                        </div>
                        </a>
                    </div>
                </div>
            </div>
            <section id='agenda'>
                    <div className='bg-white rounded-xl mx-auto p-3 w-4/5 text-center my-2'>
                            <div className='block'>
                                <AgendaPreview id={meetingId} />
                            </div>

                            {/* <span className='absolute top-0 right-0' onClick={showAgenda()} >x</span> */}
                        </div>
            </section>
            <section>
                <div>
                    <div className='w-4/5 mx-auto bg-slate-200 rounded-xl p-3'>
                        
                    <Summary id={meetingId} />    
                    </div>
                </div> 
            </section>
        </div>
    )
}

export default Meeting
