import React, {Component} from 'react';
import './navbar.scss';
import logo from './img/MERNCarsLogo.png';

class Navbar extends Component {

    //Método que se ejecuta cuando el componente termina de montarse en el DOM
    componentDidMount(){
        //Al terminar de montarse el DOM añade un listener para que cada vez que el usuario haga scroll se ejecute el método que modificará el tamaño del navbar
        window.addEventListener("scroll", this.resizeNavbarOnScroll);
    }

    //Método para cambiar el tamaño del navbar al salir del header principal del Home (foto de los carros)
    resizeNavbarOnScroll(){
        //Constante para ver la distancia en Y de cuántos píxeles hemos scrolleado hacia abajo
        const distanceY = window.pageYOffset || document.documentElement.scrollTop,
        //Constante que nos permite saber a qué distancia (en píxeles) de haber scrolleado hacia abajo cambiaremos el navbar
        shrinkOn = 50,
        //Constante que representa el navbar que modificaremos
        navbar = document.getElementById("main-nav");
        //Si lo que hemos scrolleado hacia abajo es mayor o igual que la distancia que tenemos fijada añadimos una clase que modifica el navbar
        if(distanceY >= shrinkOn)
            navbar.classList.add("navbar-shrink");
        //Si no, quita la clase que modifica el navbar 
        else
            navbar.classList.remove("navbar-shrink");
    }

    render(){
        return (
            <nav className="fixed-top" id="main-nav">
                <div className="container d-flex align-items-center">
                    <a className="navbar-brand"><img src={logo}></img></a>
                    <div id="nav-responsive">
                        <ul className="text-uppercase nav-group-item m-0 align-items-center">
                            <li className="item-nav">
                                <a>Inicio</a>
                            </li>
                            <li className="item-nav">
                                <a>Servicios</a>
                            </li>
                            <li className="item-nav">
                                <a>Quiénes somos</a>
                            </li>
                            <li className="item-nav">
                                <a>Contacto</a>
                            </li>
                            <li className="item-nav">
                                <a>Sesión</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navbar;