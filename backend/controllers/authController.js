const User = require("../models/User");
const Otp = require("../models/Otp");
const Goal = require("../models/Goal");
const Festival = require("../models/Festival");
const BankAccount = require("../models/BankAccount");
const Holding = require("../models/Holding");
const InstitutionalHolding = require("../models/InstitutionalHolding");
const TreasuryAccount = require("../models/TreasuryAccount");
const TeamMember = require("../models/TeamMember");
const FamilyMember = require("../models/FamilyMember");
const FamilyGoal = require("../models/FamilyGoal");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendOtpEmail } = require("../utils/sendEmail");

const JWT_SECRET = process.env.JWT_SECRET || "clarity_secret_key_2025";
const JWT_EXPIRES = "7d";

// Simple email format validator
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Generate a cryptographically-sufficient 6-digit OTP */
const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

/** OTP validity window (ms) */
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

/** Max wrong attempts before the OTP is invalidated */
const MAX_OTP_ATTEMPTS = 5;

/** Minimum gap between resend requests (ms) */
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds

const signToken = (id, role) =>
  jwt.sign({ id, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

// ── POST /api/auth/signup ──────────────────────────────────────────────────
// Step 1: Validate → hash password → send OTP. User is NOT created yet.
const signup = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // ── Validation ──
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ── Check if already a verified user ──
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ error: "Email is already registered." });
    }

    // ── Rate-limit: check resend cooldown ──
    const existingOtp = await Otp.findOne({ email: normalizedEmail });
    if (existingOtp) {
      const elapsed = Date.now() - new Date(existingOtp.createdAt).getTime();
      if (elapsed < RESEND_COOLDOWN_MS) {
        const waitSec = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
        return res.status(429).json({
          error: `Please wait ${waitSec}s before requesting a new OTP.`,
        });
      }
    }

    // ── Hash password before temporary storage ──
    const passwordHash = await bcrypt.hash(password, 12);

    // ── Generate OTP ──
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);

    // ── Remove any old pending OTP for this email, then create fresh one ──
    await Otp.deleteOne({ email: normalizedEmail });
    const saved = await Otp.create({
      email: normalizedEmail,
      otp,
      userData: { name: name.trim(), phone: phone.trim(), passwordHash, role: role || "user" },
      attempts: 0,
      expiresAt,
      createdAt: new Date(),
    });

    console.log(`[OTP] Stored for ${normalizedEmail} | OTP: ${otp} | expiresAt: ${expiresAt} | _id: ${saved._id}`);

    // ── Send OTP email ──
    await sendOtpEmail(normalizedEmail, otp);

    return res.status(200).json({
      message: "OTP sent to your email. Please verify to complete registration.",
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error during signup." });
  }
};

// ── POST /api/auth/verify-otp ──────────────────────────────────────────────
// Step 2: Validate OTP → create user → delete OTP record.
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otpRecord = await Otp.findOne({ email: normalizedEmail });

    console.log(`[OTP] verify attempt | email: ${normalizedEmail} | found: ${!!otpRecord} | submitted otp: ${otp}`);
    if (otpRecord) {
      console.log(`[OTP] stored otp: ${otpRecord.otp} | expiresAt: ${otpRecord.expiresAt} | attempts: ${otpRecord.attempts}`);
    }

    // ── Does OTP record exist? ──
    if (!otpRecord) {
      return res.status(404).json({
        error: "No pending verification found. Please sign up again.",
      });
    }

    // ── Is OTP expired? ──
    if (new Date() > new Date(otpRecord.expiresAt)) {
      await Otp.deleteOne({ email: normalizedEmail });
      return res.status(410).json({
        error: "OTP has expired. Please sign up again to receive a new code.",
      });
    }

    // ── Max attempts guard ──
    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
      await Otp.deleteOne({ email: normalizedEmail });
      return res.status(429).json({
        error: "Too many failed attempts. Please sign up again.",
      });
    }

    // ── OTP match check ──
    if (otpRecord.otp !== String(otp).trim()) {
      // Increment attempt counter
      otpRecord.attempts += 1;
      await otpRecord.save();
      const remaining = MAX_OTP_ATTEMPTS - otpRecord.attempts;
      return res.status(401).json({
        error: `Incorrect OTP. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`,
      });
    }

    // ── OTP is valid — create the user ──
    const { name, phone, passwordHash, role } = otpRecord.userData;

    // Guard: someone might have registered between OTP issue and verification
    const alreadyExists = await User.findOne({ email: normalizedEmail });
    if (alreadyExists) {
      await Otp.deleteOne({ email: normalizedEmail });
      return res.status(409).json({ error: "Email is already registered." });
    }

    // Store pre-hashed password directly — bypass the pre-save hook
    // by using insertOne so the hook doesn't double-hash
    const user = new User({ name, email: normalizedEmail, phone, password: passwordHash, role });
    // Mark password as already hashed so the pre-save hook skips re-hashing
    user.$__.skipPasswordHashing = true;
    // Use save with a custom flag that our pre-save hook will check
    // Actually, because we stored the hash we just need to bypass the hook.
    // The cleanest way: directly use Model.collection.insertOne
    const insertedUser = await User.collection.insertOne({
      name,
      email: normalizedEmail,
      phone,
      password: passwordHash,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // ── Delete OTP record (prevents reuse) ──
    await Otp.deleteOne({ email: normalizedEmail });

    // ── Issue JWT ──
    const token = signToken(insertedUser.insertedId, role);

    return res.status(201).json({
      message: "Email verified. Account created successfully!",
      token,
      user: {
        id: insertedUser.insertedId,
        name,
        email: normalizedEmail,
        role,
      },
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ error: "Server error during OTP verification." });
  }
};

// ── POST /api/auth/resend-otp ──────────────────────────────────────────────
// Resend a fresh OTP to the same email (rate-limited).
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required." });

    const normalizedEmail = email.toLowerCase().trim();

    const existingOtp = await Otp.findOne({ email: normalizedEmail });
    if (!existingOtp) {
      return res.status(404).json({
        error: "No pending verification found. Please sign up first.",
      });
    }

    // ── Cooldown check ──
    const elapsed = Date.now() - new Date(existingOtp.createdAt).getTime();
    if (elapsed < RESEND_COOLDOWN_MS) {
      const waitSec = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
      return res.status(429).json({
        error: `Please wait ${waitSec}s before requesting a new OTP.`,
      });
    }

    // ── Issue fresh OTP ──
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);

    existingOtp.otp = otp;
    existingOtp.attempts = 0;
    existingOtp.expiresAt = expiresAt;
    existingOtp.createdAt = new Date();
    await existingOtp.save();

    await sendOtpEmail(normalizedEmail, otp);

    return res.status(200).json({ message: "A new OTP has been sent to your email." });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ error: "Server error resending OTP." });
  }
};

// ── POST /api/auth/login ──────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = signToken(user._id, user.role);

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/auth/goals ────────────────────────────────────────────────────
const addGoal = async (req, res) => {
  try {
    const { email, title, targetAmount } = req.body;
    if (!email || !title || !targetAmount) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const goal = await Goal.create({ userEmail: email, title, targetAmount });
    res.status(201).json({ message: "Goal added successfully", goal });
  } catch (error) {
    console.error("Add goal error:", error);
    res.status(500).json({ error: "Server error handling goal addition" });
  }
};

// ── GET /api/auth/goals ─────────────────────────────────────────────────────
const getGoals = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required to fetch goals" });
    const goals = await Goal.find({ userEmail: email });
    res.status(200).json({ goals });
  } catch (error) {
    console.error("Get goals error:", error);
    res.status(500).json({ error: "Server error fetching goals" });
  }
};

// ── POST /api/auth/goals/add-funds ──────────────────────────────────────────
const addGoalFunds = async (req, res) => {
  try {
    const { goalId, amount } = req.body;
    if (!goalId || !amount) return res.status(400).json({ error: "Missing goalId or amount" });

    const goal = await Goal.findById(goalId);
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    goal.currentAmount += Number(amount);
    await goal.save();

    res.status(200).json({ message: "Funds added successfully", goal });
  } catch (error) {
    console.error("Add funds error:", error);
    res.status(500).json({ error: "Server error adding funds to goal" });
  }
};

// ── DELETE /api/auth/goals/:id ──────────────────────────────────────────────
const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Goal ID is required" });
    const goal = await Goal.findByIdAndDelete(id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });
    res.status(200).json({ message: "Goal deleted successfully", id: goal._id });
  } catch (error) {
    console.error("Delete goal error:", error);
    res.status(500).json({ error: "Server error deleting goal" });
  }
};

// ── GET /api/auth/festivals ──────────────────────────────────────────────────
const getFestivals = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });
    const festivals = await Festival.find({ userEmail: email });
    res.status(200).json({ festivals });
  } catch (error) {
    console.error("Get festivals error:", error);
    res.status(500).json({ error: "Server error fetching festivals" });
  }
};

// ── POST /api/auth/festivals ─────────────────────────────────────────────────
const addFestival = async (req, res) => {
  try {
    const { email, title, targetAmount } = req.body;
    if (!email || !title || !targetAmount) return res.status(400).json({ error: "Missing fields" });
    const festival = await Festival.create({ userEmail: email, title, targetAmount, expenses: [] });
    res.status(201).json({ message: "Festival created", festival });
  } catch (error) {
    console.error("Add festival error:", error);
    res.status(500).json({ error: "Server error creating festival" });
  }
};

// ── POST /api/auth/festivals/:id/expenses ───────────────────────────────────
const addFestivalExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, amount } = req.body;
    if (!category || !amount) return res.status(400).json({ error: "Category and amount required" });
    const festival = await Festival.findById(id);
    if (!festival) return res.status(404).json({ error: "Festival not found" });
    
    festival.expenses.push({ category, amount: Number(amount) });
    await festival.save();
    res.status(200).json({ message: "Expense added", festival });
  } catch (error) {
    console.error("Add expense error:", error);
    res.status(500).json({ error: "Server error adding expense" });
  }
};

// ── DELETE /api/auth/festivals/:id ──────────────────────────────────────────
const deleteFestival = async (req, res) => {
  try {
    const { id } = req.params;
    const festival = await Festival.findByIdAndDelete(id);
    if (!festival) return res.status(404).json({ error: "Festival not found" });
    res.status(200).json({ message: "Deleted successfully", id: festival._id });
  } catch (error) {
    console.error("Delete festival error:", error);
    res.status(500).json({ error: "Server error deleting festival" });
  }
};
// ── GET /api/auth/bank-accounts ─────────────────────────────────────────────
const getBankAccounts = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });
    const accounts = await BankAccount.find({ userEmail: email }).lean();
    res.status(200).json({ accounts });
  } catch (error) {
    console.error("Get bank accounts error:", error);
    res.status(500).json({ error: "Server error fetching bank accounts" });
  }
};

// ── POST /api/auth/bank-accounts/connect ─────────────────────────────────────
// Generates mock bank data and saves it (idempotent per user — skips if already connected)
const connectBank = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    // Allow multiple accounts — just create a fresh one each time
    const BANKS = ["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak Mahindra", "Yes Bank"];
    const DESCS = [
      { d: "Grocery Store",   c: "food",     range: [-3000, -200] },
      { d: "UPI Payment",     c: "transfer", range: [-5000, -100] },
      { d: "Salary Credit",   c: "salary",   range: [40000, 120000] },
      { d: "Online Shopping", c: "shopping", range: [-8000, -300] },
      { d: "Electricity Bill",c: "bills",    range: [-2500, -500] },
      { d: "Restaurant",      c: "food",     range: [-1500, -100] },
      { d: "ATM Withdrawal",  c: "other",    range: [-10000, -500] },
      { d: "Mutual Fund SIP", c: "other",    range: [-5000, -500] },
      { d: "Freelance Income",c: "salary",   range: [5000, 30000] },
      { d: "Rent Payment",    c: "bills",    range: [-25000, -5000] },
    ];

    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const bankName = BANKS[rand(0, BANKS.length - 1)];
    const lastFour = String(rand(1000, 9999));
    const accountNumber = `**** ${lastFour}`;
    const balance = rand(10000, 200000);

    const txCount = rand(6, 10);
    const transactions = Array.from({ length: txCount }, (_, k) => {
      const item = DESCS[rand(0, DESCS.length - 1)];
      const amount = rand(item.range[0], item.range[1]);
      const daysAgo = rand(0, 30);
      const date = new Date(Date.now() - daysAgo * 86400000);
      return { date, description: item.d, amount, category: item.c };
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    const account = await BankAccount.create({
      userEmail: email,
      bankName,
      accountNumber,
      balance,
      transactions,
    });

    res.status(201).json({ message: "Bank account connected", account });
  } catch (error) {
    console.error("Connect bank error:", error);
    res.status(500).json({ error: "Server error connecting bank account" });
  }
};

// ── POST /api/auth/bank-accounts/:id/transactions ────────────────────────────
const addTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await BankAccount.findById(id);
    if (!account) return res.status(404).json({ error: "Account not found" });

    const DESCS = [
      { d: "Grocery Store",    c: "food",     range: [-3000, -200] },
      { d: "UPI Payment",      c: "transfer", range: [-5000, -100] },
      { d: "Online Shopping",  c: "shopping", range: [-8000, -300] },
      { d: "Electricity Bill", c: "bills",    range: [-2500, -500] },
      { d: "Restaurant",       c: "food",     range: [-1500, -100] },
      { d: "ATM Withdrawal",   c: "other",    range: [-10000, -500] },
      { d: "Mutual Fund SIP",  c: "other",    range: [-5000, -500] },
      { d: "Freelance Income", c: "salary",   range: [5000, 30000] },
      { d: "Rent Payment",     c: "bills",    range: [-25000, -5000] },
      { d: "Salary Credit",    c: "salary",   range: [40000, 120000] },
    ];
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const item = DESCS[rand(0, DESCS.length - 1)];
    const amount = rand(item.range[0], item.range[1]);
    const tx = { date: new Date(), description: item.d, amount, category: item.c };

    account.transactions.unshift(tx); // newest first
    account.balance = Math.max(0, account.balance + amount);
    await account.save();

    res.status(200).json({ message: "Transaction added", account });
  } catch (error) {
    console.error("Add transaction error:", error);
    res.status(500).json({ error: "Server error adding transaction" });
  }
};

// (intermediate exports removed — consolidated at bottom of file)

// ── GET /api/auth/holdings ─────────────────────────────────────────────────
const getHoldings = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });
    const holdings = await Holding.find({ userEmail: email }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ holdings });
  } catch (error) {
    console.error("Get holdings error:", error);
    res.status(500).json({ error: "Server error fetching holdings" });
  }
};

// ── POST /api/auth/holdings ────────────────────────────────────────────────
const addHolding = async (req, res) => {
  try {
    const { email, name, symbol, icon, amount, buyPrice, currentPrice, color } = req.body;
    if (!email || !name || !symbol || !amount || !buyPrice || !currentPrice) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const holding = await Holding.create({
      userEmail: email,
      name,
      symbol: symbol.toUpperCase(),
      icon: icon || symbol[0].toUpperCase(),
      amount: parseFloat(amount),
      buyPrice: parseFloat(buyPrice),
      currentPrice: parseFloat(currentPrice),
      color: color || "#8eff71",
    });
    res.status(201).json({ message: "Holding added", holding });
  } catch (error) {
    console.error("Add holding error:", error);
    res.status(500).json({ error: "Server error adding holding" });
  }
};

// ── DELETE /api/auth/holdings/:id ────────────────────────────────────────────
const deleteHolding = async (req, res) => {
  try {
    const { id } = req.params;
    await Holding.findByIdAndDelete(id);
    res.status(200).json({ message: "Holding deleted" });
  } catch (error) {
    console.error("Delete holding error:", error);
    res.status(500).json({ error: "Server error deleting holding" });
  }
};

// ── GET /api/auth/institutional-holdings ─────────────────────────────────────────────────
const getInstitutionalHoldings = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });
    const holdings = await InstitutionalHolding.find({ companyEmail: email }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ holdings });
  } catch (error) {
    console.error("Get institutional holdings error:", error);
    res.status(500).json({ error: "Server error fetching institutional holdings" });
  }
};

// ── POST /api/auth/institutional-holdings ────────────────────────────────────────────────
const addInstitutionalHolding = async (req, res) => {
  try {
    const { email, name, symbol, icon, amount, buyPrice, currentPrice, color, risk } = req.body;
    if (!email || !name || !symbol || !amount || !buyPrice || !currentPrice) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const holding = await InstitutionalHolding.create({
      companyEmail: email,
      name,
      symbol: symbol.toUpperCase(),
      icon: icon || symbol[0].toUpperCase(),
      amount: parseFloat(amount),
      buyPrice: parseFloat(buyPrice),
      currentPrice: parseFloat(currentPrice),
      color: color || "#8eff71",
      risk: risk || "Medium"
    });
    res.status(201).json({ message: "Institutional Holding added", holding });
  } catch (error) {
    console.error("Add institutional holding error:", error);
    res.status(500).json({ error: "Server error adding institutional holding" });
  }
};

// ── DELETE /api/auth/institutional-holdings/:id ────────────────────────────────────────────
const deleteInstitutionalHolding = async (req, res) => {
  try {
    const { id } = req.params;
    await InstitutionalHolding.findByIdAndDelete(id);
    res.status(200).json({ message: "Institutional Holding deleted" });
  } catch (error) {
    console.error("Delete institutional holding error:", error);
    res.status(500).json({ error: "Server error deleting institutional holding" });
  }
};

// ── GET /api/auth/treasury-accounts ─────────────────────────────────────────────────
const getTreasuryAccounts = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });
    const accounts = await TreasuryAccount.find({ companyEmail: email }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ accounts });
  } catch (error) {
    console.error("Get treasury accounts error:", error);
    res.status(500).json({ error: "Server error fetching treasury accounts" });
  }
};

// ── POST /api/auth/treasury-accounts ────────────────────────────────────────────────
const addTreasuryAccount = async (req, res) => {
  try {
    const { email, bankName, bankIconText, accountType, balance, isPrimary } = req.body;
    if (!email || !bankName || !accountType || balance == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const account = await TreasuryAccount.create({
      companyEmail: email,
      bankName,
      bankIconText: bankIconText || bankName.slice(0, 2).toUpperCase(),
      accountType,
      balance: parseFloat(balance),
      isPrimary: isPrimary || false
    });
    res.status(201).json({ message: "Treasury Account added", account });
  } catch (error) {
    console.error("Add treasury account error:", error);
    res.status(500).json({ error: "Server error adding treasury account" });
  }
};

// ── DELETE /api/auth/treasury-accounts/:id ──────────────────────────────────────────
const deleteTreasuryAccount = async (req, res) => {
  try {
    const { id } = req.params;
    await TreasuryAccount.findByIdAndDelete(id);
    res.status(200).json({ message: "Treasury Account deleted" });
  } catch (error) {
    console.error("Delete treasury account error:", error);
    res.status(500).json({ error: "Server error deleting treasury account" });
  }
};

// ── GET /api/auth/team-members ──────────────────────────────────────────────────────
const getTeamMembers = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });
    const members = await TeamMember.find({ companyEmail: email }).sort({ createdAt: 1 }).lean();
    res.status(200).json({ members });
  } catch (error) {
    console.error("Get team members error:", error);
    res.status(500).json({ error: "Server error fetching team members" });
  }
};

// ── POST /api/auth/team-members ─────────────────────────────────────────────────────
const addTeamMember = async (req, res) => {
  try {
    const { email, name, role } = req.body;
    if (!email || !name || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const member = await TeamMember.create({
      companyEmail: email,
      name,
      role,
      imageSeed: name.toLowerCase().replace(/\s+/g, '-')
    });
    res.status(201).json({ message: "Team Member added", member });
  } catch (error) {
    console.error("Add team member error:", error);
    res.status(500).json({ error: "Server error adding team member" });
  }
};

// ── DELETE /api/auth/team-members/:id ───────────────────────────────────────────────
const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    await TeamMember.findByIdAndDelete(id);
    res.status(200).json({ message: "Team Member deleted" });
  } catch (error) {
    console.error("Delete team member error:", error);
    res.status(500).json({ error: "Server error deleting team member" });
  }
};

// ── FAMILY MEMBERS ────────────────────────────────────────────────────────────
const getFamilyMembers = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ error: "Email required" });
    const members = await FamilyMember.find({ userEmail: email }).sort({ createdAt: 1 });
    res.status(200).json({ members });
  } catch (error) {
    console.error("Get family members error:", error);
    res.status(500).json({ error: "Server error fetching family members" });
  }
};

const addFamilyMember = async (req, res) => {
  try {
    const { email, name, role, income, savings, isPrimary } = req.body;
    if (!email || !name || !role) {
      return res.status(400).json({ error: "Email, name, and role are required" });
    }
    const member = await FamilyMember.create({
      userEmail: email,
      name,
      role,
      income: Number(income) || 0,
      savings: Number(savings) || 0,
      isPrimary: isPrimary === true
    });
    res.status(201).json({ message: "Family member added", member });
  } catch (error) {
    console.error("Add family member error:", error);
    res.status(500).json({ error: "Server error adding family member" });
  }
};

const updateFamilyMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, income, savings } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (income !== undefined) updateData.income = Number(income);
    if (savings !== undefined) updateData.savings = Number(savings);

    const member = await FamilyMember.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ message: "Family member updated", member });
  } catch (error) {
    console.error("Update family member error:", error);
    res.status(500).json({ error: "Server error updating family member" });
  }
};

const deleteFamilyMember = async (req, res) => {
  try {
    const { id } = req.params;
    await FamilyMember.findByIdAndDelete(id);
    res.status(200).json({ message: "Family member deleted" });
  } catch (error) {
    console.error("Delete family member error:", error);
    res.status(500).json({ error: "Server error deleting family member" });
  }
};

// ── FAMILY GOALS ────────────────────────────────────────────────────────────
const getFamilyGoals = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ error: "Email required" });
    const goals = await FamilyGoal.find({ userEmail: email }).sort({ createdAt: 1 });
    res.status(200).json({ goals });
  } catch (error) {
    console.error("Get family goals error:", error);
    res.status(500).json({ error: "Server error fetching family goals" });
  }
};

const addFamilyGoal = async (req, res) => {
  try {
    const { email, title, targetAmount, currentAmount, deadline } = req.body;
    if (!email || !title || !targetAmount) {
      return res.status(400).json({ error: "Email, title, and targetAmount required" });
    }
    const goal = await FamilyGoal.create({
      userEmail: email,
      title,
      targetAmount: Number(targetAmount) || 0,
      currentAmount: Number(currentAmount) || 0,
      deadline
    });
    res.status(201).json({ message: "Family goal added", goal });
  } catch (error) {
    console.error("Add family goal error:", error);
    res.status(500).json({ error: "Server error adding family goal" });
  }
};

const updateFamilyGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, targetAmount, currentAmount, deadline } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (targetAmount !== undefined) updateData.targetAmount = Number(targetAmount);
    if (currentAmount !== undefined) updateData.currentAmount = Number(currentAmount);
    if (deadline !== undefined) updateData.deadline = deadline;

    const goal = await FamilyGoal.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ message: "Family goal updated", goal });
  } catch (error) {
    console.error("Update family goal error:", error);
    res.status(500).json({ error: "Server error updating family goal" });
  }
};

const deleteFamilyGoal = async (req, res) => {
  try {
    const { id } = req.params;
    await FamilyGoal.findByIdAndDelete(id);
    res.status(200).json({ message: "Family goal deleted" });
  } catch (error) {
    console.error("Delete family goal error:", error);
    res.status(500).json({ error: "Server error deleting family goal" });
  }
};


module.exports = { 
  signup, login, verifyOtp, resendOtp,
  addGoal, getGoals, addGoalFunds, deleteGoal, 
  getFestivals, addFestival, addFestivalExpense, deleteFestival, 
  getBankAccounts, connectBank, addTransaction, 
  getHoldings, addHolding, deleteHolding, 
  getInstitutionalHoldings, addInstitutionalHolding, deleteInstitutionalHolding,
  getTreasuryAccounts, addTreasuryAccount, deleteTreasuryAccount,
  getTeamMembers, addTeamMember, deleteTeamMember,
  getFamilyMembers, addFamilyMember, updateFamilyMember, deleteFamilyMember,
  getFamilyGoals, addFamilyGoal, updateFamilyGoal, deleteFamilyGoal
};
