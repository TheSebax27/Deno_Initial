// deno-lint-ignore-file
import { libro } from "../Models/bookModels.ts";
import { z } from "../Dependencies/dependencias.ts";

// Esquema de validación para los datos del libro
const libroSchema = z.object({
  nombreLibro: z.string().min(1, "El nombre del libro es requerido"),
  editorial: z.string().min(1, "La editorial es requerida"),
  autor: z.string().min(1, "El autor es requerido")
});


async function obtenerBody(request: any) {
  if (!request.hasBody) {
    return null;
  }
  
  try {
    
    const bodyType = request.headers.get("content-type") || "";
    
    if (bodyType.includes("application/json")) {
      const bodyJson = await request.body.json();
      console.log("Body procesado:", bodyJson);
      return bodyJson;
    } else {
      console.log("Tipo de contenido no soportado:", bodyType);
      throw new Error("Tipo de contenido no soportado");
    }
  } catch (error) {
    console.error("Error al procesar el body:", error);
    throw new Error("No se pudo procesar el cuerpo de la solicitud");
  }
}

export const getBooks = async (ctx: any) => {
  const { response } = ctx;
  
  try {
    const objLibro = new libro();
    const listaLibros = await objLibro.SeleccionarLibros();
    
    response.status = 200;
    response.body = {
      success: true,
      data: listaLibros,
    };
  } catch (error: unknown) {
    console.error("Error en getBooks:", error);
    response.status = 500;
    response.body = {
      success: false,
      msg: "Error al procesar su solicitud",
      errors: error instanceof Error ? error.message : String(error)
    };
  }
};

export const postBooks = async (ctx: any) => {
  const { request, response } = ctx;
  
  try {
    // Verificar si hay un cuerpo en la solicitud
    if (!request.hasBody) {
      response.status = 400;
      response.body = { success: false, msg: "No se han enviado datos para crear el libro" };
      return;
    }
    
    const body = await obtenerBody(request);
    
    if (!body) {
      response.status = 400;
      response.body = { success: false, msg: "No se han enviado datos válidos para crear el libro" };
      return;
    }
    
    // Validar datos con Zod
    const validationResult = libroSchema.safeParse(body);
    if (!validationResult.success) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Datos de libro inválidos",
        errors: validationResult.error.errors
      };
      return;
    }
    
    // Verificar si ya existe un libro con ese nombre
    const objLibroConsulta = new libro({
      idLibro: null,
      nombreLibro: body.nombreLibro,
      editorial: "",
      autor: ""
    });
    
    const libroExistente = await objLibroConsulta.ObtenerLibroPorNombre();
    if (libroExistente) {
      response.status = 409;
      response.body = {
        success: false,
        msg: `Ya existe un libro con el nombre "${body.nombreLibro}"`
      };
      return;
    }
    
    // Crear nuevo libro
    const nuevoLibro = {
      idLibro: null,
      nombreLibro: body.nombreLibro,
      editorial: body.editorial,
      autor: body.autor
    };
    
    const objLibro = new libro(nuevoLibro);
    const insertado = await objLibro.InsertarLibro();
    
    response.status = insertado ? 201 : 500;
    response.body = insertado
      ? { success: true, msg: "Libro creado correctamente", data: nuevoLibro }
      : { success: false, msg: "Error al crear el libro" };
      
  } catch (error: unknown) {
    console.error("Error en postBooks:", error);
    response.status = 500;
    response.body = {
      success: false,
      msg: "Error al procesar su solicitud",
      errors: error instanceof Error ? error.message : String(error)
    };
  }
};

export const deleteBooks = async (ctx: any) => {
  const { request, response } = ctx;
  
  try {
    // Verificar si hay un cuerpo en la solicitud
    if (!request.hasBody) {
      response.status = 400;
      response.body = { success: false, msg: "No se ha enviado el nombre del libro a eliminar" };
      return;
    }
    
    const body = await obtenerBody(request);
    
    if (!body) {
      response.status = 400;
      response.body = { success: false, msg: "No se han enviado datos válidos para eliminar el libro" };
      return;
    }
    
    if (!body.nombreLibro) {
      response.status = 400;
      response.body = { success: false, msg: "El nombre del libro es requerido" };
      return;
    }
    
    const objLibro = new libro({
      idLibro: null,
      nombreLibro: body.nombreLibro,
      editorial: "",
      autor: ""
    });
    
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
    
    response.status = eliminado ? 200 : 500;
    response.body = eliminado
      ? { success: true, msg: "Libro eliminado correctamente" }
      : { success: false, msg: "Error al eliminar el libro" };
      
  } catch (error: unknown) {
    console.error("Error en deleteBooks:", error);
    response.status = 500;
    response.body = {
      success: false,
      msg: "Error al procesar su solicitud",
      errors: error instanceof Error ? error.message : String(error)
    };
  }
};

export const putBooks = async (ctx: any) => {
  const { request, response } = ctx;
  
  try {
    // Verificar si hay un cuerpo en la solicitud
    if (!request.hasBody) {
      response.status = 400;
      response.body = { success: false, msg: "No se han enviado datos para actualizar el libro" };
      return;
    }
    
    const body = await obtenerBody(request);
    
    if (!body) {
      response.status = 400;
      response.body = { success: false, msg: "No se han enviado datos válidos para actualizar el libro" };
      return;
    }
    
    if (!body.nombreLibroOriginal) {
      response.status = 400;
      response.body = { success: false, msg: "El nombre original del libro es requerido para actualizar" };
      return;
    }
    
    // Validar datos con Zod
    const validationResult = libroSchema.safeParse({
      nombreLibro: body.nombreLibro,
      editorial: body.editorial,
      autor: body.autor
    });
    
    if (!validationResult.success) {
      response.status = 400;
      response.body = {
        success: false, 
        msg: "Datos de libro inválidos",
        errors: validationResult.error.errors
      };
      return;
    }
    
    // Verificar si el libro existe
    const objLibroConsulta = new libro({
      idLibro: null,
      nombreLibro: body.nombreLibroOriginal,
      editorial: "",
      autor: ""
    });
    
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
      idLibro: null,
      nombreLibro: body.nombreLibro,
      editorial: body.editorial,
      autor: body.autor
    };
    
    const objLibro = new libro(libroActualizado);
    const actualizado = await objLibro.ActualizarLibro(body.nombreLibroOriginal);
    
    response.status = actualizado ? 200 : 500;
    response.body = actualizado
      ? { success: true, msg: "Libro actualizado correctamente", data: libroActualizado }
      : { success: false, msg: "Error al actualizar el libro" };
      
  } catch (error: unknown) {
    console.error("Error en putBooks:", error);
    response.status = 500;
    response.body = {
      success: false,
      msg: "Error al procesar su solicitud",
      errors: error instanceof Error ? error.message : String(error)
    };
  }
};