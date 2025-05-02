import { conexion } from "./conexion.ts";

interface UsuarioData{
    idUsuario: number | null;
    nombre: string;
    apellido: string;
    email: string;
}

export class usuario{
    public _objUsuario: UsuarioData | null;
    public _idUsuario: number | null;


   constructor(objUser:UsuarioData|null = null, idUsuario:number | null=null){

    this._objUsuario = objUser;
    this._idUsuario = idUsuario;
}
 public async SeleccionarUsuarios(): Promise<UsuarioData[]>{
    const {rows: users} = await conexion.execute("select * from usuario");
    return users as UsuarioData[];
 }

}