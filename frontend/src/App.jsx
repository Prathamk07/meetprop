import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DocManager from './pages/DocManager';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import CreateMeeting from './pages/CreateMeeting';
import Meeting from './pages/Meeting';

function App() {
  return (
    <div className="App" style={{'fontFamily':'Poppins'}}>
        <BrowserRouter>
        <Navbar/>
          <Routes>
            <Route index element={<HomePage/>} />
            <Route path='/create-meeting' element={<CreateMeeting/>} />
            <Route path='/doc-manager' element={<DocManager/>} />
            <Route path='/meeting/:meetingid?' element={<Meeting/>} />

            <Route path='*' element={<NotFound/>} />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
