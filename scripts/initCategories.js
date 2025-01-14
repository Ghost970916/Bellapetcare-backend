const mongoose = require('mongoose');
require('dotenv').config();

const Species = require('../models/Species');
const Category = require('../models/Category');

const initialData = {
  species: [
    {
      name: 'Perros',
      slug: 'perros',
      categories: [
        'Adiestramiento',
        'Alimento, Premios y Suplemento',
        'Bebederos y Comederos',
        'Camas y Casas',
        'Estética y Cuidado',
        'Juguetes',
        'Puertas, Rampas y Corrales',
        'Ropa para Perros',
        'Sillas de Ruedas',
        'Viaje y Paseo',
        'Otros'
      ]
    },
    {
      name: 'Gatos',
      slug: 'gatos',
      categories: [
        'Accesorios',
        'Ahuyentadores Ultrasónicos',
        'Alimento, Premios y Suplemento',
        'Bozales',
        'Camas y Cuchas',
        'Comederos',
        'Contenedores de Alimento',
        'Estética y Cuidado',
        'Indumentaria y Accesorios',
        'Juguetes',
        'Puertas y Rampas',
        'Viaje y Paseo',
        'Otros'
      ]
    }
  ]
};

async function initializeCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Crear especies
    for (const speciesData of initialData.species) {
      const species = await Species.findOneAndUpdate(
        { slug: speciesData.slug },
        {
          name: speciesData.name,
          slug: speciesData.slug
        },
        { upsert: true, new: true }
      );

      // Crear categorías para cada especie
      for (const [index, categoryName] of speciesData.categories.entries()) {
        await Category.findOneAndUpdate(
          {
            name: categoryName,
            species: species._id
          },
          {
            name: categoryName,
            slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
            species: species._id,
            order: index
          },
          { upsert: true }
        );
      }
    }

    console.log('Categories initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing categories:', error);
    process.exit(1);
  }
}

initializeCategories();

