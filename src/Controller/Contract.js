const Contract = require("../Model/Contract"); // Make sure this path points to your Contract model
const Property = require("../Model/Property");
const User = require("../Model/User");
const ErrorHandler = require("../Utils/error");

const addContract = async (req, res, next) => {
  try {
    const {
      property,
      user,
      owner,
      startDate,
      endDate,
      monthlyRent,
      deposit,
      status,
    } = req.body;

    const propertyExists = await Property.findById(property);
    const userExists = await User.findById(user);
    const ownerExists = await User.findById(owner);

    if (!propertyExists) {
      return next(ErrorHandler(400, "property not found"));
    }

    if (!userExists) {
      return next(ErrorHandler(400, "user not found"));
    }

    if (!ownerExists) {
      return next(ErrorHandler(400, "owner not found"));
    }

    const newContract = await Contract.create({
      property,
      user,
      owner,
      startDate,
      endDate,
      monthlyRent,
      deposit,
      status,
    });

    res.status(200).json({
      message: "Contract created successfully",
      contract: newContract,
    });
  } catch (error) {
    next(error);
  }
};

const getAllContracts = async (req, res, next) => {
    try {
      const contracts = await Contract.find({});
      if (contracts.length === 0) {
        return next(ErrorHandler(400, "No contracts found"));
      }
      res.status(200).json({
        success: true,
        count: contracts.length,
        contracts,
      });
    } catch (error) {
      next(error);
    }
  };

  const getOwnerContracts = async (req, res, next) => {
    const { id } = req.params;

    try {
      const ownerContracts = await Contract.find({ owner: id }).populate('property').populate('user').populate('owner');

      if (ownerContracts.length === 0) {
        return next(ErrorHandler(404, "No contracts found for this owner"));
      }
  
      res.status(200).json({
        success: true,
        count: ownerContracts.length,
        contracts: ownerContracts,
      });
    } catch (error) {
      next(error);
    }
  };

  const getUserContracts = async (req, res, next) => {
    const { id } = req.params;

    try {
      const userContracts = await Contract.find({ user: id }).populate('property').populate('owner');

      if (userContracts.length === 0) {
        return next(ErrorHandler(404, "you don't have  any contracts"));
      }
  
      res.status(200).json({
        success: true,
        count: userContracts.length,
        contracts: userContracts,
      });
    } catch (error) {
      next(error);
    }
  };

  const getSingleContract = async (req, res, next) => {
    const { id } = req.params;
  
    try {
      const contract = await Contract.findById(id)
        .populate('property')
        .populate('user')
        .populate('owner');
  
      if (!contract) {
        return next(new ErrorHandler(404, "Contract not found"));
      }
  
      res.status(200).json({
        success: true,
        contract,
      });
    } catch (error) {
      next(error);
    }
  };

  const updateContract = async (req, res, next) => {
    const { id } = req.params;
    const { startDate, endDate, monthlyRent, deposit, status } = req.body;
  
    try {
      // Find the contract by ID
      const contract = await Contract.findById(id);
      if (!contract) {
        return next(new ErrorHandler(404, "Contract not found"));
      }
  
      // Update the contract with the new data
      contract.startDate = startDate || contract.startDate;
      contract.endDate = endDate || contract.endDate;
      contract.monthlyRent = monthlyRent || contract.monthlyRent;
      contract.deposit = deposit || contract.deposit;
      contract.status = status || contract.status;
  
      // Save the updated contract
      const updatedContract = await contract.save();

      res.status(200).json({
        success: true,
        contract: updatedContract
      });
  
    } catch (error) {
      next(error);
    }
  };  

  const DeleteContract = async(req, res, next) => {
    const { id } = req.params 
    
    try {
      // Find the contract by ID
      const contract = await Contract.findById(id);
      
      // If the contract does not exist, return an error
      if (!contract) {
        return next(ErrorHandler(404, "Contract not found"));
      }
      // Delete the contract
      const deletedContract = await Contract.findByIdAndDelete(id);
      // Send a success response to the client
      res.status(200).json({
        success: true,
        message: "Contract deleted successfully",
        deletedContract
      });
    } catch (error) {
      next(error);
    }

  };
  
  
module.exports = {
  addContract,
  getAllContracts,
  getOwnerContracts,
  getUserContracts,
  getSingleContract,
  updateContract,
  DeleteContract
};
