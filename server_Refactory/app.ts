import { Application } from "./Dependencies/dependencias.ts"; 
import { routerUser } from "./Routes/userRouter.ts";
import { routerBook } from "./Routes/bookRouter.ts";
const app = new Application();

app.use(routerUser.routes()); 
app.use(routerUser.allowedMethods());

app.use(routerBook.routes()); 
app.use(routerBook.allowedMethods());


console.log("Server running on port 8000");
await app.listen({ port: 8000 });