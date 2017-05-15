import React from 'react';
import { BrowserRouter, Route, Link, Switch} from 'react-router-dom'
import routes from './routes';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LandingPage from '../pages/Landing';
import Application from '../pages/application'
const AppRouter = () => (
  <MuiThemeProvider>
    <BrowserRouter >
      <div>
        <Route path = '/' component = {LandingPage} />
        <Switch>
          {routes.map(route =>
            <Route exact key={route.path} path={route.path} component={route.component} />
          )}
        </Switch>
      </div>
    </BrowserRouter>
  </MuiThemeProvider>
);

export default AppRouter;
