const Bill = require("../Model/BillsSchema");
const Property = require("../Model/Property");
const User = require("../Model/User");
const ErrorHandler = require("../Utils/error");

const AddNewBooking = async (req, res, next) => {
  const { property, user, owner, amount, utilities, dueDate, Description } =
    req.body;

  try {
    // Validate fields
    if (!property || !user || !owner || !amount || !utilities || !dueDate || !Description) {
      return next(ErrorHandler(400, "All required fields must be provided"));
    }
    const propertyExists = await Property.findById(property);
    const userExists = await User.findById(user);
    const ownerExists = await User.findById(owner);

    if (!propertyExists) {
      return next(ErrorHandler(400, "Property not found"));
    }

    if (!userExists) {
      return next(ErrorHandler(400, "User not found"));
    }

    if (!ownerExists) {
      return next(ErrorHandler(400, "Owner not found"));
    }

    // Calculate total amount
    const amountNum = parseFloat(amount) || 0;
    const utilitiesNum = parseFloat(utilities) || 0;

    const userTotal = amountNum + utilitiesNum;

    // Create new bill
    const bill = await Bill.create({
      property,
      user,
      owner,
      amount,
      utilities,
      total: userTotal,
      dueDate,
      Description
    });

    // Send response
    res.status(200).json({
      success: true,
      message: "New Bill added successfully",
      bill,
    });
  } catch (error) {
    next(error);
  }
};

const getAllBills = async (req, res, next) => {
  try {
    const bills = await Bill.find({})
      .populate('property')
      .populate('owner') 
      .populate('user'); 

    if (!bills) {
      return next(ErrorHandler(400, "No bills found"));
    }

    res.status(200).json({
      success: true,
      count: bills.length,
      bill: bills,
    });
  } catch (error) {
    next(error);
  }
};


const getSingleBill = async (req, res, next) => {
    const { id } = req.params;
    try {
        const bill = await Bill.findById(id).populate('property').populate('owner').populate('user');
        if (!bill) {
            return next(ErrorHandler(404, "Bill not found"));
        }
        res.status(200).json({
            success: true,
            bill,
        });
    } catch (error) {
        next(error);
    }
}

const updateBill = async (req, res, next) => {
  
    try {
        const { status, paymentDate, paymentMethod } = req.body;
        const { id } = req.params;
    
        
        if (!status || !paymentDate || !paymentMethod) {
          return next(ErrorHandler(404, "Missing required fields"));

        }
    
        const updatedBill = await Bill.findByIdAndUpdate(
          id,
          {
            $set: {
              status,
              paymentDate: new Date(paymentDate),
              paymentMethod,
            },
          },
          { new: true }
        );
    
        if (!updatedBill) {
          return next(ErrorHandler(404, "Bill not found"));

        }

        res.status(200).json({
            success: true,
            message: "Bill updated successfully",
            bill: updatedBill,
        }); 
  } catch (error) {
    next(error);
  }
};

const getUserBills = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userBills = await Bill.find({ user: id })
            .populate('property')
            .populate('owner')
            .populate('user');

        if (!userBills || userBills.length === 0) {
            return next(ErrorHandler(404, "No bills found for this user"));
        }
        res.status(200).json({
            success: true,
            count: userBills.length,
            bills: userBills,
        });

    } catch (error) {
        next(error);
    }
};

const updateUserBills = async (req, res, next) => {
    const { id } = req.params;
    try {
        const { paymentMethod } = req.body;

        // Check if the required field is provided
        if (!paymentMethod) {
            return next(ErrorHandler(400, "Missing required field: paymentMethod"));
        }

        // Find the bill by ID
        const bill = await Bill.findById(id);

        if (!bill) {
            return next(ErrorHandler(404, "Bill not found"));
        }

        // Update the bill with payment method, status, and payment date
        bill.paymentMethod = paymentMethod;
        bill.status = 'Paid';
        bill.paymentDate = new Date();

        // Save the updated bill
        await bill.save();

        res.status(200).json({
            success: true,
            message: "Bill updated successfully",
            bill
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
  AddNewBooking,
  getAllBills,
  getSingleBill,
  updateBill,
  getUserBills,
  updateUserBills
};
