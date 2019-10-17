import 'dotenv/config'; //ja carrega as variaveis de ambiente do arquivo .env
import Queue from './lib/Queue'; //importando a fila queue

Queue.processQueue();