import express from 'express';
import path from 'path';
import fileUpload from 'express-fileupload';
import { registerRoutes } from './routes';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, '../../public')));

registerRoutes(app);

app.listen(PORT, () => {
  console.log(`Packetor server running on http://localhost:${PORT}`);
});

export default app;
