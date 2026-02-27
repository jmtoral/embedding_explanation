# Embeddings & Agentes ReAct — Visualización Interactiva

Aplicación web educativa para entender cómo funcionan los tokens, embeddings y agentes ReAct en sistemas RAG. Desarrollada para el equipo AIEx de The Coca-Cola Company.

🌐 **Demo:** https://jmtoral.github.io/embedding_explanation/

---

## SIPOC

| Suppliers | Inputs | Process | Outputs | Customers |
|-----------|--------|---------|---------|-----------|
| Google Fonts CDN | Interacciones del usuario (sliders, clics, botones) | Cálculo de métricas de compresión semántica | Visualización del funnel tokens → vector | Equipo AIEx / Coca-Cola |
| Archivos estáticos locales (`index.html`, `app.js`, `styles.css`) | Tamaño de chunk (50–1,000 tokens) | Renderizado de puntos y distancias en Canvas 2D | Gráfica de dispersión vectorial interactiva | Equipos técnicos y de negocio |
| GitHub Pages (hosting) | Dimensiones del embedding (50–1,536) | Animación de flujo ReAct sobre SVG inline | Simulación de ciclos de razonamiento del agente | Investigadores y desarrolladores |
| | Escenario seleccionado (chunk pequeño vs. grande) | Cálculo de costos de infraestructura (RAM, USD/mes) | Análisis de costo por escenario con medidores | |
| | Clic en canvas (punto de consulta) | | Visualización alternativa standalone (`embeddings-react-viz.html`) | |

---

## Inventario de Tecnologías

| Categoría | Tecnología | Uso en el proyecto |
|-----------|------------|--------------------|
| **Lenguaje** | HTML5 semántico | Estructura de la aplicación, SVG inline para diagrama ReAct |
| **Lenguaje** | CSS3 | Layout (Grid + Flexbox), animaciones, tema oscuro con glassmorphism |
| **Lenguaje** | JavaScript ES6+ (vanilla) | Toda la lógica interactiva, sin frameworks ni dependencias |
| **API del navegador** | Canvas 2D API | Visualización de distancias vectoriales (Tab 2), puntos y clusters |
| **API del navegador** | SVG + `getPointAtLength` | Animación del dot a lo largo del flujo ReAct (Tab 3) |
| **API del navegador** | `requestAnimationFrame` | Animaciones fluidas a 60 fps |
| **Tipografías** | Google Fonts | Inter, Outfit (main site) · Space Mono, Sora (viz alternativa) |
| **Hosting** | GitHub Pages | Despliegue estático desde rama `main` |
| **Control de versiones** | Git / GitHub | Repositorio: `jmtoral/embedding_explanation` |

### Sin dependencias externas de runtime
No hay `package.json`, bundler, transpilador ni framework. Todo corre directamente en el navegador.

---

## Contenido

| Archivo | Descripción |
|---------|-------------|
| `index.html` | Aplicación principal con 4 tabs: Embeddings, Distancia Vectorial, ReAct, Costos |
| `app.js` | Lógica JavaScript (~550 líneas): tabs, Canvas, SVG, simulaciones async |
| `styles.css` | Tema oscuro rojo/negro (The Coca-Cola Company), variables CSS, glassmorphism |
| `embeddings-react-viz.html` | Visualización alternativa standalone con ejemplos del portafolio TCCC |

## Ejecutar localmente

```bash
python -m http.server 8000
# Abrir http://localhost:8000
```
