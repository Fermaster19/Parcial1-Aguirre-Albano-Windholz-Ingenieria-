# Guion de defensa oral — Preguntas incómodas

**Uso:** documento interno del equipo (apoyo en la exposición). No reemplaza el README; lo complementa.  
**Rama de referencia (código):** `rama-AlbanoJulieta` · **Documentación ampliada:** `README.md` en `rama-WindholzCristhian`.

---

## 1. Guion express (2–3 minutos)

| Bloque | Tiempo | Qué decir |
|--------|--------|-----------|
| Apertura | 20 s | CRUD inventario, MVC cliente/servidor, MySQL, patrones Singleton + Strategy + Decorator. |
| Diagrama | 40 s | Navegador → API → Controller → Service → Model → Singleton → MySQL; cada capa una responsabilidad. |
| Singleton | 25 s | Un solo punto de conexión; descartamos pool y conexión por request en este MVP. |
| Decorator (3.3) | 25 s | Etiquetas de stock/marca sin tocar la tabla; descartamos if gigante e herencia. |
| Strategy (3.4) | 25 s | Precio según `?estrategia=`; promoción condicionada a stock ≥ 10. |
| Tests / equipo | 20 s | Jest unitario sin MySQL (5 suites); trabajo por ramas, merge al final. |
| Cierre | 10 s | Invitar demo: `npm start` + `npm test`. |

---

## 2. Preguntas incómodas — Arquitectura y MVC

### «¿Esto es MVC de verdad o solo carpetas con nombres?»

**Respuesta:** Sí hay separación real. En backend: el **controlador** solo maneja HTTP (status, params, JSON); el **servicio** valida y aplica Strategy/Decorator; el **modelo** solo SQL vía Singleton; la **entidad** `Producto` no tiene BD ni reglas de precio. En frontend: `ProductoApiModel` (fetch), `ProductoView` (DOM), `ProductoUIController` (eventos). No es MVC “de libro” con vistas server-side, pero es **MVC aplicado a API REST + SPA vanilla**.

**No decir:** “MVC porque tenemos carpeta controllers”.

---

### «¿Por qué el controlador no llama directo al modelo y listo?»

**Respuesta:** Porque mezclar HTTP + SQL + descuentos en un solo lugar hace que cada cambio (nueva estrategia, nueva validación) rompa todo. El servicio concentra **lógica de negocio**; el modelo solo persiste. Si mañana agregamos otro canal (app móvil), reutilizamos servicio y modelo sin duplicar reglas en el controlador.

**No decir:** “Porque el profe lo pidió” (sin explicar acoplamiento).

---

### «¿Dónde está la Vista en el backend?»

**Respuesta:** En una API REST la “vista” es la **representación JSON** que devuelve el controlador; no hay HTML en el servidor. La vista visual está en el **frontend** (`ProductoView`). Eso es habitual en MVC con SPA.

---

### «El frontend también escribe HTML en el controlador / viola MVC»

**Respuesta:** Corregimos eso: el controlador UI **no** debe usar `innerHTML` en nodos de la vista. Los mensajes de error de lista van a `ProductoView.mostrarMensajeLista()`. La vista es la **única dueña del DOM**; el controlador solo delega datos y eventos.

**Si preguntan por `mostrarResultadoBusqueda(html)`:** el HTML de búsqueda lo arma el controlador hoy; lo ideal a futuro sería un método de vista `renderizarDetalleBusqueda(datos)`. Reconocer la mejora sin negar el patrón general.

---

## 3. Preguntas incómodas — Patrones

### «Singleton en Node no es un antipatrón / no es thread-safe?»

**Respuesta:** En Node un solo hilo de event loop; el riesgo no es el de Java con threads, sino **abrir muchas conexiones MySQL**. Singleton acota eso en un MVP. En producción con mucha concurrencia usaríamos **pool** (`createPool`), documentado en README como trade-off consciente.

**No decir:** “Singleton es siempre la mejor opción”.

---

### «¿No es solo una variable global disfrazada?»

**Respuesta:** La diferencia es **control de acceso**: solo `DatabaseSingleton.obtenerInstancia()` y `consultar()`; el resto del código no crea `createConnection()` suelto. Hay un contrato único de configuración (host, user, database).

---

### «Decorator vs Strategy — ¿no es lo mismo, if disfrazado?»

**Respuesta:** No. **Strategy** cambia el **algoritmo de precio** (lista / mayorista / promoción) en runtime, intercambiable por `PrecioContexto`. **Decorator** **extiende la descripción** (texto mostrado) en capas sin modificar `Producto` ni la tabla. Uno calcula número; otro enriquece presentación.

---

### «¿Por qué no usaron Factory / Repository / Observer?»

**Respuesta:** La consigna pedía **tres patrones concretos** aplicados a problemas reales del dominio. Repository podría envolver el modelo, pero duplicaría `ProductoModel` sin ganancia en este alcance. Elegimos patrones que resuelven **conexión única**, **precio variable** y **etiquetas composables**.

---

### «La promoción con stock ≥ 10 — ¿no es regla de negocio en el Strategy y también en el Decorator?»

**Respuesta:** En Strategy, `stock >= 10` **habilita el descuento del 25 %**. En Decorator, `stock < 5` es **alerta visual**, regla distinta. Mismo campo `stock`, **semánticas diferentes**; por eso viven en capas distintas.

---

### «¿Qué pasa si mando `?estrategia=hack` o SQL injection?»

**Respuesta:** Estrategia desconocida → `PrecioContexto` cae en **lista** por defecto. SQL usa **consultas parametrizadas** en el modelo (`consultar(sql, parametros)`), no concatenamos input del usuario en el SQL. Validación de campos en servicio (`ValidationError` → 400). No es seguridad enterprise, pero evitamos los errores básicos del parcial.

---

## 4. Preguntas incómodas — Tests

### «¿Los tests prueban la app o solo juegan con clases aisladas?»

**Respuesta:** Son **unitarios**: Strategy, Decorator y validaciones del servicio **sin MySQL**. Eso es intencional: prueban reglas de negocio rápido y repetible. La integración completa se demuestra con **`npm start`** + CRUD manual o, si el profe pide, tests E2E (no están en el alcance del MVP).

---

### «¿Por qué `npm test` no levanta la base?»

**Respuesta:** Para no depender de XAMPP en CI ni en la máquina del corrector. Si testeamos el modelo contra BD real, hay que **mockear** `DatabaseSingleton` — está documentado en el README.

---

### «¿Quién hizo los tests?»

**Respuesta:** **Albano Julieta** en `rama-AlbanoJulieta` (Jest, 5 archivos en `__tests__/`). El resto del equipo documenta y valida con `npm test` tras el merge.

---

## 5. Preguntas incómodas — Git y trabajo en equipo

### «¿Por qué tres ramas si al final es un solo proyecto?»

**Respuesta:** El profesor pidió **entrega individual por integrante**; cada uno trabaja en su rama (`rama-AguirreClaudio`, `rama-AlbanoJulieta`, `rama-WindholzCristhian`) y al final **unificamos** sin borrar el trabajo del otro en su rama remota.

---

### «¿Ustedes mergearon antes de tiempo / pisaron el README de Julieta?»

**Respuesta:** La rama de **Julieta en remoto sigue con su `README.Md`**. En la rama de **Cristhian** documentamos en `README.md` (diagrama, patrones 3.3/3.4, guías) como aporte individual; al merge final se integra **un** README sin duplicar nombres (`README.md` en GitHub).

**No decir:** “Borré el trabajo de Julieta en su rama” (falso si no hubo push a su rama).

---

### «¿Por qué el historial tiene merges con historias no relacionadas?»

**Respuesta:** Las ramas arrancaron del mismo `first commit` pero evolucionaron en paralelo; al integrar usamos merge con historial completo para reflejar **≥3 autores** y commits reales del equipo. La alternativa sería rebase squash, pero perderíamos trazabilidad por persona.

---

### «¿Qué hizo cada uno exactamente?»

| Persona | Rama | Aporte principal |
|---------|------|------------------|
| Claudio Aguirre | `rama-AguirreClaudio` | Backend/frontend MVC, API, patrones, `server.js`, `src/` |
| Julieta Albano | `rama-AlbanoJulieta` | Tests Jest, validaciones, rama código más actualizada |
| Cristhian Windholz | `rama-WindholzCristhian` | `README.md`, diagrama, justificación 3.3/3.4, guías install/run/test, este apéndice |

---

## 6. Preguntas incómodas — Producción y límites del MVP

### «¿Esto está listo para producción?»

**Respuesta:** **No.** Es un MVP pedagógico: conexión única (no pool), sin auth, sin rate limit, sin variables de entorno obligatorias. Sabemos los límites y los documentamos (Singleton vs pool, tests unitarios vs E2E).

---

### «¿Por qué credenciales en código en `DatabaseSingleton`?»

**Respuesta:** Entorno local XAMPP (`root` sin password) para la materia. En producción usaríamos `.env` y secretos fuera del repo. Lo mencionamos en README en la sección de BD.

---

### «¿Y si dos usuarios editan el mismo producto?»

**Respuesta:** No hay control de concurrencia optimista/pesimista; última escritura gana. Fuera del alcance del parcial; habría que agregar versión o timestamps en la tabla.

---

## 7. Preguntas incómodas — Demo en vivo

### «Mostrame un producto con promoción y stock bajo a la vez»

**Respuesta (demo):** Crear producto marca **LG**, precio 1000, **stock 3**. Con `estrategia=promocion`: precio calculado **sin** 25 % (stock &lt; 10), descripción con **STOCK BAJO** y **MARCA PREMIUM**. Con stock 15 y misma estrategia: precio × 0,75 y mismas etiquetas según reglas.

---

### «Falló MySQL en la demo»

**Respuesta:** Verificar XAMPP, base `tienda`, tabla `productos`, credenciales en `DatabaseSingleton`. Mientras tanto explicar flujo con diagrama y `npm test` (no requiere BD).

---

## 8. Frases que suenan bien (cierre)

- *“El diagrama no es decoración: cada flecha es una capa que no debe saltarse.”*
- *“Elegimos cada patrón por un problema del inventario, no porque estaba en la slides.”*
- *“Los tests prueban reglas; la demo con XAMPP prueba que persiste.”*
- *“Mi entrega individual es la documentación defendible; el código de referencia está en la rama de Julieta hasta el merge final.”*

---

## 9. Checklist antes de entrar al oral

- [ ] Ensayar guion §1 sin leer.
- [ ] Tener abierto diagrama README §2 o repo en GitHub.
- [ ] Saber responder **pool vs Singleton** y **Decorator vs Strategy**.
- [ ] Saber qué hizo cada compañero (§5 del README).
- [ ] Probar `npm test` y `npm start` la noche anterior (XAMPP + Node).
- [ ] Si preguntan MVC frontend: mencionar `mostrarMensajeLista` y vista dueña del DOM.
