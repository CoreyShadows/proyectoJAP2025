const mariadb = require('mariadb');
const fs = require('fs');
require('dotenv').config();

async function migrateData() {
  let conn;
  try {
    conn = await mariadb.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '1234',
      database: process.env.DB_NAME || 'emercado',
      port: process.env.DB_PORT || 3306
    });

    console.log('🔄 Iniciando migración de datos...');

    // DESACTIVAR FK temporalmente para limpieza
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');

    // Limpiar tablas en orden seguro (hijas primero)
    const tablesToTruncate = [
      'ProductImages',
      'RelatedProducts',
      'Comments',
      '`Transaction`',
      'Payment',
      'Customer',
      'Products',
      'Category'
    ];
    for (const t of tablesToTruncate) {
      try {
        await conn.query(`TRUNCATE TABLE ${t}`);
        console.log(`Truncated ${t}`);
      } catch (err) {
        // si no existe o falla, mostrar y continuar
        console.warn(`No se pudo truncar ${t}: ${err.message}`);
      }
    }

    // REACTIVAR FK
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    // RUTAS a los JSON (ajusta si tu data está en otra carpeta)
    const dataDir = __dirname + '/data';
    const categoriesPath = dataDir + '/categories.json';
    const productsPath = dataDir + '/products.json';
    const commentsPath = dataDir + '/products_comments.json';

    // ========== CATEGORÍAS ==========
    if (fs.existsSync(categoriesPath)) {
      const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
      for (const cat of categoriesData) {
        const id = cat.id ?? cat.category_id ?? null;
        const name = cat.name ?? cat.category_name ?? null;
        const desc = cat.description ?? null;
        if (id != null && name != null) {
          await conn.query(
            'INSERT INTO Category (category_id, category_name, description) VALUES (?, ?, ?)',
            [id, name, desc]
          );
        }
      }
      console.log('✅ Categorías importadas');
    } else {
      console.warn('categories.json no encontrado en', categoriesPath);
    }

    // ========== PRODUCTOS ==========
    if (fs.existsSync(productsPath)) {
      const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
      for (const prod of productsData) {
        const id = prod.id ?? prod.product_id ?? null;
        const name = prod.name ?? prod.product_name ?? null;
        const description = prod.description ?? '';
        const cost = prod.cost ?? prod.price ?? null;
        const currency = prod.currency ?? 'USD';
        const soldCount = prod.soldCount ?? prod.sold_count ?? 0;
        const category = prod.category ?? prod.category_id ?? null;
        const mainImage = (prod.images && prod.images[0]) || prod.image || null;

        if (id == null || name == null) continue;

        await conn.query(
          'INSERT INTO Products (product_id, product_name, description, cost, currency, soldCount, category_id, main_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [id, name, description, cost, currency, soldCount, category, mainImage]
        );

        // Insertar imágenes si existe array
        const images = prod.images ?? (prod.imagesArray ? prod.imagesArray : null);
        if (Array.isArray(images)) {
          for (let i = 0; i < images.length; i++) {
            const url = images[i];
            await conn.query(
              'INSERT INTO ProductImages (product_id, image_url, position) VALUES (?, ?, ?)',
              [id, url, i]
            );
          }
        } else if (prod.image) {
          // si solo hay campo image
          await conn.query(
            'INSERT INTO ProductImages (product_id, image_url, position) VALUES (?, ?, ?)',
            [id, prod.image, 0]
          );
        }

        // Related products (si existe)
        if (Array.isArray(prod.relatedProducts)) {
          for (const r of prod.relatedProducts) {
            const relatedId = r.id ?? r.product_id ?? null;
            const rName = r.name ?? null;
            const rImage = r.image ?? null;
            if (relatedId != null) {
              await conn.query(
                'INSERT INTO RelatedProducts (product_id, related_product_id, related_name, related_image) VALUES (?, ?, ?, ?)',
                [id, relatedId, rName, rImage]
              );
            }
          }
        }
      }
      console.log('✅ Productos importados');
    } else {
      console.warn('products.json no encontrado en', productsPath);
    }

    // ========== COMENTARIOS ==========
    if (fs.existsSync(commentsPath)) {
      const commentsData = JSON.parse(fs.readFileSync(commentsPath, 'utf8'));

      // Si el JSON es un objeto con claves por productId -> convertir a array
      let commentsArray = [];
      if (Array.isArray(commentsData)) {
        commentsArray = commentsData;
      } else if (typeof commentsData === 'object') {
        // estructura posible: { "1": [...], "2": [...] } o array de objetos con campo product
        // intentamos normalizar:
        for (const k in commentsData) {
          if (Array.isArray(commentsData[k])) {
            for (const c of commentsData[k]) {
              // si c no tiene product, le asignamos la clave k
              const normalized = { ...(c), product: c.product ?? Number(k) };
              commentsArray.push(normalized);
            }
          }
        }
      }

      // Si sigue vacío y hay objetos con producto, tratar como array simple:
      if (commentsArray.length === 0 && Array.isArray(commentsData)) {
        commentsArray = commentsData;
      }

      for (const c of commentsArray) {
        const productId = c.product ?? c.productId ?? c.product_id ?? null;
        const userName = c.user ?? c.userName ?? c.username ?? c.user_name ?? null;
        const score = c.score ?? null;
        const desc = c.description ?? c.comment ?? null;
        const dt = c.dateTime ?? c.datetime ?? null;

        if (productId == null) continue;

        await conn.query(
          'INSERT INTO Comments (product_id, client_id, user_name, score, description, dateTime) VALUES (?, ?, ?, ?, ?, ?)',
          [productId, null, userName, score, desc, dt]
        );
      }
      console.log('✅ Comentarios importados');
    } else {
      console.warn('products_comments.json no encontrado en', commentsPath);
    }

    console.log('🎉 Migración finalizada');
  } catch (err) {
    console.error('❌ Error en migración:', err);
  } finally {
    if (conn) await conn.end();
  }
}

migrateData();