const fs = require('fs');
const { google } = require('googleapis');

const GOOGLE_API_FOLDER_ID = '1lGzNF3Z9Fypa4UHkXBRNUR-IMJ3Xbrd8'; // ID DA PASTA QUE FICA NO FINAL DO LINK DO DRIVE

async function UploadFile(){
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
            'name': 'imagemEnviada.png', //nome da imagem que vai salvar no drive, geralmente um nome dinamico
            'parents': [GOOGLE_API_FOLDER_ID] //id da pasta do drive
        }

        const media = {
            mimetype: 'image/png',
            body: fs.createReadStream('./logo_guia.png')
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

UploadFile().then(data => {
    console.log(data);
    //id retornado
    //https://drive.google.com/uc?export=view&id= + id da imagem
    //https://drive.google.com/uc?export=view&id=1cuYPudrGmRY5aNzuEhLt4nNzx5Zq6ID1
});