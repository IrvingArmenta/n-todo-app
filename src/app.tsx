import type { FunctionalComponent } from 'preact';
import { Route, Router, type RouterOnChangeArgs, route } from 'preact-router';

import { useState } from 'preact/hooks';
import { getCookie } from 'tiny-cookie';
import Header from './components/header';
import { TODO_APP_COOKIE } from './globals';
import Dashboard from './routes/dashboard';
import Error404 from './routes/error404';
import ListView from './routes/listView';
import Login from './routes/login';

async function checkForCookie() {
  const authCookie = getCookie(TODO_APP_COOKIE);
  return !!authCookie;
}

export const App: FunctionalComponent = () => {
  const [currentPath, setCurrentPath] = useState('/');

  const handleAuthRoute = async (e: RouterOnChangeArgs) => {
    setCurrentPath(e.url);
    switch (e.url) {
      case '/dashboard':
        {
          const check = await checkForCookie();
          if (check === false) route('/', true);
        }
        break;
      case '/dashboard/:listId':
        {
          const check = await checkForCookie();
          if (check === false) route('/', true);
        }
        break;
    }
  };

  return (
    <>
      <Header isLogin={currentPath === '/'} />
      <Router onChange={handleAuthRoute}>
        <Route path="/" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/dashboard/:listId" component={ListView} />
        <Route component={Error404} default={true} />
      </Router>
    </>
  );
};
