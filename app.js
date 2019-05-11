import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import methodOverride from 'method-override';
import routes from './routes';

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(routes);

if (!isProduction) {
  // / catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  app.get('/*', (req, res, next) => {
    if (req.headers.host.match(/^www\./) != null) {
      res.redirect(`http://${req.headers.host.slice(4)}${req.url}`, 301);
    } else {
      next();
    }
  });
}

app.use((err, req, res) => {
  res.status(err.status || 500).json({
    errors: {
      message: err.message,
      error: err,
    },
  });
});

export default app;
