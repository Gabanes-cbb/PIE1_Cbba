# PIE-1 · Polígono de Innovación Económica
**UNIFRANZ · IPEE Sede Cochabamba · Distrito 12 · Adela Zamudio**

Sitio web interactivo con tres secciones:
1. 📋 **Marco Metodológico** — Presentación interactiva del levantamiento territorial
2. 📊 **Caracterización Socioeconómica** — Análisis del Censo INE 2024
3. 🗺 **Mapeo Territorial** — Mapa INE + Mapa interactivo de actividades (KML)

---

## 🚀 Cómo publicar en GitHub Pages (paso a paso)

### Paso 1 — Crear el repositorio en GitHub

1. Ingresa a [github.com](https://github.com) con tu cuenta
2. Haz clic en **"New repository"** (botón verde, arriba a la derecha)
3. Configura así:
   - **Repository name:** `pie1-cochabamba` (o el nombre que prefieras)
   - **Visibility:** Public ✅ (necesario para GitHub Pages gratis)
   - **Initialize:** Marca "Add a README file"
4. Clic en **"Create repository"**

---

### Paso 2 — Subir los archivos

**Opción A — Desde el navegador (más fácil):**

1. En tu repositorio, haz clic en **"Add file" → "Upload files"**
2. Arrastra **todos** los archivos y carpetas de este proyecto:
   ```
   index.html
   css/
     main.css
   js/
     main.js
   assets/          ← carpeta vacía por ahora
   data/            ← carpeta vacía por ahora
   ```
3. Escribe un mensaje como: `Primer commit — sitio PIE-1`
4. Clic en **"Commit changes"**

> ⚠️ GitHub no permite subir carpetas vacías. Crea un archivo `.gitkeep` dentro de `assets/` y `data/` para subirlas.

**Opción B — Con Git (si lo tienes instalado):**
```bash
git init
git add .
git commit -m "Primer commit — sitio PIE-1"
git remote add origin https://github.com/TU_USUARIO/pie1-cochabamba.git
git push -u origin main
```

---

### Paso 3 — Activar GitHub Pages

1. En tu repositorio, ve a **Settings** (engranaje arriba a la derecha)
2. En el menú lateral izquierdo, busca **"Pages"**
3. En la sección **"Source"**, selecciona:
   - Branch: **main**
   - Folder: **/ (root)**
4. Clic en **"Save"**
5. Espera 2–3 minutos
6. GitHub te mostrará la URL de tu sitio:
   ```
   https://TU_USUARIO.github.io/pie1-cochabamba/
   ```

---

## 📁 Cómo agregar los archivos de mapas

### Mapa INE (PDF del polígono)

1. Renombra tu archivo PDF del mapa INE a: `mapa_ine_pie1.pdf`
2. Súbelo a la carpeta `assets/` del repositorio:
   - Ve a la carpeta `assets/` en GitHub
   - Clic en **"Add file" → "Upload files"**
   - Sube el archivo `mapa_ine_pie1.pdf`
3. El sitio lo cargará automáticamente en la sección "Mapa INE"

### Mapa de actividades económicas (KML)

**Opción 1 — Carga manual desde el navegador (sin subir a GitHub):**
- En la sección "Mapeo de Actividades", haz clic en **"📂 Cargar archivo KML"**
- Selecciona tu archivo `.kml` desde tu computadora
- Los puntos aparecerán automáticamente en el mapa

**Opción 2 — Incluir el KML en el repositorio (recomendado):**
1. Renombra tu archivo a: `pie1_mapeo.kml`
2. Súbelo a la carpeta `data/` del repositorio
3. El mapa lo cargará automáticamente

> **¿KML o KMZ?** Usa el **KML**. KMZ es un KML comprimido (ZIP) — el navegador no puede abrirlo directamente. Si solo tienes KMZ, puedes descomprimirlo cambiando la extensión a `.zip` y extrayendo el archivo `doc.kml`.

---

## 📂 Estructura de archivos

```
pie1-cochabamba/
├── index.html              ← Página principal
├── css/
│   └── main.css            ← Estilos
├── js/
│   └── main.js             ← Interactividad, mapa, KML
├── assets/
│   └── mapa_ine_pie1.pdf   ← PDF del mapa INE (debes subir)
├── data/
│   └── pie1_mapeo.kml      ← KML de actividades (debes subir)
└── README.md               ← Este archivo
```

---

## 🔧 Personalización

### Cambiar el nombre del repositorio en la URL
Si tu repositorio se llama diferente a `pie1-cochabamba`, no cambia nada — el sitio funciona igual. La URL será `https://TU_USUARIO.github.io/NOMBRE_REPOSITORIO/`.

### Agregar tu propio dominio (opcional)
Si tienes un dominio propio (ej: `pie1.unifranz.edu.bo`):
1. En GitHub → Settings → Pages → "Custom domain"
2. Escribe tu dominio y guarda
3. Configura el DNS de tu dominio con un registro CNAME apuntando a `TU_USUARIO.github.io`

---

## 📋 Secciones del sitio

| Sección | Contenido |
|---------|-----------|
| **Hero** | Presentación, KPIs principales, los 5 ejes |
| **01 Marco Metodológico** | Slideshow de 8 diapositivas: qué es PIE-1, área de estudio, diseño metodológico, universo de actores, formulario KoboToolbox, 3 etapas de mapeo, equipo y roles, productos |
| **02 Caracterización Socioeconómica** | KPIs + 7 pestañas: Población, Educación, Salud, Economía, Vivienda, NSE, Buyer Personas |
| **03 Mapeo Territorial** | Mapa INE (PDF) + Mapa interactivo Leaflet con filtros por tipo de actor y carga de KML |

---

## 🛠 Tecnologías

- HTML5 + CSS3 + JavaScript vanilla (sin frameworks)
- [Leaflet.js](https://leafletjs.com/) v1.9.4 — mapa interactivo
- [OpenStreetMap](https://openstreetmap.org/) — tiles del mapa base
- Fuentes: DM Serif Display + DM Sans (Google Fonts)
- Compatible con todos los navegadores modernos

---

## 📊 Fuentes de datos

- **Instituto Nacional de Estadística (INE) Bolivia** — Censo de Población y Vivienda 2024
- **Viceministerio de Autonomías** — Límites territoriales Decreto Supremo 5050
- **Marco Metodológico PIE-1** — UNIFRANZ IPEE Cochabamba, Gabriela Sanjines, Marzo 2026

---

*Uso geoestadístico e informativo. Los datos del censo son de carácter referencial.*
