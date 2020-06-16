const server = require("./server.js");

const port = process.env.PORT || 6006;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
