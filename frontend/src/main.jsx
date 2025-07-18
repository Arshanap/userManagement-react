import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
// import './index.css';
import store from './store.js'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeScreen from './screens/HomeScreen.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx'
import ProfileScreen from './screens/ProfileScreen.jsx'
import PrivateRoute from './components/PrivateRoute.jsx';
import DashboardScreen from './screens/DashboardScreen.jsx';
import EditUserScreen from './screens/EditUserScreen.jsx';
import CreateUserScreen from './screens/CreateUserScreen.jsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      {/* Private Router */}
      <Route path='' element={<PrivateRoute />} >
        <Route index={true} path='/' element={<HomeScreen />} />
        <Route path='/profile' element={<ProfileScreen />} />
        <Route path='/dashboard' element={<DashboardScreen />} />
        <Route path='/edit-user/:id' element={<EditUserScreen />} />
        <Route path='/create-user' element={<CreateUserScreen />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store} >
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);