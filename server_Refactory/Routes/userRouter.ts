import { Router } from "../Dependencies/dependencias.ts";

const routerUser = new Router();

// Arreglo para almacenar usuarios
let usuarios: { id: string; nombre: string }[] = [];
let contadorId = 1;

routerUser.get("/usuarios", (ctx) => {
    ctx.response.status = 200;
    ctx.response.body = { success: true, usuarios };
});

routerUser.post("/usuarios", async (ctx) => {
    const { request, response } = ctx;
    const contenido = request.headers.get("Content-Length");

    if (contenido === "0") {
        response.status = 400;
        response.body = { success: false, msg: "Cuerpo de la solicitud vacío" };
        return;
    }

    const body = await request.body.json();

    if (!body.nombre) {
        response.status = 400;
        response.body = { success: false, msg: "El campo 'nombre' es obligatorio" };
        return;
    }

    const nuevoUsuario = {
        id: `${contadorId++}`,
        nombre: body.nombre
    };

    usuarios.push(nuevoUsuario);

    console.log("Usuario creado:", nuevoUsuario);
    response.status = 201;
    response.body = { success: true, msg: "Usuario creado", usuario: nuevoUsuario };
});

routerUser.delete("/usuarios", async (ctx) => {
    const { request, response } = ctx;
    const contenido = request.headers.get("Content-Length");

    if (contenido === "0") {
        response.status = 400;
        response.body = { success: false, msg: "Cuerpo de la solicitud vacío" };
        return;
    }

    const body = await request.body.json();

    if (!body.id) {
        response.status = 400;
        response.body = { success: false, msg: "El campo 'id' es obligatorio" };
        return;
    }

    const id = body.id;
    const usuarioEliminado = usuarios.find(u => u.id === id);

    if (!usuarioEliminado) {
        response.status = 404;
        response.body = { success: false, msg: `Usuario con id ${id} no encontrado` };
        return;
    }

    usuarios = usuarios.filter((usuario) => usuario.id !== id);

    console.log(`Usuario con id ${id} eliminado`);

    response.status = 200;
    response.body = {
        success: true,
        msg: `Usuario con id ${id} eliminado`
    };
});


export {routerUser};