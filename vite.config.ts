import vinext from 'vinext';
import {cloudflare} from '@cloudflare/vite-plugin';
import {defineConfig,loadEnv} from 'vite';
export default defineConfig(({mode})=>{Object.assign(process.env,loadEnv(mode,process.cwd(),''));return {plugins:[vinext(),cloudflare({viteEnvironment:{name:'rsc',childEnvironments:['ssr']}})],server:{host:'127.0.0.1'}};});
