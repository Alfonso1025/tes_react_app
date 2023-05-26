
import { useEffect, useState } from 'react';
import {BrowserRouter as Router,Routes,Route,Link,Navigate,Outlet,useNavigate} from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';
import Dashboard from './Dashboard';
import BackgroundCheck from './BackgroundCheck';


function App() {

 const navigate = useNavigate()
  //user authentication state
  const [isAutheticated, setIsAuthenticated] = useState(true)

  const ProtectedRoute = ({ user, redirectPath = '/login' }) => {
    if (!isAutheticated) {
      return <Navigate to={redirectPath} replace />;
    }
  
    return <Outlet />;
  };

 

const remoteServer = 'https://3.215.0.219:8080'


//check if there is an authorization on token on the local storage

const isVerified= async()=>{
try {
  console.log('this is the server: ',remoteServer)
  console.log(localStorage.token)
  const response= await fetch(`${remoteServer}/users/verified`,{
    method:'GET',
    headers:{token:localStorage.token}
  })
  
  const verified=await response.json()
  console.log('this is verified',verified)
  if(verified.code === 403){
    isAutheticated(false)
    
  }

} catch (err) {
  console.log('this is the error',err)

}
}
const authenticateUser = ()=>{
  setIsAuthenticated(true)
  if(isAutheticated){
    navigate('/dashboard')
  }
}
 useEffect(()=>{
  isVerified()
}) 
  return (
    <div className="App">
      <button onClick={authenticateUser}>authenticate</button>
  
      <Routes>
        <Route index element={<Login />} />
        <Route path="/login" element={<Login/>} />
        <Route path="analytics" element={<SignUp/>} />
        <Route element={<ProtectedRoute isAutheticated={isAutheticated} />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="backgroundcheck" element={<BackgroundCheck />} />
        </Route>
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
     
       
    </div>
  );
}

export default App;
