const fs = require('fs');
const path = require('path');

const categoriesProductsPath = path.join(__dirname, '../data/cats_products');
let categoriesProductsData = [];

/**
 * Carga todas las categorías con sus productos
 */
function loadCategoriesProducts() {
    try {
        const files = fs.readdirSync(categoriesProductsPath).filter(file => file.endsWith('.json'));

        if (files.length === 0) {
            console.warn('⚠️ No se encontraron archivos en cats_products');
            categoriesProductsData = [];
            return;
        }

        let allCategories = [];

        files.forEach(file => {
            try {
                const filePath = path.join(categoriesProductsPath, file);
                const rawData = fs.readFileSync(filePath, 'utf8');
                const parsed = JSON.parse(rawData);

                allCategories.push(parsed);
                console.log(`✅ Cargada categoría ${parsed.catName}`);
            } catch (err) {
                console.warn(`⚠️ Error en ${file}:`, err.message);
            }
        });

        categoriesProductsData = allCategories;
        console.log(`Categorías con productos cargadas: ${categoriesProductsData.length}`);
    } catch (error) {
        console.error('Error cargando cats_products:', error.message);
        categoriesProductsData = [];
    }
}

loadCategoriesProducts();

/**
 * GET /api/categories-products/:categoryId
 * Devuelve los productos de UNA categoría
 */
exports.getProductsByCategory = (req, res) => {
    try {
        const { categoryId } = req.params;

        if (categoriesProductsData.length === 0) {
            loadCategoriesProducts();
        }

        const category = categoriesProductsData.find(
            c => c.catID === parseInt(categoryId)
        );

        if (!category) {
            return res.status(404).json({
                status: 'error',
                error: 'Categoría no encontrada'
            });
        }

        res.json({
            status: 'ok',
            data: category.products
        });
    } catch (error) {
        console.error('Error en getProductsByCategory:', error);
        res.status(500).json({
            status: 'error',
            error: error.message
        });
    }
};
