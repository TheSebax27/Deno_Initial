import { conexion } from "./conexion.ts";

interface LibroData{
    idLibro: number | null;
    nombreLibro: string;
    editorial: string;
    autor: string;
}

export class libro{
    public _objLibro: LibroData | null;
    public _idLibro: number | null;
    
    constructor(objBook:LibroData|null = null, idLibro:number | null=null){
        this._objLibro = objBook;
        this._idLibro = idLibro;
    }

    public async SeleccionarLibros(): Promise<LibroData[]>{
        const {rows: books} = await conexion.execute("select * from libro");
        return books as LibroData[];
    }
    
    public async InsertarLibro(): Promise<boolean> {
        if (!this._objLibro) return false;
        
        try {
            await conexion.execute(
                "INSERT INTO libro (nombreLibro, editorial, autor) VALUES (?, ?, ?)",
                [
                    this._objLibro.nombreLibro,
                    this._objLibro.editorial,
                    this._objLibro.autor
                ]
            );
            return true;
        } catch (error) {
            console.error("Error al insertar libro:", error);
            return false;
        }
    }
    
    public async ActualizarLibro(nombreLibroOriginal: string): Promise<boolean> {
        if (!this._objLibro) return false;
        
        try {
            await conexion.execute(
                "UPDATE libro SET nombreLibro = ?, editorial = ?, autor = ? WHERE nombreLibro = ?",
                [
                    this._objLibro.nombreLibro,
                    this._objLibro.editorial,
                    this._objLibro.autor,
                    nombreLibroOriginal
                ]
            );
            return true;
        } catch (error) {
            console.error("Error al actualizar libro:", error);
            return false;
        }
    }
    
    public async EliminarLibro(): Promise<boolean> {
        if (!this._objLibro || !this._objLibro.nombreLibro) return false;
        
        try {
            await conexion.execute(
                "DELETE FROM libro WHERE nombreLibro = ?",
                [this._objLibro.nombreLibro]
            );
            return true;
        } catch (error) {
            console.error("Error al eliminar libro:", error);
            return false;
        }
    }
    
    public async ObtenerLibroPorNombre(): Promise<LibroData | null> {
        if (!this._objLibro || !this._objLibro.nombreLibro) return null;
        
        try {
            const result = await conexion.execute(
                "SELECT * FROM libro WHERE nombreLibro = ?",
                [this._objLibro.nombreLibro]
            );
            
            // Usar operador de coalescencia nula para manejar si rows es undefined
            const rows = result.rows ?? [];
            
            if (rows.length > 0) {
                return rows[0] as LibroData;
            }
            return null;
        } catch (error) {
            console.error("Error al obtener libro por nombre:", error);
            return null;
        }
    }
}