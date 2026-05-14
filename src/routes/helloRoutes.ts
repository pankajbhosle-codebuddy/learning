import { Router } from "express";
import {
    sayHello,
    sayHelloFromParams,
    sayHelloFromBody
} from "../controllers/helloController";

const router = Router();

router.get("/", sayHello);
router.get("/:username", sayHelloFromParams);
router.post("/", sayHelloFromBody);

export default router;
