import React from 'react';
import { Router } from '@reach/router';
import Header from './Header';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import Notes from './Notes';
import ModelEditor from './ModelEditor';
import Settings from './Settings';
import PrivateRoute from './PrivateRoute';
import { getCurrentAdmin } from '../api/AuthAPI';
import useAuth, { AuthProvider } from '../context/auth';

function App() {
  const {
    state: { admin, isAuthenticated },
    dispatch,
  } = useAuth();

  React.useEffect(() => {
    let ignore = false;

    async function fetchAdmin() {
      try {
        const payload = await getCurrentAdmin();
        const { token, ...admin } = payload.data.admin;
        if (!ignore) {
          dispatch({ type: 'LOAD_USER', admin });
        }
      } catch (error) {
        console.log(error);
        dispatch({ type: 'LOGOUT' });
      }
    }

    if (!admin && isAuthenticated) {
      fetchAdmin();
    }

    return () => {
      ignore = true;
    };
  }, [dispatch, isAuthenticated, admin]);

  if (!admin && isAuthenticated) {
    return null;
  }

  return (
    <React.Fragment>
      <Header />
      <Router>
        <Home default path="/" />
        <Register path="register" />
        <Login path="login" />
        <PrivateRoute as={Settings} path="/settings" />
        <PrivateRoute as={ModelEditor} path="/modelEditor" />
        <PrivateRoute as={ModelEditor} path="/modelEditor/:slug" />
        <PrivateRoute as={Notes} path="/notes/:slug" />

      </Router>
    </React.Fragment>
  );
}

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
