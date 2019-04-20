import React, {Component} from 'react';
import './Header.scss';

class Header extends Component {
    render() {
        return(
            <header className='main-header-content'>
                <div className='container'>
                    <div className='header-text'>
                        <div className='first-header-text'>Grupo Concesionario MERNCars</div>
                        <div className='second-header-text'>El mejor stack para tu bolsillo</div>
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;