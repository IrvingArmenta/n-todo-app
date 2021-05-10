import { FunctionalComponent, h } from 'preact';
import { Route, Router } from 'preact-router';

import Profile from './routes/profile';
import NotFoundPage from './routes/notfound';
import Login from './routes/login';
import Dashboard from './routes/dashboard';

const App: FunctionalComponent = () => {
  return (
    <div id="preact_root">
      {/* <Header /> */}
      <Router>
        <Route path="/" component={Login} />
        <Route path="/dashboard/" component={Dashboard} />
        <Route path="/profile/" component={Profile} user="me" />
        <Route path="/profile/:user" component={Profile} />
        <NotFoundPage default />
      </Router>
    </div>
  );
};

export default App;
