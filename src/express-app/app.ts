import express from 'express';
import cors from 'cors';
import path from 'path';
import {fileURLToPath} from 'url';
import authRoutes from './routes/auth.routes.js';
import catalogRoutes from './routes/catalog.routes.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const app = express();

app.use(cors({origin: '*', credentials: true}));


app.use(express.json());

const publicPath = path.join(dirname, '..', '..', 'public');
app.use(express.static(publicPath));

app.get('/', (_, res) => {
    res.redirect('/titul.html');
});

app.use('/auth', authRoutes);
app.use('/catalog', catalogRoutes);

app.get('/health', (_, res) => res.json({status: 'ok', server: 'express'}));

export default app;