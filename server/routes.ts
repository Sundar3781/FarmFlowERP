import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { auditLog } from "./middleware";
import { z } from "zod";
import { 
  insertUserSchema,
  insertAttendanceSchema,
  insertWorkScheduleSchema,
  insertPlotSchema,
  insertPlotActivitySchema,
  insertCultivationCostSchema,
  insertFertilizerScheduleSchema,
  insertInventoryItemSchema,
  insertInventoryMovementSchema,
  insertEquipmentSchema,
  insertMaintenanceRecordSchema,
  insertFuelLogSchema,
  insertAnimalSchema,
  insertMilkYieldSchema,
  insertHealthRecordSchema,
  insertAnimalSaleSchema,
  insertAccountSchema,
  insertJournalEntrySchema,
  insertJournalLineSchema,
  insertPettyCashSchema,
  insertAuditLogSchema,
  insertWageSchema,
  insertAdminSettingSchema,
  insertBiometricAttendanceSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply audit logging middleware to all API routes
  app.use("/api", auditLog);

  // ============================================================================
  // AUTHENTICATION
  // ============================================================================

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);

      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Don't send password back
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // ============================================================================
  // DASHBOARD
  // ============================================================================

  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // ============================================================================
  // USERS
  // ============================================================================

  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove passwords from response
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // ============================================================================
  // ATTENDANCE
  // ============================================================================

  app.get("/api/attendance", async (req, res) => {
    try {
      const { date, userId, startDate, endDate } = req.query;

      if (userId && typeof userId === "string") {
        const records = await storage.getAttendanceByUserId(
          userId,
          startDate as string,
          endDate as string
        );
        return res.json(records);
      }

      if (date && typeof date === "string") {
        const records = await storage.getAttendanceByDate(date);
        return res.json(records);
      }

      res.status(400).json({ error: "Date or userId parameter required" });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch attendance" });
    }
  });

  app.post("/api/attendance", async (req, res) => {
    try {
      const attendanceData = insertAttendanceSchema.parse(req.body);
      const attendance = await storage.createAttendance(attendanceData);
      res.status(201).json(attendance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create attendance" });
    }
  });

  app.patch("/api/attendance/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const attendance = await storage.updateAttendance(id, updates);

      if (!attendance) {
        return res.status(404).json({ error: "Attendance not found" });
      }

      res.json(attendance);
    } catch (error) {
      res.status(500).json({ error: "Failed to update attendance" });
    }
  });

  // ============================================================================
  // WORK SCHEDULES
  // ============================================================================

  app.get("/api/work-schedules", async (req, res) => {
    try {
      const { date, userId } = req.query;

      if (userId && typeof userId === "string") {
        const schedules = await storage.getWorkSchedulesByUserId(userId);
        return res.json(schedules);
      }

      if (date && typeof date === "string") {
        const schedules = await storage.getWorkSchedulesByDate(date);
        return res.json(schedules);
      }

      res.status(400).json({ error: "Date or userId parameter required" });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch work schedules" });
    }
  });

  app.post("/api/work-schedules", async (req, res) => {
    try {
      const scheduleData = insertWorkScheduleSchema.parse(req.body);
      const schedule = await storage.createWorkSchedule(scheduleData);
      res.status(201).json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create work schedule" });
    }
  });

  // ============================================================================
  // PLOTS
  // ============================================================================

  app.get("/api/plots", async (req, res) => {
    try {
      const plots = await storage.getAllPlots();
      res.json(plots);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plots" });
    }
  });

  app.get("/api/plots/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const plot = await storage.getPlot(id);

      if (!plot) {
        return res.status(404).json({ error: "Plot not found" });
      }

      res.json(plot);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plot" });
    }
  });

  app.post("/api/plots", async (req, res) => {
    try {
      const plotData = insertPlotSchema.parse(req.body);
      const plot = await storage.createPlot(plotData);
      res.status(201).json(plot);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create plot" });
    }
  });

  app.patch("/api/plots/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const plot = await storage.updatePlot(id, updates);

      if (!plot) {
        return res.status(404).json({ error: "Plot not found" });
      }

      res.json(plot);
    } catch (error) {
      res.status(500).json({ error: "Failed to update plot" });
    }
  });

  app.delete("/api/plots/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deletePlot(id);

      if (!deleted) {
        return res.status(404).json({ error: "Plot not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete plot" });
    }
  });

  // ============================================================================
  // PLOT ACTIVITIES
  // ============================================================================

  app.get("/api/plot-activities", async (req, res) => {
    try {
      const { plotId } = req.query;

      if (!plotId || typeof plotId !== "string") {
        return res.status(400).json({ error: "plotId parameter required" });
      }

      const activities = await storage.getPlotActivities(plotId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plot activities" });
    }
  });

  app.post("/api/plot-activities", async (req, res) => {
    try {
      const activityData = insertPlotActivitySchema.parse(req.body);
      const activity = await storage.createPlotActivity(activityData);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create plot activity" });
    }
  });

  // ============================================================================
  // CULTIVATION COSTS
  // ============================================================================

  app.get("/api/cultivation-costs", async (req, res) => {
    try {
      const { plotId } = req.query;

      if (!plotId || typeof plotId !== "string") {
        return res.status(400).json({ error: "plotId parameter required" });
      }

      const costs = await storage.getCultivationCosts(plotId);
      res.json(costs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cultivation costs" });
    }
  });

  app.post("/api/cultivation-costs", async (req, res) => {
    try {
      const costData = insertCultivationCostSchema.parse(req.body);
      const cost = await storage.createCultivationCost(costData);
      res.status(201).json(cost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create cultivation cost" });
    }
  });

  // ============================================================================
  // FERTILIZER SCHEDULES
  // ============================================================================

  app.get("/api/fertilizer-schedules", async (req, res) => {
    try {
      const { plotId } = req.query;
      const schedules = await storage.getFertilizerSchedules(
        plotId as string | undefined
      );
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fertilizer schedules" });
    }
  });

  app.post("/api/fertilizer-schedules", async (req, res) => {
    try {
      const scheduleData = insertFertilizerScheduleSchema.parse(req.body);
      const schedule = await storage.createFertilizerSchedule(scheduleData);
      res.status(201).json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create fertilizer schedule" });
    }
  });

  app.patch("/api/fertilizer-schedules/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const schedule = await storage.updateFertilizerSchedule(id, updates);

      if (!schedule) {
        return res.status(404).json({ error: "Schedule not found" });
      }

      res.json(schedule);
    } catch (error) {
      res.status(500).json({ error: "Failed to update fertilizer schedule" });
    }
  });

  // ============================================================================
  // INVENTORY
  // ============================================================================

  app.get("/api/inventory", async (req, res) => {
    try {
      const items = await storage.getAllInventoryItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory" });
    }
  });

  app.get("/api/inventory/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const item = await storage.getInventoryItem(id);

      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }

      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory item" });
    }
  });

  app.post("/api/inventory", async (req, res) => {
    try {
      const itemData = insertInventoryItemSchema.parse(req.body);
      const item = await storage.createInventoryItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create inventory item" });
    }
  });

  app.patch("/api/inventory/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const item = await storage.updateInventoryItem(id, updates);

      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }

      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to update inventory item" });
    }
  });

  app.delete("/api/inventory/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteInventoryItem(id);

      if (!deleted) {
        return res.status(404).json({ error: "Item not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete inventory item" });
    }
  });

  // ============================================================================
  // INVENTORY MOVEMENTS
  // ============================================================================

  app.get("/api/inventory-movements", async (req, res) => {
    try {
      const { itemId } = req.query;
      const movements = await storage.getInventoryMovements(
        itemId as string | undefined
      );
      res.json(movements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory movements" });
    }
  });

  app.post("/api/inventory-movements", async (req, res) => {
    try {
      const movementData = insertInventoryMovementSchema.parse(req.body);
      const movement = await storage.createInventoryMovement(movementData);
      res.status(201).json(movement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create inventory movement" });
    }
  });

  // ============================================================================
  // EQUIPMENT
  // ============================================================================

  app.get("/api/equipment", async (req, res) => {
    try {
      const equipment = await storage.getAllEquipment();
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch equipment" });
    }
  });

  app.get("/api/equipment/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const equipment = await storage.getEquipment(id);

      if (!equipment) {
        return res.status(404).json({ error: "Equipment not found" });
      }

      res.json(equipment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch equipment" });
    }
  });

  app.post("/api/equipment", async (req, res) => {
    try {
      const equipmentData = insertEquipmentSchema.parse(req.body);
      const equipment = await storage.createEquipment(equipmentData);
      res.status(201).json(equipment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create equipment" });
    }
  });

  app.patch("/api/equipment/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const equipment = await storage.updateEquipment(id, updates);

      if (!equipment) {
        return res.status(404).json({ error: "Equipment not found" });
      }

      res.json(equipment);
    } catch (error) {
      res.status(500).json({ error: "Failed to update equipment" });
    }
  });

  app.delete("/api/equipment/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteEquipment(id);

      if (!deleted) {
        return res.status(404).json({ error: "Equipment not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete equipment" });
    }
  });

  // ============================================================================
  // MAINTENANCE RECORDS
  // ============================================================================

  app.get("/api/maintenance-records", async (req, res) => {
    try {
      const { equipmentId } = req.query;
      const records = await storage.getMaintenanceRecords(
        equipmentId as string | undefined
      );
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch maintenance records" });
    }
  });

  app.post("/api/maintenance-records", async (req, res) => {
    try {
      const recordData = insertMaintenanceRecordSchema.parse(req.body);
      const record = await storage.createMaintenanceRecord(recordData);
      res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create maintenance record" });
    }
  });

  // ============================================================================
  // FUEL LOGS
  // ============================================================================

  app.get("/api/fuel-logs", async (req, res) => {
    try {
      const { equipmentId } = req.query;
      const logs = await storage.getFuelLogs(equipmentId as string | undefined);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fuel logs" });
    }
  });

  app.post("/api/fuel-logs", async (req, res) => {
    try {
      const logData = insertFuelLogSchema.parse(req.body);
      const log = await storage.createFuelLog(logData);
      res.status(201).json(log);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create fuel log" });
    }
  });

  // ============================================================================
  // ANIMALS
  // ============================================================================

  app.get("/api/animals", async (req, res) => {
    try {
      const animals = await storage.getAllAnimals();
      res.json(animals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch animals" });
    }
  });

  app.get("/api/animals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const animal = await storage.getAnimal(id);

      if (!animal) {
        return res.status(404).json({ error: "Animal not found" });
      }

      res.json(animal);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch animal" });
    }
  });

  app.post("/api/animals", async (req, res) => {
    try {
      const animalData = insertAnimalSchema.parse(req.body);
      const animal = await storage.createAnimal(animalData);
      res.status(201).json(animal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create animal" });
    }
  });

  app.patch("/api/animals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const animal = await storage.updateAnimal(id, updates);

      if (!animal) {
        return res.status(404).json({ error: "Animal not found" });
      }

      res.json(animal);
    } catch (error) {
      res.status(500).json({ error: "Failed to update animal" });
    }
  });

  app.delete("/api/animals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteAnimal(id);

      if (!deleted) {
        return res.status(404).json({ error: "Animal not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete animal" });
    }
  });

  // ============================================================================
  // MILK YIELDS
  // ============================================================================

  app.get("/api/milk-yields", async (req, res) => {
    try {
      const { animalId, startDate, endDate } = req.query;
      const yields = await storage.getMilkYields(
        animalId as string | undefined,
        startDate as string | undefined,
        endDate as string | undefined
      );
      res.json(yields);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch milk yields" });
    }
  });

  app.post("/api/milk-yields", async (req, res) => {
    try {
      const yieldData = insertMilkYieldSchema.parse(req.body);
      const yield_ = await storage.createMilkYield(yieldData);
      res.status(201).json(yield_);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create milk yield" });
    }
  });

  // ============================================================================
  // HEALTH RECORDS
  // ============================================================================

  app.get("/api/health-records", async (req, res) => {
    try {
      const { animalId } = req.query;
      const records = await storage.getHealthRecords(
        animalId as string | undefined
      );
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch health records" });
    }
  });

  app.post("/api/health-records", async (req, res) => {
    try {
      const recordData = insertHealthRecordSchema.parse(req.body);
      const record = await storage.createHealthRecord(recordData);
      res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create health record" });
    }
  });

  // ============================================================================
  // ANIMAL SALES
  // ============================================================================

  app.get("/api/animal-sales", async (req, res) => {
    try {
      const sales = await storage.getAnimalSales();
      res.json(sales);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch animal sales" });
    }
  });

  app.post("/api/animal-sales", async (req, res) => {
    try {
      const saleData = insertAnimalSaleSchema.parse(req.body);
      const sale = await storage.createAnimalSale(saleData);
      res.status(201).json(sale);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create animal sale" });
    }
  });

  // ============================================================================
  // ACCOUNTS
  // ============================================================================

  app.get("/api/accounts", async (req, res) => {
    try {
      const accounts = await storage.getAllAccounts();
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch accounts" });
    }
  });

  app.get("/api/accounts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const account = await storage.getAccount(id);

      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }

      res.json(account);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch account" });
    }
  });

  app.post("/api/accounts", async (req, res) => {
    try {
      const accountData = insertAccountSchema.parse(req.body);
      const account = await storage.createAccount(accountData);
      res.status(201).json(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  app.patch("/api/accounts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const account = await storage.updateAccount(id, updates);

      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }

      res.json(account);
    } catch (error) {
      res.status(500).json({ error: "Failed to update account" });
    }
  });

  // ============================================================================
  // JOURNAL ENTRIES
  // ============================================================================

  app.get("/api/journal-entries", async (req, res) => {
    try {
      const entries = await storage.getAllJournalEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch journal entries" });
    }
  });

  app.get("/api/journal-entries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const entry = await storage.getJournalEntry(id);

      if (!entry) {
        return res.status(404).json({ error: "Journal entry not found" });
      }

      const lines = await storage.getJournalLines(id);
      res.json({ ...entry, lines });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch journal entry" });
    }
  });

  app.post("/api/journal-entries", async (req, res) => {
    try {
      const { lines, ...entryData } = req.body;
      const entryValidated = insertJournalEntrySchema.parse(entryData);

      if (!lines || !Array.isArray(lines) || lines.length === 0) {
        return res.status(400).json({ error: "Lines are required" });
      }

      const linesValidated = lines.map((line) =>
        insertJournalLineSchema.parse(line)
      );

      const entry = await storage.createJournalEntry(
        entryValidated,
        linesValidated
      );
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create journal entry" });
    }
  });

  // ============================================================================
  // PETTY CASH
  // ============================================================================

  app.get("/api/petty-cash", async (req, res) => {
    try {
      const entries = await storage.getAllPettyCash();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch petty cash" });
    }
  });

  app.post("/api/petty-cash", async (req, res) => {
    try {
      const entryData = insertPettyCashSchema.parse(req.body);
      const entry = await storage.createPettyCash(entryData);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create petty cash entry" });
    }
  });

  // ============================================================================
  // AUDIT LOGS
  // ============================================================================

  app.get("/api/audit-logs", async (req, res) => {
    try {
      const { userId, module } = req.query;
      const logs = await storage.getAuditLogs(
        userId as string | undefined,
        module as string | undefined
      );
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  app.post("/api/audit-logs", async (req, res) => {
    try {
      const logData = insertAuditLogSchema.parse(req.body);
      const log = await storage.createAuditLog(logData);
      res.status(201).json(log);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create audit log" });
    }
  });

  // ============================================================================
  // WAGES
  // ============================================================================

  app.get("/api/wages", async (req, res) => {
    try {
      const { userId, month } = req.query;
      let wages;
      if (userId) {
        wages = await storage.getWagesByUserId(userId as string, month as string);
      } else {
        wages = await storage.getAllWages(month as string);
      }
      res.json(wages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wages" });
    }
  });

  app.post("/api/wages", async (req, res) => {
    try {
      const wageData = insertWageSchema.parse(req.body);
      const wage = await storage.createWage(wageData);
      res.status(201).json(wage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create wage entry" });
    }
  });

  app.patch("/api/wages/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const wage = await storage.updateWage(id, updates);
      if (!wage) {
        return res.status(404).json({ error: "Wage entry not found" });
      }
      res.json(wage);
    } catch (error) {
      res.status(500).json({ error: "Failed to update wage entry" });
    }
  });

  // ============================================================================
  // ADMIN SETTINGS
  // ============================================================================

  app.get("/api/admin-settings", async (req, res) => {
    try {
      const { category } = req.query;
      const settings = await storage.getAllAdminSettings(category as string);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin settings" });
    }
  });

  app.get("/api/admin-settings/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const setting = await storage.getAdminSetting(key);
      if (!setting) {
        return res.status(404).json({ error: "Setting not found" });
      }
      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch setting" });
    }
  });

  app.post("/api/admin-settings", async (req, res) => {
    try {
      const settingData = insertAdminSettingSchema.parse(req.body);
      const setting = await storage.createAdminSetting(settingData);
      res.status(201).json(setting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create admin setting" });
    }
  });

  app.patch("/api/admin-settings/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const { value } = req.body;
      const setting = await storage.updateAdminSetting(key, value);
      if (!setting) {
        return res.status(404).json({ error: "Setting not found" });
      }
      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to update setting" });
    }
  });

  // ============================================================================
  // BIOMETRIC ATTENDANCE
  // ============================================================================

  app.get("/api/biometric-attendance/:attendanceId", async (req, res) => {
    try {
      const { attendanceId } = req.params;
      const data = await storage.getBiometricAttendance(attendanceId);
      if (!data) {
        return res.status(404).json({ error: "Biometric data not found" });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch biometric data" });
    }
  });

  app.post("/api/biometric-attendance", async (req, res) => {
    try {
      const bioData = insertBiometricAttendanceSchema.parse(req.body);
      const data = await storage.createBiometricAttendance(bioData);
      res.status(201).json(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create biometric data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
