import { Application, Router } from "https://deno.land/x/oak@v17.1.3/mod.ts";

const app = new Application();
const router = new Router();

let usuarios: { nombre: string }[] = [];  // Arreglo para almacenar usuarios

router.get("/usuarios", (ctx) => {
    ctx.response.status = 200;
    ctx.response.body = { success: true, usuarios };
});

router.post("/usuarios", async (ctx) => {
    const { request, response } = ctx;
    const contenido = request.headers.get("Content-Length");

    if (contenido === "0") {
        response.status = 400;
        response.body = { success: false, msg: "Cuerpo de la solicitud vacio" };
        return;
    }

    const body = await request.body.json();

    if (!body.nombre) {
        response.status = 400;
        response.body = { success: false, msg: "El campo 'nombre' es obligatorio" };
        return;
    }

    // Agregar el usuario al arreglo
    usuarios.push({ nombre: body.nombre });

    console.log(body);
    response.status = 201;  // Establecer el estado de respuesta a 201 (creado)
    response.body = { success: true, msg: "Usuario creado" };
});

router.delete("/usuarios", async (ctx) => {
    const { request, response } = ctx;

    // Verificar si el cuerpo tiene contenido
    const contenido = request.headers.get("Content-Length");
    if (contenido === "0") {
        response.status = 400;
        response.body = { success: false, msg: "Cuerpo de la solicitud vacio" };
        return;
    }

    // Obtener el cuerpo de la solicitud
    const body = await request.body.json();

    if (!body.nombre) {
        response.status = 400;
        response.body = { success: false, msg: "El campo 'nombre' es obligatorio" };
        return;
    }

    // Eliminar usuario por nombre
    const nombre = body.nombre;
    usuarios = usuarios.filter((usuario) => usuario.nombre !== nombre);

    console.log(`Usuario con nombre ${nombre} eliminado`);

    response.status = 200;
    response.body = { success: true, msg: `Usuario con nombre ${nombre} eliminado` };
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log('Servidor corriendo por el puerto 8000');

app.listen({ port: 8000 });