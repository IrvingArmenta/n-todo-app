import { FunctionalComponent, h } from 'preact';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Error404 from './routes/error404';
import Login from './routes/login';
import Dashboard from './routes/dashboard';
import Header from './components/header';
import ListView from './routes/listView';

const App: FunctionalComponent = () => {
  return (
    <div id="preact_root">
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact={true} render={() => <Login />} />
          <Route
            exact={true}
            path="/dashboard"
            render={(p) => <Dashboard {...p} />}
          />
          <Route
            path="/dashboard/:listId"
            render={(p) => <ListView {...p} listId={p.match.params.listId} />}
          />
          <Route render={() => <Error404 />} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
