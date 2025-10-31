const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { auth, db, admin } = require("../config/firebase");

exports.register = async (req, res) => {
  try {
    const { email, password, name, phone, address } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and name are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: false,
      disabled: false,
    });

    const userData = {
      uid: userRecord.uid,
      email: userRecord.email,
      name: name,
      phone: phone || "",
      address: address || "",
      password: hashedPassword,
      role: "user",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("users").doc(userRecord.uid).set(userData);

    const token = jwt.sign(
      {
        uid: userRecord.uid,
        email: userRecord.email,
        role: userData.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    delete userData.password;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: userData,
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === "auth/email-already-exists") {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const usersSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();

    const isValidPassword = await bcrypt.compare(password, userData.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        uid: userData.uid,
        email: userData.email,
        role: userData.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    await db.collection("users").doc(userData.uid).update({
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
    });

    delete userData.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: userData,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const usersSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      return res.status(200).json({
        success: true,
        message: "If email exists, password reset link has been sent",
      });
    }

    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();

    const resetToken = jwt.sign(
      { uid: userData.uid, email: userData.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await db
      .collection("password_resets")
      .doc(userData.uid)
      .set({
        uid: userData.uid,
        token: resetToken,
        expiresAt: admin.firestore.Timestamp.fromDate(
          new Date(Date.now() + 3600000)
        ),
        used: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    console.log("Reset token:", resetToken);

    res.status(200).json({
      success: true,
      message: "If email exists, password reset link has been sent",
      resetToken:
        process.env.NODE_ENV === "development" ? resetToken : undefined,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Password reset request failed",
      error: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const resetDoc = await db
      .collection("password_resets")
      .doc(decoded.uid)
      .get();

    if (!resetDoc.exists) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const resetData = resetDoc.data();

    if (resetData.used) {
      return res.status(400).json({
        success: false,
        message: "Reset token has already been used",
      });
    }

    if (resetData.expiresAt.toMillis() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Reset token has expired",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.collection("users").doc(decoded.uid).update({
      password: hashedPassword,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await auth.updateUser(decoded.uid, { password: newPassword });

    await db.collection("password_resets").doc(decoded.uid).update({
      used: true,
    });

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        success: false,
        message: "Reset token has expired",
      });
    }

    res.status(500).json({
      success: false,
      message: "Password reset failed",
      error: error.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userData = userDoc.data();
    delete userData.password;

    res.status(200).json({
      success: true,
      data: { user: userData },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    await db.collection("users").doc(req.user.uid).update(updateData);

    const userDoc = await db.collection("users").doc(req.user.uid).get();
    const userData = userDoc.data();
    delete userData.password;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user: userData },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

/**
 * Upload/Update profile photo
 */
exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const oldPhotoPath = req.body.oldPhotoPath;

    // Delete old photo if it exists
    if (oldPhotoPath) {
      const oldPhotoFullPath = path.join(__dirname, "..", oldPhotoPath);
      if (fs.existsSync(oldPhotoFullPath)) {
        fs.unlinkSync(oldPhotoFullPath);
      }
    }

    // Create relative path from uploads directory
    const photoPath = `/uploads/${req.file.filename}`;

    // Update user document with new photo path
    await db.collection("users").doc(req.user.uid).update({
      photoPath: photoPath,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Get updated user data
    const userDoc = await db.collection("users").doc(req.user.uid).get();
    const userData = userDoc.data();
    delete userData.password;

    res.status(200).json({
      success: true,
      message: "Photo uploaded successfully",
      data: {
        user: userData,
        photoPath: photoPath,
      },
    });
  } catch (error) {
    console.error("Upload photo error:", error);

    // Delete uploaded file if error occurred
    if (req.file) {
      const filePath = path.join(__dirname, "..", "uploads", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      success: false,
      message: "Failed to upload photo",
      error: error.message,
    });
  }
};

/**
 * Delete profile photo
 */
exports.deletePhoto = async (req, res) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userData = userDoc.data();

    if (!userData.photoPath) {
      return res.status(400).json({
        success: false,
        message: "No photo to delete",
      });
    }

    // Delete file from filesystem
    const photoFullPath = path.join(__dirname, "..", userData.photoPath);
    if (fs.existsSync(photoFullPath)) {
      fs.unlinkSync(photoFullPath);
    }

    // Remove photo path from database
    await db.collection("users").doc(req.user.uid).update({
      photoPath: admin.firestore.FieldValue.delete(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Get updated user data
    const updatedUserDoc = await db.collection("users").doc(req.user.uid).get();
    const updatedUserData = updatedUserDoc.data();
    delete updatedUserData.password;

    res.status(200).json({
      success: true,
      message: "Photo deleted successfully",
      data: { user: updatedUserData },
    });
  } catch (error) {
    console.error("Delete photo error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete photo",
      error: error.message,
    });
  }
};

/**
 * Get all users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const usersSnapshot = await db.collection("users").get();

    const users = [];
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      delete userData.password; // Never send passwords
      users.push(userData);
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: { users },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};
