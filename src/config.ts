import dotenv from "dotenv";
import path from "path";
import winston from "winston";
import fs from "fs";
import { homedir } from "os";
import mongoose from 'mongoose';

class Configuration {
  private static instace: Configuration;
  public db: any;
  public NODE_ENV: string;
  public HOST: string;
  public PORT: string;
  public baseUrl: string;
  public logger: winston.Logger;
  private LOG_LEVEL: string;
  public dataDIR: string;
  private dbConnUrl: string;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() { }

  public static getInstance(): Configuration {
    if (!Configuration.instace) {
      Configuration.instace = new Configuration();
      Configuration.instace.setupEnvVar();
      Configuration.instace.setup();
      Configuration.instace.setupLogger();
      Configuration.instace.setupDb();
    }
    return Configuration.instace;
  }

  private setup() {
    this.HOST = process.env.HOST ? process.env.HOST : "localhost";
    this.PORT = process.env.PORT ? process.env.PORT : "4006";
    this.LOG_LEVEL = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : "info";
    this.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "development";
    this.dbConnUrl = process.env.DB_URL;
    this.baseUrl = "http://" + this.HOST + ":" + this.PORT;

    this.dataDIR = process.env.DATA_DIR
      ? process.env.DATA_DIR
      : path.join(homedir(), "vendor-smart-api");
    if (!fs.existsSync(this.dataDIR)) fs.mkdirSync(this.dataDIR);
  }

  private setupEnvVar() {
    const envPath = path.resolve(
      __dirname,
      "../",
      process.env.NODE_ENV + ".env"
    );

    console.log(envPath);

    if (fs.existsSync(envPath)) {
      dotenv.config({
        path: envPath,
      });
    } else {
      dotenv.config();
    }
  }

  private setupLogger() {
    const logDIR = path.join(this.dataDIR, "./log");
    if (!fs.existsSync(logDIR)) fs.mkdirSync(logDIR);

    const { combine, timestamp, printf } = winston.format;
    const customLogFormat = printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}] ${message}`;
    });
    const logFilePath = path.join(logDIR, "vendor-smart-api.log");
    this.logger = winston.createLogger({
      level: this.LOG_LEVEL || (this.NODE_ENV === 'production' ? 'warn' : 'info'),
      format: combine(timestamp(), customLogFormat),
      transports: [
        new winston.transports.File({
          filename: path.join(logDIR, 'vendor-smart-api-error.log'),
          level: 'error',
        }),
        new winston.transports.File({ filename: logFilePath }),
      ],
    });
    if (this.NODE_ENV !== "production") {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.simple(),
        })
      );
    }

    this.logger.info(`Log filepath is set to ${logFilePath}`);
  }

  private async setupDb() {
    try {
      await mongoose.connect(this.dbConnUrl);  // Removed deprecated options
      this.db = mongoose.connection;

      this.db.on('error', (error) => {
        this.logger.error(`Database connection error: ${error.message}`);
      });

      this.db.once('open', () => {
        this.logger.info('Successfully connected to the database');
      });
    } catch (error) {
      this.logger.error(`Failed to connect to the database: ${error.message}`);
      process.exit(1);
    }
  }
}

const {
  db,
  NODE_ENV,
  HOST,
  PORT,
  baseUrl,
  logger,
} = Configuration.getInstance();
export { db, NODE_ENV, HOST, PORT, baseUrl, logger };
