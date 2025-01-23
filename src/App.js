import './App.css';
import { createBrowserRouter , RouterProvider } from 'react-router-dom';
import User from './components/getuser/User';

import Edit from './components/updateuser/Edit';
// import Add from './components/adduser/add';
import AddV from './components/adduser/vadd';
import LoginPage from './components/Auth/loginpage';
import RegistrationPage from './components/Auth/registration';

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
      element: <LoginPage />

    },
    {
      path: 'registration',
      element: <RegistrationPage/>

    },

  ]
  )






  return (
    <div className="App">
      <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;

