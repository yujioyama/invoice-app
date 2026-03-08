import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import { HttpExceptionLoggerFilter } from "./filters/http-exception-logger.filter";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // create NestJS application instance using the root module (AppModule) that defines the application's structure and dependencies.

  app.use(cookieParser()); // setting up cookie parser middleware to handle cookies in incoming requests.

  // applying a global filter to log HTTP exceptions that occur during request processing.
  // This filter will catch any HttpException thrown in the application, log the details of the exception (like HTTP method, URL, status code, and message),and then show it in the terminal or send a structured JSON response back to the client.
  app.useGlobalFilters(new HttpExceptionLoggerFilter());

  // allowing cross-origin requests from any origin and enabling credentials (like cookies) to be included in cross-origin requests.
  // This is important for frontend applications that need to communicate with this backend server from a different domain.
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("Invoice API")
    .setDescription("Invoice management API documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend server running on http://localhost:${port}`);
}
bootstrap();
