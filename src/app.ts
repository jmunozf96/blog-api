import { PrismaClient } from '@prisma/client';
import express from 'express';
import { errorHandler } from './errors/error.handler';

class App {
    public app: express.Application;
    public port: number;

    constructor(controllers: any[], port: number) {
        this.app = express();
        this.port = port;
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.app.use(errorHandler);
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
    }

    private initializeControllers(controllers: any[]) {
        this.app.get('/', (req, res) => {
            res.status(200).json({
                status: 'ok',
                timestamp: new Date().toISOString()
            });
        });
        controllers.forEach((controller) => {
            this.app.use('/api', controller.router);
        });
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

export default App;