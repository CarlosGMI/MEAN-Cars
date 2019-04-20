//====================================COMPONENTE PRINCIPAL====================================
//Importamos todo lo necesario de React
import React, { Component } from 'react';
//Importamos el estilo del componente
import "./App.scss";
//Importamos todos los componentes que irán incluidos en App
import Navbar from './Layout/NavbarComponent/Navbar';
import Home from './HomeComponent/Home';
//Importamos todo lo necesario de react-router
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Router>
        <Navbar />
        <main>
          <Route exact path='/' component={Home}></Route>
          
        </main>
      </Router>
    );
  }
}

export default App;
