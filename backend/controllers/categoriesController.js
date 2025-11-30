const fs = require('fs');
const path = require('path');

const categoriesPath = path.join(__dirname, '../data/cats');
let categoriesData = [];

function loadCategories() {
  try {
    const files = fs.readdirSync(categoriesPath).filter(f => f.endsWith('.json'));
    
    if (files.length === 0) {
      console.warn('⚠️  No se encontraron archivos JSON en cats/');
      categoriesData = [];
      return;
    }
    let allCategories = [];
    files.forEach(file => {
      try {
        const filePath = path.join(categoriesPath, file);
        const data = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          allCategories = allCategories.concat(parsed);
        } 
        else {
          allCategories.push(parsed);
        }
        
        console.log(`Cargado: ${file}`);
      } catch (err) {
        console.warn(`Error en ${file}:`, err.message);
      }
    });

    categoriesData = allCategories;
    console.log(`Total cargado: ${categoriesData.length}`);
  } catch (error) {
    console.error('Error al cargar categorías:', error.message);
    categoriesData = [];
  }
}

loadCategories();

exports.getCategories = (req, res) => {
  try {
    if (categoriesData.length === 0) {
      loadCategories();
    }

    const mapped = categoriesData.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      imgSrc: cat.image || cat.imgSrc,
      productCount: cat.productCount || 0
    }));

    res.json({ 
      status: "ok", 
      data: mapped 
    });
  } catch (error) {
    console.error('Error en getCategories:', error);
    res.status(500).json({ 
      status: "error", 
      error: error.message 
    });
  }
};

exports.getCategoryById = (req, res) => {
  try {
    const { id } = req.params;
    
    if (categoriesData.length === 0) {
      loadCategories();
    }

    const category = categoriesData.find(c => c.id === parseInt(id));

    if (!category) {
      return res.status(404).json({ 
        status: "error",
        error: 'Categoría no encontrada' 
      });
    }

    const mapped = {
      id: category.id,
      name: category.name,
      description: category.description,
      imgSrc: category.image || category.imgSrc,
      productCount: category.productCount || 0
    };

    res.json({ 
      status: "ok", 
      data: mapped 
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      error: error.message 
    });
  }
};