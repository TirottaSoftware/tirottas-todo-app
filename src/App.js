import LoginForm from "./components/LoginForm";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomePage from "./components/Home";
import "./App.css";
import Settings from './components/Settings';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/home/settings" component={Settings} />
        <Route path="/home" component={HomePage} />
        <Route path="/" exact component={LoginForm} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
