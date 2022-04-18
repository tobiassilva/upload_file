const express = require('express');
const app = express();
const uploadImage = require('./middlewares/uploadImage');

/*"image" é o nome do campo que vai enviar*/
app.post("/upload-image", uploadImage.single('image'), async (req, res) => {
    
    if(req.file){ //se retorna true de uploadImage.js
        return res.json({
            erro: false,
            mensagem: "Upload realizado com sucesso!"
        });
    }
    return res.status(404).json({
        erro: true,
        mensagem: "Error: Upload não realizado com sucesso!"
    });
});

app.listen(8080, () => {
    console.log('Iniciado na porta : http://localhost:8080');
});