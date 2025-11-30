const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../data/products');
let productsData = [];

function loadProducts() {
  try {
    const files = fs.readdirSync(productsPath).filter(f => f.endsWith('.json'));
    
    if (files.length === 0) {
      console.warn('⚠️  No se encontraron archivos JSON en products/');
      productsData = [];
      return;
    }
    let allProducts = [];
    files.forEach(file => {
      try {
        const filePath = path.join(productsPath, file);
        const data = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(data);

        if (Array.isArray(parsed)) {
          allProducts = allProducts.concat(parsed);
        } 
        else {
          allProducts.push(parsed);
        }
        
        console.log(`Cargado: ${file}`);
      } catch (err) {
        console.warn(`Error en ${file}:`, err.message);
      }
    });

    productsData = allProducts;
    console.log(`Total de productos cargados: ${productsData.length}`);
  } catch (error) {
    console.error('Error al cargar productos:', error.message);
    productsData = [];
  }
}

loadProducts();

exports.getProducts = (req, res) => {
  try {
    if (productsData.length === 0) {
      loadProducts();
    }
    const mapped = productsData.map(prod => ({
      id: prod.id,
      name: prod.name,
      description: prod.description,
      cost: prod.cost || prod.price,
      currency: prod.currency,
      image: prod.image || prod.main_image,
      soldCount: prod.soldCount || 0,
      category: prod.category,
      images: prod.images || [],
      relatedProducts: prod.relatedProducts || []
    }));

    res.json({ 
      status: "ok", 
      data: mapped 
    });
  } catch (error) {
    console.error('Error en getProducts:', error);
    res.status(500).json({ 
      status: "error", 
      error: error.message 
    });
  }
};

exports.getProductById = (req, res) => {
  try {
    const { id } = req.params;

    if (productsData.length === 0) {
      loadProducts();
    }

    const product = productsData.find(p => p.id === parseInt(id));

    if (!product) {
      return res.status(404).json({ 
        status: "error",
        error: 'Producto no encontrado' 
      });
    }

    const mapped = {
      id: product.id,
      name: product.name,
      description: product.description,
      cost: product.cost || product.price,
      currency: product.currency,
      image: product.image || product.main_image,
      soldCount: product.soldCount || 0,
      category: product.category,
      images: product.images || [],
      relatedProducts: product.relatedProducts || []
    };

    res.json({ 
      status: "ok", 
      data: mapped 
    });
  } catch (error) {
    console.error('Error en getProductById:', error);
    res.status(500).json({ 
      status: "error", 
      error: error.message 
    });
  }
};

exports.getProductsByCategory = (req, res) => {
  try {
    const { categoryId } = req.params;

    if (productsData.length === 0) {
      loadProducts();
    }

    const filtered = productsData.filter(p => p.category === parseInt(categoryId));

    const mapped = filtered.map(prod => ({
      id: prod.id,
      name: prod.name,
      description: prod.description,
      cost: prod.cost || prod.price,
      currency: prod.currency,
      image: prod.image || prod.main_image,
      soldCount: prod.soldCount || 0,
      category: prod.category,
      images: prod.images || [],
      relatedProducts: prod.relatedProducts || []
    }));

    res.json({ 
      status: "ok", 
      data: mapped 
    });
  } catch (error) {
    console.error('Error en getProductsByCategory:', error);
    res.status(500).json({ 
      status: "error", 
      error: error.message 
    });
  }
};