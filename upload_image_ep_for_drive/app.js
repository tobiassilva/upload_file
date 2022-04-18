const express = require('express');
const app = express();
const fs = require('fs');
const { google } = require('googleapis');
const uploadImageDrive = require('./middlewares/uploadImageDrive');

const GOOGLE_API_FOLDER_ID = '1lGzNF3Z9Fypa4UHkXBRNUR-IMJ3Xbrd8'; // ID DA PASTA QUE FICA NO FINAL DO LINK DO DRIVE

app.post("/upload-image", uploadImageDrive.single('image'), async (req, res) => {
    
    console.log(req.file);
    if(req.file){ //se retorna true de uploadImage.js

        await UploadFile(req.file).then(data => {
            console.log(data);
            //id retornado
            //https://drive.google.com/uc?export=view&id= + id da imagem
            //https://drive.google.com/uc?export=view&id=1cuYPudrGmRY5aNzuEhLt4nNzx5Zq6ID1
        });

        try {
            fs.unlinkSync(req.file.destination + "/" + req.file.filename);
        }catch(err) {
            console.error(err)
          }


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

async function UploadFile(retornoArq){
    try{
        const auth = new google.auth.GoogleAuth({
            keyFile: './googledrive.json',
            scopes: ['https://www.googleapis.com/auth/drive'] // da acesso a conta
        });

        const driveService = google.drive({
            version: 'v3',
            auth
        });

        const fileMetaData = {
            'name': retornoArq.filename, //nome da imagem que vai salvar no drive, geralmente um nome dinamico
            'parents': [GOOGLE_API_FOLDER_ID] //id da pasta do drive
        }

        const media = {
            //mimetype: 'image/png',
            body: fs.createReadStream('./public/upload/images/' + retornoArq.filename)
        }

        //requisição
        const response = await driveService.files.create({
            resource: fileMetaData,
            media: media,
            fields: 'id' //retorna o id que o google drive vai criar
        });

        return response.data.id;
    } catch(err){
        console.log('Erro ao criar arquivo', err);
    }
}

app.listen(8080, () => {
    console.log('Iniciado na porta : http://localhost:8080');
});

// app.post('/upload-image', uploadImageDrive.single('image'), async (req, res) => {
// //app.post('/upload-image', async (req, res) => {

//     /*UploadFile(req.file).then(data => {
//         console.log(data);
//         //id retornado
//         //https://drive.google.com/uc?export=view&id= + id da imagem
//         //https://drive.google.com/uc?export=view&id=1cuYPudrGmRY5aNzuEhLt4nNzx5Zq6ID1
//     });*/

    
// });

// async function UploadFile(image){
//     try{
//         const auth = new google.auth.GoogleAuth({
//             keyFile: './googledrive.json',
//             scopes: ['https://www.googleapis.com/auth/drive'] // da acesso a conta
//         });

//         const driveService = google.drive({
//             version: 'v3',
//             auth
//         });

//         const fileMetaData = {
//             'name': image.originalname + "_" + Date.now().toString(), //nome da imagem que vai salvar no drive, geralmente um nome dinamico
//             'parents': [GOOGLE_API_FOLDER_ID] //id da pasta do drive
//         }

//         const media = {
//             mimetype: 'image/png',
//             body: image//fs.createReadStream('./logo_guia.png')
//         }

//         //requisição
//         const response = await driveService.files.create({
//             resource: fileMetaData,
//             media: media,
//             fields: 'id' //retorna o id que o google drive vai criar
//         });

//         return response.data.id;
//     } catch(err){
//         console.log('Erro ao criar arquivo', err);
//     }
// }


// app.listen(8080, () => {
//     console.log('Iniciado na porta : http://localhost:8080');
// });