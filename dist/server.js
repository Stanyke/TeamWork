"use strict";

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express.default)();
var port = process.env.PORT || 3000;
app.get("/", function (req, res) {
  res.send("Hi Prospecting Andelans Hello API this is DevC");
});
app.listen(port, function () {
  return console.log("Server running on port ".concat(port));
});