const express = require("express");
const {
    addContract,
    getAllContracts,
    getOwnerContracts,
    getUserContracts,
    getSingleContract,
    updateContract,
    DeleteContract
} = require("../Controller/Contract");

const Router = express.Router();

Router.post("/createContract", addContract);
Router.get("/getAllContracts", getAllContracts);
Router.get("/getOwnerContracts/:id",getOwnerContracts);
Router.get("/getUserContracts/:id", getUserContracts);
Router.get("/getSingleContract/:id",getSingleContract);
Router.put("/updateContract/:id",updateContract);
Router.delete("/DeleteContract/:id",DeleteContract);
module.exports = Router;
