import { createRequire as _createRequire } from "module";
const __require = _createRequire(import.meta.url);
const express = __require("express");
const app = express();
app.get("/", (req, res) => {
    res.json({ message: "TypeScript Node set up successfully" });
});
app.listen(8000, () => {
    console.log("Server is running at port 8000");
});
//# sourceMappingURL=index.js.map