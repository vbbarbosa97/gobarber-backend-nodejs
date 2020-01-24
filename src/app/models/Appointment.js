import Sequelize, {Model} from 'sequelize';
import { isBefore, subHours } from 'date-fns'; 

class Appointment extends Model{

    static init(sequelize){

        super.init(
            {
                date: Sequelize.DATE,
                canceled_at: Sequelize.DATE,
                //esse campo informa se ja passou ou não a data desse agendamento
                past: {
                    type: Sequelize.VIRTUAL,
                    get(){
                        //retorna true se a data ja tiver expirado
                        return isBefore(this.date, new Date());
                    },
                },
                //esse campo informa se ainda tem tempo para ser cancelado
                cancelable: {
                    type: Sequelize.VIRTUAL,
                    get(){
                        return isBefore(new Date(), subHours(this.date, 2) );
                    },
                },
            },
            {
                sequelize,
            }
        );

        return this;
    }

    //relacionamentos 
    static associate(models){
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider'});
    }
}

export default Appointment;