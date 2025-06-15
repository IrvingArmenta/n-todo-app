import type { FunctionalComponent } from 'preact';
import AsyncRoute from 'preact-async-route';
import { Route, Router, type RouterOnChangeArgs, route } from 'preact-router';

import { useState } from 'preact/hooks';
import { getCookie } from 'tiny-cookie';
import Header from './components/header';
import { TODO_APP_COOKIE } from './globals';
import Error404 from './routes/error404';

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
        <AsyncRoute
          path="/"
          getComponent={async () =>
            (await import('./routes/login/index')).default
          }
        />
        <AsyncRoute
          path="/dashboard"
          getComponent={async () =>
            (await import('./routes/dashboard/index')).default
          }
        />
        <AsyncRoute
          path="/dashboard/:listId"
          getComponent={async () =>
            (await import('./routes/listView/index')).default
          }
        />
        <Route component={Error404} default={true} />
      </Router>
    </>
  );
};
