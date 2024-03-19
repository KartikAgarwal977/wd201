const app = require("./app");
const PORT = process.env.PORT || 30012;

app.listen(PORT, () => {
  console.log(`Started express server at port ${PORT}`);
});
