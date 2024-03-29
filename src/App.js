import './App.css';
import { useInfoContext } from './context/Context';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Auth from './pages/Auth/Auth';
import Chat from './pages/Chat/Chat';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  const {currentUser } = useInfoContext();
  return (
    <div className="App">
      
      {
        currentUser ? <Chat/> : <Auth />
      }
      
        <ToastContainer />
    </div>
  );
}

export default App;
