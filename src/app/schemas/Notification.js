import mongoose from 'mongoose'; //importando o mongoose


//é bem parecido com o model 
//aqui eu digo o que o javascript vai poder salvar no banco
const NotificationSchema = new mongoose.Schema({

    content: {
        type: String,
        required: true,
    },
    user: {
        type: Number,
        required: true,
    },
    read: {
        type: Boolean,
        required: true,
        default: false,
    },

},
{
    timestamps: true,
});

export default mongoose.model('Notification', NotificationSchema);