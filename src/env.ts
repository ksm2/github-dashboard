import dotenv from 'dotenv';
import env from 'env-var';

dotenv.config();

export const HTTP_PORT = env.get('HTTP_PORT').default(8080).asPortNumber();
export const GITHUB_TOKEN = env.get('GITHUB_TOKEN').required().asString();
export const GITHUB_ORG = env.get('GITHUB_ORG').required().asString();
