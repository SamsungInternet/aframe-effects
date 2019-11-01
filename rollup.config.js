import nodeResolve from 'rollup-plugin-node-resolve';

export default [{
  input: 'index.js',
  external: ["AFRAME"],
  globals: {
    "AFRAME" :  "AFRAME"
  },
  plugins: [
    nodeResolve()
  ],
  output: {
    file: 'dist/aframe-effects.js',
    format: 'esm'
  }
}];