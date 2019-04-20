//Importamos todo lo relacionado a React
import React from 'react';
import ReactDOM from 'react-dom';
//Importamos los estilos que usaremos en toda la aplicación
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css';
//Importamos el componente principal
import App from './components/App';
import * as serviceWorker from './serviceWorker';

//Renderizamos el componente principal en el root del index.html
ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
