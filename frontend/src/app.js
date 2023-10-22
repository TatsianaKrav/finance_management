import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Router} from "./router.js";
import {Sidebar} from "./components/sidebars.js";

class App {
    constructor() {
        this.router = new Router();
        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this));
        window.addEventListener('popstate', this.handleRouteChanging.bind(this));
    }

    handleRouteChanging(){
        this.router.openRoute();
        new Sidebar();
    }
}
(new App());