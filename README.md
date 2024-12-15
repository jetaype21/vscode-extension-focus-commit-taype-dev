# 🚀 Proyecto de Análisis Automático de Contexto y Commits 📊

## 📋 **Descripción del Proyecto**
Este proyecto analiza automáticamente un repositorio de software para comprender su estructura, propósito y cambios. Utiliza inteligencia artificial **Gemini AI** para:

1. Generar un **resumen profesional** del contexto del proyecto.
2. Detectar y resumir **cambios** en Git para sugerir mensajes de commit claros y concisos.

---

## 🛠️ **Tecnologías Utilizadas**
- **Node.js** ⚡
- **TypeScript** 📝
- **Gemini AI** (Google Generative AI) 🤖
- **Git** 🧩
- **FS y Path** (Manejo de archivos) 📂

---

## 🌟 **Características Principales**
- 🔍 **Análisis Automático**:
  - Obtiene la estructura de archivos y el contenido clave como `README.md` y `package.json`.
  - Genera un **resumen** claro sobre el propósito del proyecto.

- 🧠 **Uso de Inteligencia Artificial**:
  - Integra **Gemini AI** para procesar y entender el contenido del proyecto.
  - Sugerencias automáticas de **mensajes de commit** basados en cambios detectados.

- 💡 **Fácil Integración**:
  - Adaptable para cualquier proyecto Node.js.
  - Integración potencial con **Git Hooks** para automatizar mensajes de commit.

---

## 🚀 **Cómo Empezar**

### 1️⃣ **Crear una API KEY DE Gemini AI**

1. Registra una cuenta en [Gemini AI](https://aistudio.google.com/app/apikey).
2. Obtén una API KEY.
3. Almacena la api key en las variables de entorno del sistema (ejemplo):

    ```
      setx FOCUS_COMMIT_GEMINI_API_KEY "*****API KEY******"
    ```

### 2️⃣ **Instalar Extensión FOCUS COMMIT**
1. Descarga la extensión **FOCUS COMMIT** desde [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=taype-dev.focus-commit).
2. Ejecuta el comando **FOCUS COMMIT Analizar proyecto**
3. Guardar cambios con **git add**
4. Ejecuta el comando **FOCUS COMMIT Generar mensaje de commit**
5. Copiar mensaje generado en source control