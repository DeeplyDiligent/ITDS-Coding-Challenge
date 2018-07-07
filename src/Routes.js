import React, {Component} from 'react';
import './styles/App.css';
// import { BrowserRouter as Router, Route, Link, Switch, Redirect } from
// 'react-router-dom';
import Home from './components/home';

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="container">
                    <h1>ITD Coding Challenge</h1>
                    <h5>Submission from Deep Bhattacharyya</h5>
                    <hr/>
                    <Home/>
                </div>

            </div>
        );
    }
}
export default App;