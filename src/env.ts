import dotenv from 'dotenv';
import env from 'env-var';
import { FilterConfig } from './model/FilterConfig.js';

dotenv.config();

export const HTTP_PORT = env.get('HTTP_PORT').default(8080).asPortNumber();
export const GITHUB_TOKEN = env.get('GITHUB_TOKEN').required().asString();
export const GITHUB_ORG = env.get('GITHUB_ORG').required().asString();
export const FILTERS = env.get('FILTERS').default('[]').asJsonArray() as FilterConfig[];
