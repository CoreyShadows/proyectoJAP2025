const fs = require('fs');
const path = require('path');

const commentsPath = path.join(__dirname, '../data/products_comments');
let commentsData = {};

/**
 * Carga todos los comentarios desde los archivos JSON
 * Cada archivo debe llamarse: {productId}.json
 */
function loadComments() {
  try {
    const files = fs.readdirSync(commentsPath).filter(file => file.endsWith('.json'));

    if (files.length === 0) {
      console.warn('⚠️ No hay archivos de comentarios');
      commentsData = {};
      return;
    }

    let allComments = {};

    files.forEach(file => {
      try {
        const filePath = path.join(commentsPath, file);
        const rawData = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(rawData);

        // Obtener ID del producto desde el nombre del archivo
        const productId = path.basename(file, '.json');

        if (Array.isArray(parsed)) {
          allComments[productId] = parsed;
          console.log(`✅ Comentarios cargados para producto ${productId}`);
        } else {
          console.warn(`⚠️ El archivo ${file} no contiene un array`);
        }
      } catch (err) {
        console.warn(`⚠️ Error leyendo ${file}:`, err.message);
      }
    });

    commentsData = allComments;
    console.log('✅ Todos los comentarios fueron cargados');
  } catch (error) {
    console.error('❌ Error general al cargar comentarios:', error.message);
    commentsData = {};
  }
}

// Cargar comentarios al iniciar el servidor
loadComments();

/**
 * GET /api/comments/:productId
 */
exports.getCommentsByProduct = (req, res) => {
  try {
    const { productId } = req.params;

    // Recargar si quedó vacío (fallback)
    if (Object.keys(commentsData).length === 0) {
      loadComments();
    }

    const comments = commentsData[productId] || [];

    res.json({
      status: 'ok',
      data: comments
    });
  } catch (error) {
    console.error('❌ Error en getCommentsByProduct:', error.message);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
