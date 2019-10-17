import Bee from 'bee-queue'; //importando o bee-queue 
import redisConfig from '../config/redis'; //importando as configurações do redis

//importando os JOBS parecido com os models
import CancellationMail from '../app/jobs/CancellationMail'; //importando o job de email 

const jobs = [CancellationMail];

class Queue{

    constructor(){

        //essa variavel vazia armazena os jobs que foram passados
        this.queues = {};

        this.init(); //chamando o método init
    }

    //método que inicia
    init(){

        //percorre os jobs
        jobs.forEach( ({ key, handle }) => {

            this.queues[key] = {
                
                //essa é a fila com a conexão com o redis
                bee: new Bee(key, {
                    redis: redisConfig, //passando a conexão com o banco redis
                }),
                //esse método handle processa o job
                handle,
            };

        });
    }

    //método que adiciona um novo job a fila
    //queue -> qual fila que vai ser adicionado o job
    //job -> os elemntos que precisam, exemplo o appointment
    add(queue, job){
        return this.queues[queue].bee.createJob(job).save();
    }

    //método que processa a fila
    processQueue(){
        
        //percorrendo cada jobs
        jobs.forEach(job => {

            const{ bee, handle } = this.queues[job.key];
            bee.on('failed', this.handleFailure).process(handle);
        });
    }

    handleFailure(job, err){
        console.log(`Queue ${job.queue.name}: FAILED`, err);
    }
}

export default new Queue;