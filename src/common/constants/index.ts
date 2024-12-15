export const IGNORE_DIRS_CONSTANT = [
  "node_modules",
  ".git",
  ".vscode",
  "dist",
  "build",
  "out",
  "target", // Para proyectos de Java, Go, y Rust
  "bin",
  ".idea",
  ".gradle", // Para proyectos de Java y Android
  "__pycache__", // Para proyectos de Python
  ".DS_Store",
  ".env",
  ".env.local",
  "public",
  ".gitignore",
  ".env.example",
  ".env.test",
  ".env.development",
  ".package-lock.json",
  ".npmrc",
  ".gitattributes",
  ".package.json",
  "coverage", // Resultados de pruebas (por ejemplo, Jest)
  ".eslintcache", // Caché de ESLint
  "yarn-error.log", // Log de errores de Yarn
  ".nuxt", // Para proyectos Nuxt.js
  ".next", // Para proyectos Next.js
  ".storybook", // Para proyectos con Storybook
  ".turbo", // Para proyectos con Turborepo
  "tmp",
  "temp",
  "cache", // Directorios temporales
  "logs", // Directorio de logs
  "public/static", // Archivos estáticos
  ".husky", // Configuración de Husky
  "data", // Datos locales o bases de datos
  "yarn.lock", // Archivo de bloqueo de dependencias de Yarn
  ".yarnrc", // Configuración personalizada de Yarn
  ".gitmodules", // Submódulos de Git
  ".babelrc",
  ".babelrc.js",
  ".babelrc.json", // Archivos de configuración de Babel
  ".prettierrc",
  ".prettierrc.json", // Archivos de configuración de Prettier
  ".editorconfig", // Configuración de editor
  ".webpack", // Archivos de configuración de Webpack
  "*.pyc", // Archivos de caché de Python
  ".tox", // Para proyectos Python con Tox
  ".venv",
  "env",
  ".env", // Entornos virtuales Python
  ".mypy_cache", // Caché de mypy
  "target/", // Archivos generados por Maven/Gradle en Java
  ".gradle", // Archivos de configuración de Gradle
  ".idea", // Configuración de JetBrains
  ".classpath",
  ".project",
  ".settings", // Archivos de Eclipse
  ".ruby-version", // Archivos de Ruby
  ".bundle", // Carpeta de Bundler para Ruby
  "Gemfile.lock", // Bloqueo de dependencias de Ruby
  "bin/", // Archivos generados en .NET y Go
  "obj/", // Archivos de objetos en .NET
  "vendor/", // Dependencias en Go
  "target/", // Archivos compilados en Rust
  "assets/",
  "assets",
  ".DS_Store", // Archivos de sistema de archivos macOS
  "CHANGELOG.md",
  "vsc-extension-quickstart.md",
  ".vscodeignore.ts",
  ".vscode-test.mjs",
  "esbuild.js",
  "eslint.config.mjs",
  "eslint.config.js",
  "tailwindcss.config.js",
  "tailwindcss.config.mjs",
  "tailwindcss.config.ts",

  // Ruby
  ".rbenv",
  ".rvm",
  "coverage/",
  "spec/reports/",

  // PHP
  "vendor/",
  "composer.lock",
  ".phpunit.result.cache",
  "phpunit.xml",

  // C/C++
  "cmake-build-*/",
  "CMakeFiles/",
  "CMakeCache.txt",
  "*.a",
  "*.o",
  "*.out",
  ".clang-format",

  // .NET y C#
  "packages/",
  "*.suo",
  "*.user",
  "*.sln.docstates",
  "paket-files/",

  // Elixir
  "_build/",
  "deps/",
  "*.ez",
  "erl_crash.dump",

  // Haskell
  ".stack-work/",
  "*.hi",
  "*.ho",
  "*.o",

  // Swift y Objective-C
  "Pods/",
  "Carthage/",
  "*.dSYM",
  "*.ipa",
  "*.framework",

  // Archivos de configuración de editores adicionales
  ".vimrc",
  ".emacs",
  ".spacemacs",

  // Archivos de logs generales
  "*.log",
  "npm-debug.log*",
  "yarn-debug.log*",
  "error.log",

  // Archivos de entorno y secretos
  "*.pem",
  "*.key",
  ".env.production",
  ".env.staging",

  // Archivos de dependencias
  "pnpm-lock.yaml",
  "bun.lockb",

  // Herramientas de testing y CI/CD
  ".circleci/",
  ".github/",
  ".gitlab-ci.yml",
  "codecov.yml",
  ".travis.yml",

  // Archivos de documentación generados
  "docs/_build/",
  "sphinx-docs/",
  "api-docs/",

  // Archivos de sistema adicionales
  "Thumbs.db", // Windows
  ".AppleDouble", // macOS
  ".LSOverride", // macOS

  // Archivos de compilación y empaquetado
  "*.dmg", // macOS
  "*.app", // macOS
  "*.exe", // Windows
  "*.msi", // Windows
  "*.zip",
  "*.tar.gz",
  "*.vsix",

  // Archivos de IDEs adicionales
  ".vs/", // Visual Studio
  ".fleet/", // JetBrains Fleet
  ".fleet",
];

export const IGNORED_EXTENSIONS_CONSTANT = [
  ".log",
  ".tmp",
  ".bak",
  ".min.js",
  ".map",
];

export const ANALYSIS_FILE_NAME = "project-analysis.json";
export const ENVIRONMENT_API_KEY_NAME = "FOCUS_COMMIT_GEMINI_API_KEY";
