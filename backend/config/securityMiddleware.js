import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import xssClean from 'xss-clean';
function securityMiddleware(app) {
  // removes any chars starting with dollar or dot
  app.use(mongoSanitize());

  // xss protection
  app.use(xssClean());

  // Handling CORS
  app.use(
    cors({
      origin: '*',
      methods: 'HEAD, PUT, PATCH, POST, DELETE',
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    }),
  );

  // remove x-powered-by
  app.disable('x-powered-by');

}

export default securityMiddleware;
