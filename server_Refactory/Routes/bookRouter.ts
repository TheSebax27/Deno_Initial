import { Router } from "../Dependencies/dependencias.ts";

const routerBook = new Router();

// Arreglo para almacenar usuarios
let usuarios: { id: string; nombre: string }[] = [];
let contadorId = 1;

routerBook.get("/libros", (ctx) => {
    ctx.response.status = 200;
    ctx.response.body = { success: true, usuarios };
});

routerBook.post("/libros", async (ctx) => {
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
    
    console.log("libros creado:", nuevoUsuario);
    response.status = 201;
    response.body = { success: true, msg: "libros creado", usuario: nuevoUsuario };
});

routerBook.delete("/libros", async (ctx) => {
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
        response.body = { success: false, msg: `libros con id ${id} no encontrado` };
        return;
    }
    
    usuarios = usuarios.filter((usuario) => usuario.id !== id);
    
    console.log(`libros con id ${id} eliminado`);
    
    response.status = 200;
    response.body = {
        success: true,
        msg: `libros con id ${id} eliminado`
    };
});
 
export { routerBook };