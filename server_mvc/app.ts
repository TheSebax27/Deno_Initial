import { Application, oakCors } from "./Dependencies/dependencias.ts";
import { routerUser } from "./Routes/userRouter.ts";
import { routerBook } from "./Routes/bookRouter.ts";

const app = new Application();
app.use(oakCors());// Habilitar CORS para todas las rutas

const routers = [routerUser, routerBook];	

routers.forEach((router) => {
    app.use(router.routes());
    app.use(router.allowedMethods());
    
});

console.log("Server running on port 8000");
await app.listen({ port: 8000 });