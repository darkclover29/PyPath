import vinext from 'vinext';
import {defineConfig,loadEnv} from 'vite';
export default defineConfig(({mode})=>{Object.assign(process.env,loadEnv(mode,process.cwd(),''));return {plugins:[vinext()],server:{host:'127.0.0.1'}};});
