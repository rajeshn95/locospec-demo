const Config = require("./config")();
const httpServer = requireHttpServer();
const bootstrapLoco = require("./loco/bootstrap");
const server = httpServer({});

bootstrapLoco(server);

server.listen(
  { port: process.env.PORT || 3000, host: "0.0.0.0" },
  (err, address) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  }
);
