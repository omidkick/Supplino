// controllers/support/support.controller.js
const createHttpError = require("http-errors");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { SupportModel } = require("../../../models/support");
const { UserModel } = require("../../../models/user");
const Controller = require("../controller");

class SupportController extends Controller {
  // USER: Create a new support ticket
  async createTicket(req, res) {
    const user = req.user;
    const { title, description, category, priority } = req.body;

    if (!title || !description) {
      throw createHttpError.BadRequest("عنوان و توضیحات الزامی است");
    }

    const ticket = await SupportModel.create({
      user: user._id,
      title,
      description,
      category: category || "general",
      priority: priority || "medium",
      messages: [{
        user: user._id,
        message: description,
        isAdmin: false,
        createdAt: new Date()
      }]
    });

    const populatedTicket = await SupportModel.findById(ticket._id)
      .populate({
        path: "user",
        select: "name email phoneNumber isActive avatar"
      })
      .populate({
        path: "messages.user",
        select: "name email phoneNumber isActive avatar"
      });

    // Transform user data to include avatarUrl
    const transformedTicket = this.transformTicketWithUser(populatedTicket);

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: "تیکت پشتیبانی با موفقیت ایجاد شد",
        ticket: transformedTicket
      }
    });
  }

  // USER: Get user's own tickets
  async getUserTickets(req, res) {
    const user = req.user;
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const filter = { user: user._id };
    if (status) filter.status = status;

    const tickets = await SupportModel.find(filter)
      .populate({
        path: "user",
        select: "name email phoneNumber isActive avatar"
      })
      .populate({
        path: "messages.user",
        select: "name email phoneNumber isActive avatar"
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await SupportModel.countDocuments(filter);

    // Transform tickets to include avatarUrl
    const transformedTickets = tickets.map(ticket => 
      this.transformTicketWithUser(ticket)
    );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        tickets: transformedTickets,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  }

  // USER: Get single ticket
  async getTicket(req, res) {
    const user = req.user;
    const { id } = req.params;

    const ticket = await SupportModel.findOne({
      _id: id,
      user: user._id
    })
      .populate({
        path: "user",
        select: "name email phoneNumber isActive avatar"
      })
      .populate({
        path: "messages.user",
        select: "name email phoneNumber isActive avatar"
      });

    if (!ticket) {
      throw createHttpError.NotFound("تیکت یافت نشد");
    }

    const transformedTicket = this.transformTicketWithUser(ticket);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: { ticket: transformedTicket }
    });
  }

  // USER: Add reply to ticket
  async addReply(req, res) {
    const user = req.user;
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
      throw createHttpError.BadRequest("پیام الزامی است");
    }

    const ticket = await SupportModel.findOne({
      _id: id,
      user: user._id
    });

    if (!ticket) {
      throw createHttpError.NotFound("تیکت یافت نشد");
    }

    if (ticket.status === "closed" || ticket.status === "resolved") {
      throw createHttpError.BadRequest("این تیکت بسته شده است");
    }

    ticket.messages.push({
      user: user._id,
      message,
      isAdmin: false,
      createdAt: new Date()
    });

    ticket.updatedAt = new Date();
    await ticket.save();

    const populatedTicket = await SupportModel.findById(ticket._id)
      .populate({
        path: "user",
        select: "name email phoneNumber isActive avatar"
      })
      .populate({
        path: "messages.user",
        select: "name email phoneNumber isActive avatar"
      });

    const transformedTicket = this.transformTicketWithUser(populatedTicket);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "پاسخ شما با موفقیت اضافه شد",
        ticket: transformedTicket
      }
    });
  }

  // ADMIN: Get all tickets
  async getAllTickets(req, res) {
    const { page = 1, limit = 20, status, priority, category, search } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const tickets = await SupportModel.find(filter)
      .populate({
        path: "user",
        select: "name email phoneNumber isActive avatar"
      })
      .populate({
        path: "messages.user",
        select: "name email phoneNumber isActive avatar"
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await SupportModel.countDocuments(filter);

    // Transform tickets to include avatarUrl
    const transformedTickets = tickets.map(ticket => 
      this.transformTicketWithUser(ticket)
    );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        tickets: transformedTickets,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  }

  // ADMIN: Get single ticket
  async getAdminTicket(req, res) {
    const { id } = req.params;

    const ticket = await SupportModel.findById(id)
      .populate({
        path: "user",
        select: "name email phoneNumber isActive avatar"
      })
      .populate({
        path: "messages.user",
        select: "name email phoneNumber isActive avatar"
      });

    if (!ticket) {
      throw createHttpError.NotFound("تیکت یافت نشد");
    }

    const transformedTicket = this.transformTicketWithUser(ticket);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: { ticket: transformedTicket }
    });
  }

  // ADMIN: Add admin reply
  async addAdminReply(req, res) {
    const admin = req.user;
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
      throw createHttpError.BadRequest("پیام الزامی است");
    }

    const ticket = await SupportModel.findById(id);

    if (!ticket) {
      throw createHttpError.NotFound("تیکت یافت نشد");
    }

    ticket.messages.push({
      user: admin._id,
      message,
      isAdmin: true,
      createdAt: new Date()
    });

    // Update status if it was open
    if (ticket.status === "open") {
      ticket.status = "in_progress";
    }

    ticket.updatedAt = new Date();
    await ticket.save();

    const populatedTicket = await SupportModel.findById(ticket._id)
      .populate({
        path: "user",
        select: "name email phoneNumber isActive avatar"
      })
      .populate({
        path: "messages.user",
        select: "name email phoneNumber isActive avatar"
      });

    const transformedTicket = this.transformTicketWithUser(populatedTicket);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "پاسخ ادمین با موفقیت اضافه شد",
        ticket: transformedTicket
      }
    });
  }

  // ADMIN: Update ticket status
  async updateTicketStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["open", "in_progress", "resolved", "closed"];
    if (!validStatuses.includes(status)) {
      throw createHttpError.BadRequest("وضعیت نامعتبر است");
    }

    const updateData = { status, updatedAt: new Date() };
    
    if (status === "resolved" || status === "closed") {
      updateData.resolvedAt = new Date();
    }

    const ticket = await SupportModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
      .populate({
        path: "user",
        select: "name email phoneNumber isActive avatar"
      })
      .populate({
        path: "messages.user",
        select: "name email phoneNumber isActive avatar"
      });

    if (!ticket) {
      throw createHttpError.NotFound("تیکت یافت نشد");
    }

    const transformedTicket = this.transformTicketWithUser(ticket);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "وضعیت تیکت با موفقیت به‌روزرسانی شد",
        ticket: transformedTicket
      }
    });
  }

  // ADMIN: Get ticket statistics
  async getTicketStats(req, res) {
    const stats = await SupportModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await SupportModel.countDocuments();
    const open = await SupportModel.countDocuments({ status: "open" });
    const inProgress = await SupportModel.countDocuments({ status: "in_progress" });
    const resolved = await SupportModel.countDocuments({ status: "resolved" });
    const closed = await SupportModel.countDocuments({ status: "closed" });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        total,
        open,
        inProgress,
        resolved,
        closed,
        stats
      }
    });
  }

  // Delete
async deleteTicket(req, res) {
  const user = req.user;
  const { id } = req.params;

  const ticket = await SupportModel.findOne({
    _id: id,
    user: user._id
  });

  if (!ticket) {
    throw createHttpError.NotFound("تیکت یافت نشد");
  }

  await SupportModel.findByIdAndDelete(id);

  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    data: {
      message: "تیکت با موفقیت حذف شد"
    }
  });
}

//  markMessagesAsRead method:

async markMessagesAsRead(req, res) {
  const user = req.user;
  const { id } = req.params;

  let ticket;
  
  // Check if user is admin
  const isAdmin = user.role === 'ADMIN' || user.role === 'admin'; 
  
  if (isAdmin) {
    // Admin is viewing - mark user messages as read for admin
    ticket = await SupportModel.findById(id);
    if (ticket) {
      ticket.messages.forEach(message => {
        if (!message.isAdmin) { // User messages
          message.isReadByAdmin = true;
        }
      });
      await ticket.save();
    }
  } else {
    // User is viewing - mark admin messages as read for user
    ticket = await SupportModel.findOne({
      _id: id,
      user: user._id
    });
    if (ticket) {
      ticket.messages.forEach(message => {
        if (message.isAdmin) { // Admin messages
          message.isReadByUser = true;
        }
      });
      await ticket.save();
    }
  }

  if (!ticket) {
    throw createHttpError.NotFound("تیکت یافت نشد");
  }

  const populatedTicket = await SupportModel.findById(ticket._id)
    .populate({
      path: "user",
      select: "name email phoneNumber isActive avatar"
    })
    .populate({
      path: "messages.user",
      select: "name email phoneNumber isActive avatar"
    });

  const transformedTicket = this.transformTicketWithUser(populatedTicket);

  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    data: {
      message: "پیام‌ها به عنوان خوانده شده علامت گذاری شدند",
      ticket: transformedTicket
    }
  });
}
  // Helper method to transform user data and add avatarUrl
  transformTicketWithUser(ticket) {
    const transformUser = (user) => {
      if (!user) return null;
      
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isActive: user.isActive,
        avatarUrl: user.avatar ? `${process.env.SERVER_URL}/${user.avatar}` : null
      };
    };

    // Transform main user
    const transformedUser = transformUser(ticket.user);
    
    // Transform message users
    const transformedMessages = ticket.messages.map(message => ({
      ...message.toObject(),
      user: transformUser(message.user)
    }));

    return {
      ...ticket.toObject(),
      user: transformedUser,
      messages: transformedMessages
    };
  }
}

module.exports = {
  SupportController: new SupportController()
};