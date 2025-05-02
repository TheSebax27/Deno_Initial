// deno-lint-ignore-file
import { libro } from "../Models/bookModels.ts";
import { z } from "../Dependencies/dependencias.ts";

// Esquema de validación para los datos del libro
const libroSchema = z.object({
    nombreLibro: z.string().min(1, "El nombre del libro es requerido"),
    editorial: z.string().min(1, "La editorial es requerida"),
    autor: z.string().min(1, "El autor es requerido")
});

export const getBooks = async (ctx: any) => {
    const { response } = ctx;
    
    try {
        const objLibro = new libro();
        const listaLibros = await objLibro.SeleccionarLibros();
        response.status = 200;
        response.body = {
            success: true,
            data: listaLibros,
        }
    } catch (error: unknown) {
        console.error("Error en getBooks:", error);
        response.status = 500;
        response.body = {
            success: false,
            msg: "Error al procesar su solicitud",
            errors: error instanceof Error ? error.message : String(error)
        };
    }
}

export const postBooks = async (ctx: any) => {
    const { request, response } = ctx;
    
    if (!request.hasBody) {
        response.status = 400;
        response.body = {
            success: false,
            msg: "No se han enviado datos para crear el libro"
        };
        return;
    }
    
    try {
        // Extraer los datos del body de forma adecuada para esta versión de Oak
        const bodyObj = request.body;
        console.log("Body object:", bodyObj);
        
        let body;
        if (bodyObj && typeof bodyObj.type === 'function' && bodyObj.type() === 'json') {
            body = await bodyObj.value;
        } else {
            // Si no es un objeto Body de tipo JSON, intentamos con otros métodos
            try {
                body = await request.body({ type: 'json' }).value;
            } catch (e) {
                console.log("Error al obtener JSON:", e);
                try {
                    body = await request.body({ type: 'form' }).value;
                } catch (e2) {
                    console.log("Error al obtener form:", e2);
                    throw new Error("No se pudo procesar el cuerpo de la solicitud");
                }
            }
        }
        
        console.log("Datos recibidos (procesados):", body);
        
        // Validar datos con Zod
        const result = libroSchema.safeParse(body);
        if (!result.success) {
            response.status = 400;
            response.body = {
                success: false,
                msg: "Datos de libro inválidos",
                errors: result.error.errors
            };
            return;
        }
        
        // Verificar si ya existe un libro con ese nombre
        const libroConsulta = {
            idLibro: null,
            nombreLibro: body.nombreLibro,
            editorial: "",
            autor: ""
        };
        const objLibroConsulta = new libro(libroConsulta);
        const libroExistente = await objLibroConsulta.ObtenerLibroPorNombre();
        
        if (libroExistente) {
            response.status = 409; // Conflict
            response.body = {
                success: false,
                msg: `Ya existe un libro con el nombre "${body.nombreLibro}"`
            };
            return;
        }
        
        // Crear objeto libro y guardar (sin especificar ID)
        const nuevoLibro = {
            idLibro: null, // Este será asignado automáticamente por la BD
            nombreLibro: body.nombreLibro,
            editorial: body.editorial,
            autor: body.autor
        };
        
        const objLibro = new libro(nuevoLibro);
        const insertado = await objLibro.InsertarLibro();
        
        if (insertado) {
            response.status = 201;
            response.body = {
                success: true,
                msg: "Libro creado correctamente",
                data: nuevoLibro
            };
        } else {
            response.status = 500;
            response.body = {
                success: false,
                msg: "Error al crear el libro"
            };
        }
    } catch (error: unknown) {
        console.error("Error en postBooks:", error);
        response.status = 500;
        response.body = {
            success: false,
            msg: "Error al procesar su solicitud",
            errors: error instanceof Error ? error.message : String(error)
        };
    }
}

export const deleteBooks = async (ctx: any) => {
    const { request, response } = ctx;
    
    if (!request.hasBody) {
        response.status = 400;
        response.body = {
            success: false,
            msg: "No se ha enviado el nombre del libro a eliminar"
        };
        return;
    }
    
    try {
        // Extraer los datos del body de forma adecuada para esta versión de Oak
        const bodyObj = request.body;
        console.log("Body object:", bodyObj);
        
        let body;
        if (bodyObj && typeof bodyObj.type === 'function' && bodyObj.type() === 'json') {
            body = await bodyObj.value;
        } else {
            // Si no es un objeto Body de tipo JSON, intentamos con otros métodos
            try {
                body = await request.body({ type: 'json' }).value;
            } catch (e) {
                console.log("Error al obtener JSON:", e);
                try {
                    body = await request.body({ type: 'form' }).value;
                } catch (e2) {
                    console.log("Error al obtener form:", e2);
                    throw new Error("No se pudo procesar el cuerpo de la solicitud");
                }
            }
        }
        
        console.log("Datos para eliminar (procesados):", body);
        
        if (!body.nombreLibro) {
            response.status = 400;
            response.body = {
                success: false,
                msg: "El nombre del libro es requerido"
            };
            return;
        }
        
        const libroData = {
            idLibro: null,
            nombreLibro: body.nombreLibro,
            editorial: "",
            autor: ""
        };
        
        const objLibro = new libro(libroData);
        
        // Verificar si el libro existe
        const libroExistente = await objLibro.ObtenerLibroPorNombre();
        if (!libroExistente) {
            response.status = 404;
            response.body = {
                success: false,
                msg: `No se encontró un libro con el nombre "${body.nombreLibro}"`
            };
            return;
        }
        
        const eliminado = await objLibro.EliminarLibro();
        
        if (eliminado) {
            response.status = 200;
            response.body = {
                success: true,
                msg: "Libro eliminado correctamente"
            };
        } else {
            response.status = 500;
            response.body = {
                success: false,
                msg: "Error al eliminar el libro"
            };
        }
    } catch (error: unknown) {
        console.error("Error en deleteBooks:", error);
        response.status = 500;
        response.body = {
            success: false,
            msg: "Error al procesar su solicitud",
            errors: error instanceof Error ? error.message : String(error)
        };
    }
}

export const putBooks = async (ctx: any) => {
    const { request, response } = ctx;
    
    if (!request.hasBody) {
        response.status = 400;
        response.body = {
            success: false,
            msg: "No se han enviado datos para actualizar el libro"
        };
        return;
    }
    
    try {
        // Extraer los datos del body de forma adecuada para esta versión de Oak
        const bodyObj = request.body;
        console.log("Body object:", bodyObj);
        
        let body;
        if (bodyObj && typeof bodyObj.type === 'function' && bodyObj.type() === 'json') {
            body = await bodyObj.value;
        } else {
            // Si no es un objeto Body de tipo JSON, intentamos con otros métodos
            try {
                body = await request.body({ type: 'json' }).value;
            } catch (e) {
                console.log("Error al obtener JSON:", e);
                try {
                    body = await request.body({ type: 'form' }).value;
                } catch (e2) {
                    console.log("Error al obtener form:", e2);
                    throw new Error("No se pudo procesar el cuerpo de la solicitud");
                }
            }
        }
        
        console.log("Datos para actualizar (procesados):", body);
        
        if (!body.nombreLibroOriginal) {
            response.status = 400;
            response.body = {
                success: false,
                msg: "El nombre original del libro es requerido para actualizar"
            };
            return;
        }
        
        // Validar datos con Zod
        const result = libroSchema.safeParse({
            nombreLibro: body.nombreLibro,
            editorial: body.editorial,
            autor: body.autor
        });
        
        if (!result.success) {
            response.status = 400;
            response.body = {
                success: false,
                msg: "Datos de libro inválidos",
                errors: result.error.errors
            };
            return;
        }
        
        // Verificar si el libro existe
        const libroConsulta = {
            idLibro: null,
            nombreLibro: body.nombreLibroOriginal,
            editorial: "",
            autor: ""
        };
        const objLibroConsulta = new libro(libroConsulta);
        const libroExistente = await objLibroConsulta.ObtenerLibroPorNombre();
        
        if (!libroExistente) {
            response.status = 404;
            response.body = {
                success: false,
                msg: `No se encontró un libro con el nombre "${body.nombreLibroOriginal}"`
            };
            return;
        }
        
        // Actualizar libro
        const libroActualizado = {
            idLibro: null, // El ID no se modifica, solo lo gestiona la BD
            nombreLibro: body.nombreLibro,
            editorial: body.editorial,
            autor: body.autor
        };
        
        const objLibro = new libro(libroActualizado);
        const actualizado = await objLibro.ActualizarLibro(body.nombreLibroOriginal);
        
        if (actualizado) {
            response.status = 200;
            response.body = {
                success: true,
                msg: "Libro actualizado correctamente",
                data: libroActualizado
            };
        } else {
            response.status = 500;
            response.body = {
                success: false,
                msg: "Error al actualizar el libro"
            };
        }
    } catch (error: unknown) {
        console.error("Error en putBooks:", error);
        response.status = 500;
        response.body = {
            success: false,
            msg: "Error al procesar su solicitud",
            errors: error instanceof Error ? error.message : String(error)
        };
    }
}