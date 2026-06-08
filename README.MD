# SwiftTrack Web 📦🚚
> **Sistema Monolítico Modular para el Control Logístico de Paquetería en Tiempo y Forma**

Este repositorio contiene el núcleo base del proyecto **SwiftTrack Web**, desarrollado como solución tecnológica institucional para optimizar el rastreo, asignación y auditoría de guías logísticas de paquetería. 

El sistema mitiga problemáticas críticas de pérdida de información mediante una arquitectura estructurada y controles rigurosos de seguridad informática en el backend.

---

## 🛠️ Tecnologías Utilizadas

* **Entorno de Ejecución:** Node.js
* **Framework Backend:** Express.js (Patrón Monolítico Modular)
* **Motor de Plantillas:** EJS (Server-Side Rendering)
* **Estilos Frontend:** Tailwind CSS

---

## 📦 Arquitectura del Proyecto

El software está organizado bajo una estructura limpia que facilita la trazabilidad de componentes:

* `/views`: Contiene las interfaces dinámicas del sistema (`index.ejs`, `rastreo.ejs`, `error.ejs`).
* `server.js`: Servidor de Express que implementa las rutas HTTP de rastreo y los controladores lógicos.
* `package.json`: Manifiesto de dependencias y scripts automatizados del ciclo de vida del software.

---

## 🚀 Instrucciones de Instalación y Despliegue Local

Siga estos pasos para clonar, instalar dependencias y ejecutar el ecosistema en un entorno local de desarrollo:

### 1. Clonar el repositorio y acceder al directorio
```bash
git clone [https://github.com/TU_USUARIO/SwiftTrack-Web.git](https://github.com/TU_USUARIO/SwiftTrack-Web.git)
cd SwiftTrack-Web