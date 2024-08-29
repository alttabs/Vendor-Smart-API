import express from 'express';
import routes from './routes';
import swaggerJsDoc = require('./swagger.json');
import swaggerUi from 'swagger-ui-express';
import { PORT, baseUrl } from './config';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import { errorHandler } from './middleware/errorHandler';

const app = express();

const limiter = rateLimit({
  windowMs: 100 * 60 * 1000,
  message: 'Too many requests'
});


app.use(helmet())
app.use(limiter)
app.use(xss())
app.use(express.json({ limit: '10kb' }));
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc))
app.use('/api/v1', routes);
app.use(errorHandler);

app.listen(PORT, () => console.log('Server is running @ ' + baseUrl));