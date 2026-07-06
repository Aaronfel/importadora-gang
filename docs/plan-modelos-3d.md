# Plan: gomitas 3D fotorrealistas (6 protagonistas)

Objetivo: reemplazar los 6 modelos que se ven en primer plano (capítulo: sandía,
dentadura, banana · hero: gusano, huevo frito, osito) por GLB fotorrealistas,
manteniendo scroll-rotación, squish, candy rain y el campo procedural intacto.

---

## Tarea 1 — Referencias

| Sitio | Técnica (verificada en vivo) | Qué tomamos |
|---|---|---|
| [Oryzo AI — Lusion](https://oryzo.ai/) ([case](https://lusion.co/projects/oryzo_ai/)) · SOTM Awwwards abr-2026 | **Modelo 3D real** en WebGL (6 canvas), objeto héroe con peso/inercia física, cámara con profundidad Z real | El estándar de calidad: UN objeto fotorrealista con materiales premium + inercia. Es exactamente nuestra arquitectura (ya tenemos springs + cámara), solo nos falta el asset |
| [Hungry Tiger](https://www.eathungrytiger.com) | **Image sequence** 360° (fotos frame a frame, sin 3D real) | Nada para las gomitas (requiere turntable de fotos). SÍ es el camino ideal para la **bolsa** cuando tengas fotos propias |
| [La Revoltosa](https://larevoltosa.es) | WebGL (1 canvas), producto snack 3D | Mismo enfoque que el nuestro; validación de que candy + WebGL en vivo funciona en producción |
| [SOM Drinks](https://www.drinksom.eu/) ([Awwwards](https://www.awwwards.com/inspiration/product-details-scroll-experience-som)) | **Foto plana** + scroll coreografiado (0 canvas, 0 video) | Dirección de arte de producto gigante en primer plano; demuestra que el realismo del ASSET importa más que la técnica |

**vs. nuestro capítulo pineado**: la arquitectura ya está al nivel (pin + rotación
por scroll + springs). La diferencia con Oryzo es 100% calidad de asset y material
(SSS/azúcar/imperfecciones). No hace falta video ni image sequence: modelo GLB real.

---

## Tarea 2 — Fuente por gomita (mejor camino + plan B)

Marketplaces relevados: [CGTrader gummy](https://www.cgtrader.com/3d-models/gummy) (485 modelos),
[gummy bear](https://www.cgtrader.com/3d-models/gummy-bear), [TurboSquid gummy bear](https://www.turbosquid.com/3d-model/gummy-bear),
[Sketchfab tag gummy](https://sketchfab.com/tags/gummy). Precios observados: gusanos $29,
ositos $11–39, sugar worms $59.

IA generativa: [Meshy](https://www.meshy.ai/pricing) (Pro USD 20/mes, ~1.000 créditos,
licencia comercial en pagos, exporta GLB con PBR; Meshy 6 con quad topology) ·
[Tripo3D](https://www.tripo3d.ai/pricing) (Pro USD 19,90/mes, mejor consistencia
multi-vista según benchmarks 2026). Con TUS fotos sobre cartulina son el input perfecto.

| Gomita | Mejor camino | Plan B |
|---|---|---|
| 🧸 Osito | **Marketplace** (el modelo más común del mundo candy): [Gummy Bear Sugar Candy — CGTrader](https://www.cgtrader.com/3d-models/food/miscellaneous/gummy-bear-sugar-candy) con GLB, o TurboSquid ~$11–39. Royalty-free comercial | Meshy desde foto propia |
| 🪱 Gusano | **Marketplace**: gummy worms $29 / sugar-coated $59 (CGTrader/TurboSquid) — verificar que traiga la textura de azúcar | Meshy desde tu foto (tenés el close-up perfecto de gusanos) |
| 🍌 Banana | **Meshy/Tripo desde TU foto** (el close-up de bananas escarchadas es input ideal: forma simple + grano de azúcar) | Marketplace genérico (escaso) |
| 🍉 Sandía | **Meshy/Tripo desde TU foto** de una watermelon slice real de la bolsa | Photogrammetry scan de watermelon slice (CGTrader, LODs 2K/35K) + retexturizado gummy |
| 🍳 Huevo frito | **Marketplace**: existe "gummy fried eggs" royalty-free en TurboSquid (.blend → exportamos GLB) | Meshy desde tu foto (forma simplísima, alta tasa de éxito) |
| 😬 Dentadura | **Meshy/Tripo desde TU foto** (en marketplaces "denture" = modelos médicos, no candy; es la más difícil de comprar). Geometría chunky y simétrica: caso ideal para IA | Mantener la procedural actual y subirle el realismo solo con material (normal map de azúcar + fake SSS) — ya tiene la forma correcta |

**Fotos para IA (cuando hagas las tuyas)**: UNA gomita por toma, fondo neutro mate
(gris/blanco), luz difusa pareja (sin flash directo), ángulo 3/4, la mayor resolución
posible, y si podés 2-3 ángulos extra de la misma unidad (algunas herramientas aceptan
multi-imagen y mejora mucho).

**Settings Meshy recomendados**: Image to 3D → topology *Quad* → target ~30k polys →
PBR maps ON → luego optimizamos nosotros a 15-25k con gltf-transform.
Prompt de apoyo (para el modo texto o refinado): `single [watermelon slice] gummy candy,
sugar coated, translucent jelly, soft studio light, product photo, centered`.

**Costo estimado total**: Meshy Pro 1 mes (USD 20) + osito (~USD 15–39) + gusano
(~USD 29–59) = **USD 65–120**. Escenario mínimo (todo IA con tus fotos): **USD 20**.
Todo con licencia comercial.

---

## Tarea 3 — Especificación técnica (para que entre sin rework)

**Formato y presupuesto**
- GLB 2.0 único por gomita, comprimido con **Meshopt o Draco** vía `gltf-transform optimize`.
- Polígonos: ≤ **25k tris** por modelo gigante (idealmente 12–20k).
- Texturas PBR: baseColor + normal (el que vende el azúcar) + roughness. **1024px** máx,
  JPEG/WebP dentro del GLB (KTX2 opcional si hiciera falta más).
- Peso: ≤ **1,2 MB por GLB** comprimido → set completo ~**4–7 MB**, dentro del tope de 6–8 MB.
- Pivot centrado, bounding normalizado a ~1 unidad (así `KIND_SCALE` y los springs actuales
  siguen valiendo sin tocar nada).

**Material en runtime**
- El GLB trae los maps; en la GIGANTE los montamos sobre `MeshPhysicalMaterial` con
  `sheen` (azúcar) + `clearcoat` suave. SSS real no hay en three estándar: se fakea con
  baseColor cálido + `emissive` muy leve + rim de luces (ya tenemos Lightformers).
  ⚠️ `transmission` queda prohibido: con canvas alpha se ve negro (ya lo sufrimos).
- Instancias chicas del campo: **misma geometría, material simplificado** (solo baseColor,
  sin normal/roughness) → un clone barato por tipo, cero costo extra de descarga.

**Carga**
- Hero (gusano, huevo, osito): `useGLTF.preload` — están above the fold (~3 MB budget inicial).
- Capítulo (sandía, dentadura, banana): lazy — se disparan cuando el scroll pasa ~25–30%,
  con `<Suspense fallback={procedural actual}>` → si el GLB no llegó, se ve la versión
  procedural de hoy y se swapea al llegar. Progressive enhancement, sin loaders ni flashes.

**Swap 1:1 (por qué no hay rework)**
- `CandyShape`/`FlavorGiants` ya consumen componentes (`<WatermelonMesh/>`, `<TeethMesh/>`…).
- Creamos `src/three/models/` con componentes de la MISMA interfaz (`{ dim }`) que cargan
  el GLB. Un import cambia por tipo; rotación, squish, rain y springs no se tocan.
- Mobile: mismos GLB (el peso ya está optimizado); dpr/candy-count degradan como siempre.

---

## Recomendación

1. Comprar **osito + gusano** en marketplace (los mejores assets candy existentes).
2. Generar **sandía, banana, dentadura y huevo** con Meshy Pro desde tus fotos sobre cartulina
   (1 mes de suscripción alcanza; el huevo tiene además plan A de marketplace).
3. Integración: yo optimizo todo a GLB ≤1,2 MB, monto materiales azúcar/jelly y hago el
   swap 1:1 con fallback procedural.

Presupuesto: **USD 20 (mínimo) a 120 (full marketplace)** + integración de mi lado.
