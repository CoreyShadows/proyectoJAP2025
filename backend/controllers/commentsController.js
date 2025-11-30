const fs = require('fs');
const path = require('path');

const commentsPath = path.join(__dirname, '../data/products_comments');
let commentsData = {};

function loadComments() {
  try {
    const files = fs.readdirSync(commentsPath).filter(f => f.endsWith('.json'));
    
    if (files.length === 0) {
      console.warn('⚠️  No se encontraron archivos JSON en products_comments/');
      commentsData = {};
      return;
    }

    let allComments = {};
    files.forEach(file => {
      try {
        const filePath = path.join(commentsPath, file);
        const data = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(data);

        if (typeof parsed === 'object' && !Array.isArray(parsed)) {
          allComments = { ...allComments, ...parsed };
        } 
        else if (Array.isArray(parsed)) {
          allComments['all'] = (allComments['all'] || []).concat(parsed);
        }
        
        console.log(`Cargado: ${file}`);
      } catch (err) {
        console.warn(`Error en ${file}:`, err.message);
      }
    });

    commentsData = allComments;
    console.log(`Comentarios cargados`);
  } catch (error) {
    console.error('Error al cargar comentarios:', error.message);
    commentsData = {};
  }
}
loadComments();

exports.getCommentsByProduct = (req, res) => {
  try {
    const productId = parseInt(req.params.productId);

    if (Object.keys(commentsData).length === 0) {
      loadComments();
    }

    let comments = [];

    if (Array.isArray(commentsData.all)) {
      comments = commentsData.all.filter(
        c => c.product === productId
      );
    }

    res.json({
      status: "ok",
      data: comments
    });
  } catch (error) {
    console.error('Error en getCommentsByProduct:', error);
    res.status(500).json({
      status: "error",
      error: error.message
    });
  }
};
