// deno-lint-ignore-file
import { usuario } from "../Models/userModels.ts";
export const getUsers = async (ctx:any) => {
    const {response} = ctx;

    try {
        const objUsuario = new usuario();
        const listaUsuarios = await objUsuario.SeleccionarUsuarios();
        response.status = 200;
        response.body = {
            success:true,
            data:listaUsuarios,
        }
    } catch (error) {
        response.status = 400;
        response.body = {
            success:false,
            msg: "Error al procesar su solicitud",
            errors: error
        };
    }

    
}

export const postUsers = (ctx:any) => {
}

export const deleteUsers = (ctx:any) => {
}

export const putUsers = (ctx:any) => {
}