import logger from "./libs/logger";
import { config } from "./config";
import { loadApp } from "./loaders/app";

(async () => {
  const app = await loadApp();

  app.get("/ping", (req, res) => {
    logger.info("Ping request received");
    res.json({ pong: true });
  });

  app.listen(config.app.port, () => {
    logger.info(`Backend running on http://localhost:${config.app.port}`);
  });
})();
