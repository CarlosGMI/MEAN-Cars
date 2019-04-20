//Importamos todo lo necesario de React
import React, {Component} from 'react';
//Importamos todos los componentes que compondrán la página principal (Home)
import Header from './HeaderComponent/Header';

class Home extends Component {
    render(){
        return(
            <div>
                <Header/>
            </div>
        );
    }
}

export default Home;