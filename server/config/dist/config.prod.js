"use strict";var urlDB;process.env.PORT=process.env.PORT||3e3,process.env.NODE_ENV=process.env.NODE_ENV||"dev",process.env.CADUCIDAD_TOKEN="48h",process.env.SEED=process.env.SEED||"este-es-el-seed-desarrollo",urlDB="dev"===process.env.NODE_ENV?"mongodb://localhost:27017/cafe":process.env.MONGO_URI,process.env.URLDB=urlDB,process.env.CLIENT_ID=process.env.CLIENT_ID||"538886611473-h6hu0n0klo8b60m403u2aodbo6bekms5.apps.googleusercontent.com";