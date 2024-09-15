// DocumentUpload.js
import React, { useState } from 'react';
import axios from 'axios';
import Markdown from 'markdown-to-jsx'


function DocumentUpload(props) {
    const [file, setFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [uploadedFileURL, setUploadedFileURL] = useState(null);

    const [agenda,setAgenda]=useState('')

    const onFileChange = (e) => {
        setFile(e.target.files[0]);

        if (file) {
            const fileURL = URL.createObjectURL(file);
            setPreviewURL(fileURL);
        }
    };

    const onUpload = () => {
        const formData = new FormData();
        formData.append('file', file);
        const meetingId = props.id
        console.log(meetingId)
        axios.post(`http://127.0.0.1:5000/upload/${meetingId.meetingid}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            setAgenda(response.data.summary)
            console.log(response.data.summary)
            console.log('File uploaded successfully');
        })
        .catch(error => {
            console.error('Error uploading file:', error);
        });
    };

    return (
        <div>
            <input type="file" id='filepicker' className='invisible' onChange={onFileChange} />
            {!file &&
            <button className='border border-solid border-gray-400 py-16 px-12 rounded-xl' onClick={()=>{document.querySelector('#filepicker').click()}}>{file?file.filename:'+'}</button>
            }
             {/* Preview the file before uploading */}
      {/* {previewURL && (
        <div>
          <h2>File Preview:</h2>
          <iframe src={previewURL} width="100%" height="500px" title="File Preview"></iframe>
        </div>
      )} */}

        <div>
        {/* <Markdown>
            {agenda}
        </Markdown> */}
        </div>
        {file &&

            <button className='bg-blue-400 px-8 py-14 rounded-xl my-4' onClick={onUpload}>Upload</button>
        }
        </div>
    );
}

export default DocumentUpload;
