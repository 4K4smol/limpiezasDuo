# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Project structure

The `src/` folder is organised by modules to keep pages and related components
together:

```
src/
├── assets/
├── components/       # Shared UI components
├── contexts/
├── hooks/
├── modules/
│   ├── landing/
│   │   ├── components/
│   │   └── pages/
│   ├── auth/
│   │   └── pages/
│   ├── clientes/
│   │   └── pages/
│   ├── inventario/
│   │   ├── components/
│   │   └── pages/
│   ├── ordenesTrabajo/
│   │   ├── components/
│   │   └── pages/
│   └── serviciosPeriodicos/
│       ├── components/
│       └── pages/
├── router/
├── services/
└── utils/
```

Each module groups its pages, components and any future hooks or API helpers,
keeping the codebase maintainable as it grows.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
