import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import Login from './Components/Login';
import TrackRequest from './Components/TrackRequest';
import HomePage from './Components/HomePage';
import Cookie from 'universal-cookie';
import Transaction from './Components/Transaction';
import Register from './Components/Register';

function App() {

  const cookies = new Cookie();
  console.log(cookies.get('token'));
  console.log(cookies.get('isValid'));

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/login' element={<Navigate to="/" replace/>} />
        <Route path="/home" token={cookies.get('token')} isLoggedIn={cookies.get('isValid')} element={<HomePage/>} />
        <Route path='/transaction' element={<Transaction />}/>
        <Route path='/trackRequest' element={<TrackRequest/>}/>
        <Route path='/register' element={<Register/>} />
      </Routes>
    </div>
  );
}

export default App;
