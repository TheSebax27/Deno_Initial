import { Router } from "../Dependencies/dependencias.ts";
import { getUsers,postUsers,putUsers,deleteUsers } from "../Controllers/userController.ts";
import { get } from "node:http";

const routerUser = new Router();



routerUser.get("/usuarios", getUsers);
routerUser.post("/usuarios", postUsers);
routerUser.delete("/usuarios", deleteUsers);
routerUser.put("/usuarios", putUsers);

export {routerUser};