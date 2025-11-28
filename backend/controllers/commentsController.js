const fs = require('fs');
const path = require('path');

const commentsPath = path.join(__dirname, '../data/products_comments');
let commentsData = {};

function loadComments() {
  try {
    // Leer TODOS los archivos .json de la carpeta products_comments/
    const files = fs.readdirSync(commentsPath).filter(f => f.endsWith('.json'));
    
    if (files.length === 0) {
      console.warn('⚠️  No se encontraron archivos JSON en products_comments/');
      commentsData = {};
      return;
    }

    // Combinar todos los JSON
    let allComments = {};
    files.forEach(file => {
      try {
        const filePath = path.join(commentsPath, file);
        const data = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(data);
        
        // Merging: combinar objetos con IDs de producto
        if (typeof parsed === 'object' && !Array.isArray(parsed)) {
          // Si es un objeto { "1": [...], "2": [...] }
          allComments = { ...allComments, ...parsed };
        } 
        // Si es un array directo
        else if (Array.isArray(parsed)) {
          // Asumir que el archivo contiene comentarios de un producto
          // basado en el nombre del archivo o agregarlo bajo una clave genérica
          allComments['all'] = (allComments['all'] || []).concat(parsed);
        }
        
        console.log(`  ✅ Cargado: ${file}`);
      } catch (err) {
        console.warn(`  ⚠️  Error en ${file}:`, err.message);
      }
    });

    commentsData = allComments;
    console.log(`✅ Comentarios cargados`);
  } catch (error) {
    console.error('❌ Error al cargar comentarios:', error.message);
    commentsData = {};
  }
}

// Cargar al iniciar
loadComments();

exports.getCommentsByProduct = (req, res) => {
  try {
    const { productId } = req.params;

    if (Object.keys(commentsData).length === 0) {
      loadComments();
    }

    // Buscar comentarios del producto
    const comments = commentsData[productId] || [];

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