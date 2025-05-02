import { Router } from "../Dependencies/dependencias.ts";
import { getBooks,postBooks,putBooks,deleteBooks } from "../Controllers/bookController.ts";
import { get } from "node:http";

const routerBook = new Router();



routerBook.get("/libros", getBooks);
routerBook.post("/libros", postBooks);
routerBook.delete("/libros", deleteBooks);
routerBook.put("/libros", putBooks);

export {routerBook};