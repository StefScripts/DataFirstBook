import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    optimizeDeps: {
      include: ['zod', 'react-hook-form', '@hookform/resolvers/zod']
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      commonjsOptions: {
        transformMixedEsModules: true,
        include: [/node_modules/]
      }
    },
    server: {
      port: 5173,
      // Proxy API requests in development only
      proxy:
        mode === 'development'
          ? {
              '/api': 'http://localhost:5000',
              '/uploads': 'http://localhost:5000'
            }
          : undefined
    }
  };
});

// import { defineConfig, loadEnv } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';

// // https://vitejs.dev/config/
// export default defineConfig(({ mode }) => {
//   // Load env file based on `mode` in the current directory.
//   const env = loadEnv(mode, process.cwd(), '');

//   return {
//     plugins: [react()],
//     resolve: {
//       alias: {
//         '@': path.resolve(__dirname, 'src')
//       }
//     },
//     optimizeDeps: {
//       include: ['zod', 'react-hook-form', '@hookform/resolvers/zod']
//     },
//     build: {
//       outDir: 'dist',
//       sourcemap: true,
//       commonjsOptions: {
//         transformMixedEsModules: true,
//         include: [/node_modules/]
//       }
//     },
//     server: {
//       port: 5173,
//       // Proxy API requests in development only
//       proxy:
//         mode === 'development'
//           ? {
//               '/api': 'http://localhost:5000',
//               '/uploads': 'http://localhost:5000'
//             }
//           : undefined,
//       // Specific rewrites for clean URLs
//       fs: {
//         // Allow serving files from the project root
//         allow: ['.']
//       }
//     },
//     // This is the key addition - configure custom handling for static HTML files
//     appType: 'spa', // This is important for SPA behavior
//     // Special handling for static resources
//     experimental: {
//       renderBuiltUrl(filename, { hostType }) {
//         return filename;
//       }
//     }
//   };
// });
