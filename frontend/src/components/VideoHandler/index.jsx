import React from 'react'
import axios from 'axios';
import { useState } from 'react';

const VideoHandler = (props) => {


    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

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
    
    const videoUpload=async ()=>{
        const formData = new FormData();
        formData.append('file', file);

        const video = file
        const maxFileSize = 100 * 1024 * 1024; // 100 MB in bytes
        console.log(video.size)
        if (video.size > maxFileSize) {
            alert("File is too large. Please select a file smaller than 100 MB.");
            return;
        }
        try {
            const meetingId = props.id
            const response = await axios.post(`http://127.0.0.1:5000/summarize/${meetingId.meetingid}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadStatus(response.data.message);
            // alert(uploadStatus)
        } catch (error) {
            setUploadStatus('Error uploading file');
            alert(uploadStatus)
        }
    }
 
  return (
    <div className='bg-white rounded-xl p-3 mx-auto w-4/5 text-center my-2'>
        <input id='videopicker' className='invisible' onChange={(event)=>setVideo(event)} name="video" type="file"/>
        {/* <button onClick={videoUpload} type="submit">Submit</button> */}
    
        {file &&

            <button className='bg-blue-400 px-8 mx-auto py-14 rounded-xl my-4' onClick={videoUpload}>Upload</button>
        }
        {!file &&

        <button className='border border-gray-400 mx-auto px-12 py-16 rounded-xl' onClick={()=>{document.querySelector('#videopicker').click()}}>
            +
        </button>
        }
        
    </div>
  )
}
export default VideoHandler