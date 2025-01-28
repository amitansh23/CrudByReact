import './App.css';
import { createBrowserRouter , RouterProvider } from 'react-router-dom';
import User from './components/getuser/User';

import Edit from './components/updateuser/Edit';
// import Add from './components/adduser/add';
import AddV from './components/adduser/vadd';
import Login from './components/Auth/loginpage';
import RegistrationPage from './components/Auth/registration';
import Restore from './components/getuser/restore';


function App() {

  const route = createBrowserRouter([
    {
      path: '/',
      element: <User/>,
    },
    {
      path: '/add',
      element: <AddV />,
    },
    {
      path: '/edit/:id',
      element: <Edit/>,
    },
    {
      path: '/login',
      element: <Login />

    },
    {
      path: '/registration',
      element: <RegistrationPage/>

    },
    {
      path: '/restore',
      element: <Restore/>
    }

  ]
  )






  return (
    <div className="App">
      <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;

