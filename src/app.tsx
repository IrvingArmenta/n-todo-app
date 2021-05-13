import { FunctionalComponent, h } from 'preact';
import { Router, Route, RouterOnChangeArgs, route } from 'preact-router';

import Error404 from './routes/error404';
import Login from './routes/login';
import Dashboard from './routes/dashboard';
import Header from './components/header';
import ListView from './routes/listView';
import Cookies from 'js-cookie';
import { useState } from 'preact/hooks';

async function checkForCookie() {
  const authCookie = Cookies.get('TodoApp-User-Cookie');
  return !!authCookie;
}

const App: FunctionalComponent = () => {
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
    <div id="preact_root">
      <Header isLogin={currentPath === '/'} />
      <Router onChange={handleAuthRoute}>
        <Route path="/" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/dashboard/:listId" component={ListView} />
        <Route component={Error404} default={true} />
      </Router>
    </div>
  );
};

export default App;
