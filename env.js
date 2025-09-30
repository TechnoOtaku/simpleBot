import { config } from "dotenv";
config();
import process from 'process';
export const TOKEN = process.env.TOKEN
export const HOST = process.env.HOST