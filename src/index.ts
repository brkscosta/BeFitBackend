import Server from './Server';

class App {
    private app: Server;

    constructor() {
        this.app = new Server();
    }
}

new App();
