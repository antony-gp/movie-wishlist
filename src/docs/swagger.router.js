import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-document.json" with { type: "json" };

const router = Router();

router.use("/docs", swaggerUi.serve);
router.get("/docs", swaggerUi.setup(swaggerDocument));

export const SwaggerRouter = router;
