# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  # Trello Clone Frontend
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

    files: ['**/*.{ts,tsx}'],
    extends: [
      reactDom.configs.recommended,
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },

## Data Models (Frontend Types)

The frontend defines TypeScript interfaces in `src/types/database.ts` that mirror the backend Mongoose models:

**Board**
```ts
interface Board {
  id: string;
  title: string;
  description?: string;
  background: { type: 'color' | 'gradient' | 'image'; value: string };
  visibility: 'private' | 'workspace' | 'public';
  isClosed: boolean;
  createdBy: string;
  workspaceId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Column**
```ts
interface Column {
  id: string;
  boardId: string;
  title: string;
  position: number;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Card**
```ts
interface Card {
  id: string;
  columnId: string;
  boardId: string;
  title: string;
  description?: string;
  position: number;
  dueDate?: Date;
  isCompleted: boolean;
  isArchived: boolean;
  coverColor?: string;
  coverAttachmentId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Label**
```ts
interface Label {
  id: string;
  boardId: string;
  name: string;
  color: string;
  createdAt: Date;
}
```

**CardLabel**
```ts
interface CardLabel {
  id: string;
  cardId: string;
  labelId: string;
  createdAt: Date;
}
```
