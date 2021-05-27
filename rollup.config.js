import sucrase from '@rollup/plugin-sucrase';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';

const production = !process.env.ROLLUP_WATCH;

const plugins = [
  resolve({ extensions: ['.ts', '.js'] }),
  commonjs(),
  sucrase({ transforms: ['typescript'] }),
  terser({ output: { comments: false } }),
];

export default [
  {
    input: ['./minigame/game.ts'],
    treeshake: true,
    output: {
      format: 'cjs',
      dir: 'minigame/',
      chunkFileNames: 'chunks/[name].js',
      entryFileNames: '[name].js',
      manualChunks: {
        'three-platformize': ['three-platformize'],
      },
    },
    plugins,
  },
];
