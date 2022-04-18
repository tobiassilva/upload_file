const multer = require('multer');

module.exports = (multer({
    
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/upload/images') // local que vai salvar a imagem
        },
        filename: (req, file, cb) => {
            cb(null, Date.now().toString() + "_" + file.originalname)
        }
    }),
    fileFilter: (req, file, cb) => {
        // vai verificar se a extensao da imagem é valida
        const extensaoImg = ['image/png', 'image/jpg', 'image/jpeg'].find
        (formatoAceito => formatoAceito == file.mimetype); 
        
        if(extensaoImg) return cb(null, true);
        return cb(null, false);
    }
})

);