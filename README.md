# Recipe App 🍽️

Una aplicación móvil React Native con Expo que consume la API de TheMealDB para mostrar recetas de cocina.

## Características

- **Pantalla de Menú**: Lista todas las recetas disponibles que comienzan con la letra 'A'
- **Pantalla de Receta Aleatoria**: Muestra una receta aleatoria al tocar cualquier receta del menú
- **Diseño Atractivo**: Interfaz moderna con gradientes y animaciones
- **Navegación Fluida**: Navegación entre pantallas usando React Navigation
- **Actualización**: Pull-to-refresh en la pantalla del menú

## APIs Utilizadas

1. **Lista de Recetas**: `https://www.themealdb.com/api/json/v1/1/search.php?f=a`
2. **Receta Aleatoria**: `https://www.themealdb.com/api/json/v1/1/random.php`

## Instalación y Configuración

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn
- Expo CLI
- Expo Go app en tu dispositivo móvil

### Pasos de Instalación

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Instalar Expo CLI globalmente** (si no lo tienes):
   ```bash
   npm install -g @expo/cli
   ```

3. **Iniciar el proyecto**:
   ```bash
   npx expo start
   ```

4. **Ejecutar en dispositivo**:
   - Escanea el código QR con la app Expo Go
   - O presiona 'a' para Android emulator
   - O presiona 'i' para iOS simulator

## Estructura del Proyecto

```
recipe-app/
├── App.js                 # Componente principal con navegación
├── screens/
│   ├── MenuScreen.js      # Pantalla del menú de recetas
│   └── RecipeDetailScreen.js # Pantalla de receta aleatoria
├── package.json           # Dependencias del proyecto
├── app.json              # Configuración de Expo
└── babel.config.js       # Configuración de Babel
```

## Funcionalidades

### Pantalla de Menú
- Muestra una lista de recetas con imágenes
- Información de categoría y región
- Pull-to-refresh para actualizar la lista
- Navegación a receta aleatoria al tocar cualquier elemento

### Pantalla de Receta Aleatoria
- Muestra una receta aleatoria completa
- Lista de ingredientes con medidas
- Instrucciones paso a paso
- Enlace a video de YouTube (si está disponible)
- Botón para obtener otra receta aleatoria

## Tecnologías Utilizadas

- **React Native**: Framework para desarrollo móvil
- **Expo**: Plataforma para desarrollo React Native
- **React Navigation**: Navegación entre pantallas
- **Expo Linear Gradient**: Gradientes para diseño atractivo
- **TheMealDB API**: API gratuita de recetas de cocina

## Personalización

El diseño utiliza una paleta de colores moderna con gradientes:
- Colores primarios: #FF6B6B, #667eea, #764ba2
- Gradientes suaves para un look profesional
- Iconos emoji para una interfaz amigable

## Troubleshooting

Si encuentras problemas:

1. **Error de dependencias**: Ejecuta `npm install` o `yarn install`
2. **Problemas de caché**: Ejecuta `npx expo start --clear`
3. **Errores de red**: Verifica tu conexión a internet

## Próximas Mejoras

- Búsqueda por nombre de receta
- Favoritos
- Filtros por categoría y región
- Modo offline
- Compartir recetas

¡Disfruta explorando deliciosas recetas! 🍳👨‍🍳
