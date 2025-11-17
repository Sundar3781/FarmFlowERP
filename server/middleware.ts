import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: string;
      };
    }
  }
}

// Role hierarchy for access control
const roleHierarchy: Record<string, number> = {
  Admin: 5,
  Manager: 4,
  Supervisor: 3,
  Operator: 2,
  Viewer: 1,
};

// Check if user role has sufficient permissions
export function hasPermission(userRole: string, requiredRole: string): boolean {
  return (roleHierarchy[userRole] || 0) >= (roleHierarchy[requiredRole] || 0);
}

// Middleware to require authentication (for future session-based auth)
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // For MVP, we'll skip session-based auth since we're using localStorage on client
  // In production, this would check req.session or JWT token
  next();
}

// Middleware to require specific role
export function requireRole(minRole: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    // For MVP, we'll skip role checks since auth is client-side
    // In production, this would check req.user.role from session
    next();
  };
}

// Middleware to log all API actions for audit trail
export async function auditLog(req: Request, res: Response, next: NextFunction) {
  // Skip audit logging for GET requests to reduce noise
  if (req.method === "GET") {
    return next();
  }

  // Extract user info from headers (in production, this would come from session)
  const userId = req.headers["x-user-id"] as string;
  const module = req.path.split("/")[2]; // Extract module from /api/module/...

  // Log the action
  if (userId && module) {
    try {
      await storage.createAuditLog({
        userId,
        module,
        action: req.method,
        details: JSON.stringify({
          path: req.path,
          body: req.body,
        }),
      });
    } catch (error) {
      // Don't fail the request if audit logging fails
      console.error("Audit logging failed:", error);
    }
  }

  next();
}
