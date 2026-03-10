/** @type {import("prettier").Config} */
const config = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '^(react/(.*)$)|^(react$)', // 1. React core
    '^(next/(.*)$)|^(next$)', // 2. Next.js core
    '<THIRD_PARTY_MODULES>', // 3. npm packages
    '^@/(.*)$', // 4. Absolute imports
    '^[../]', // 5. Relative imports (parent)
    '^[./]', // 6. Relative imports (sibling)
    '^.+\\.(css|scss)$', // 7. Stylesheets (จับทั้ง .css และ .scss)
  ],
  importOrderSeparation: true, // เปิดการเว้นบรรทัดระหว่างกลุ่ม (Best Practice)
  importOrderSortSpecifiers: true, // เรียงลำดับในปีกกา { A, B, C }
};

export default config;
