import morgan from "morgan";
import logger from "../libs/logger";

const httpLogger = morgan(":method :url :status :res[content-length] - :response-time ms", {
  stream: {
    write: (message: string) => (logger.http ? logger.http(message.trim()) : logger.info(message.trim())),
  },
});

export default httpLogger;
