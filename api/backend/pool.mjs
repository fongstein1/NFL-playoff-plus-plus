import {webHandler} from '../../lib/http.mjs';
import {handlePool} from '../../lib/pool-api.mjs';
import {createSheetsStore,sheetsConfigured} from '../../lib/sheets-store.mjs';
export default async function handler(req,res){return webHandler(req,res,r=>handlePool(r,{store:createSheetsStore(),secret:process.env.POOL_SESSION_SECRET,configured:sheetsConfigured()}));}
