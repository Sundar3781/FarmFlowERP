import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================================================
// USER MANAGEMENT & AUTHENTICATION
// ============================================================================

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull(), // Admin, Manager, Supervisor, Operator, Viewer
  email: text("email"),
  phone: text("phone"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ============================================================================
// ATTENDANCE & WORK MANAGEMENT
// ============================================================================

export const attendanceRecords = pgTable("attendance_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  checkIn: text("check_in"), // HH:mm format
  checkOut: text("check_out"), // HH:mm format
  status: text("status").notNull(), // Present, Absent, Late, HalfDay
  workHours: decimal("work_hours", { precision: 5, scale: 2 }),
  notes: text("notes"),
  biometricData: text("biometric_data"), // Simulated biometric capture
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAttendanceSchema = createInsertSchema(attendanceRecords).omit({ id: true, createdAt: true });
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Attendance = typeof attendanceRecords.$inferSelect;

export const workSchedules = pgTable("work_schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: text("date").notNull(),
  taskDescription: text("task_description").notNull(),
  plotId: varchar("plot_id"),
  startTime: text("start_time"),
  endTime: text("end_time"),
  status: text("status").notNull().default("Pending"), // Pending, InProgress, Completed
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertWorkScheduleSchema = createInsertSchema(workSchedules).omit({ id: true, createdAt: true });
export type InsertWorkSchedule = z.infer<typeof insertWorkScheduleSchema>;
export type WorkSchedule = typeof workSchedules.$inferSelect;

export const biometricAttendance = pgTable("biometric_attendance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  attendanceId: varchar("attendance_id").notNull(), // Links to attendance_records
  photoUrl: text("photo_url"), // Simulated facial capture photo
  fingerprintData: text("fingerprint_data"), // Simulated fingerprint scan
  captureMethod: text("capture_method").notNull(), // Photo, Fingerprint, Both
  confidence: decimal("confidence", { precision: 5, scale: 2 }), // Match confidence percentage
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBiometricAttendanceSchema = createInsertSchema(biometricAttendance).omit({ id: true, createdAt: true });
export type InsertBiometricAttendance = z.infer<typeof insertBiometricAttendanceSchema>;
export type BiometricAttendance = typeof biometricAttendance.$inferSelect;

export const wages = pgTable("wages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  month: text("month").notNull(), // YYYY-MM format
  basicWage: decimal("basic_wage", { precision: 10, scale: 2 }).notNull(),
  overtime: decimal("overtime", { precision: 10, scale: 2 }).default(sql`0`),
  deductions: decimal("deductions", { precision: 10, scale: 2 }).default(sql`0`),
  bonus: decimal("bonus", { precision: 10, scale: 2 }).default(sql`0`),
  totalPaid: decimal("total_paid", { precision: 10, scale: 2 }).notNull(),
  paymentDate: text("payment_date"),
  paymentMethod: text("payment_method"), // Cash, Bank Transfer, UPI, Cheque
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertWageSchema = createInsertSchema(wages).omit({ id: true, createdAt: true });
export type InsertWage = z.infer<typeof insertWageSchema>;
export type Wage = typeof wages.$inferSelect;

export const adminSettings = pgTable("admin_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  settingKey: text("setting_key").notNull().unique(),
  settingValue: jsonb("setting_value").notNull(),
  category: text("category").notNull(), // Attendance, Wages, General, Notifications
  description: text("description"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAdminSettingSchema = createInsertSchema(adminSettings).omit({ id: true, updatedAt: true });
export type InsertAdminSetting = z.infer<typeof insertAdminSettingSchema>;
export type AdminSetting = typeof adminSettings.$inferSelect;

// ============================================================================
// CULTIVATION & FERTILIZER MANAGEMENT
// ============================================================================

export const plots = pgTable("plots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  area: decimal("area", { precision: 10, scale: 2 }).notNull(), // in hectares
  variety: text("variety").notNull(), // Grand Naine, Robusta, Cavendish, etc.
  plantingDate: text("planting_date").notNull(),
  plantDensity: integer("plant_density").notNull().default(1600), // plants per hectare
  status: text("status").notNull().default("Active"), // Active, Harvested, Fallow
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPlotSchema = createInsertSchema(plots).omit({ id: true, createdAt: true });
export type InsertPlot = z.infer<typeof insertPlotSchema>;
export type Plot = typeof plots.$inferSelect;

export const plotActivities = pgTable("plot_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  plotId: varchar("plot_id").notNull(),
  date: text("date").notNull(),
  activityType: text("activity_type").notNull(), // Fertigation, Irrigation, Weeding, Spraying, etc.
  description: text("description").notNull(),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  performedBy: varchar("performed_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPlotActivitySchema = createInsertSchema(plotActivities).omit({ id: true, createdAt: true });
export type InsertPlotActivity = z.infer<typeof insertPlotActivitySchema>;
export type PlotActivity = typeof plotActivities.$inferSelect;

export const cultivationCosts = pgTable("cultivation_costs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  plotId: varchar("plot_id").notNull(),
  date: text("date").notNull(),
  category: text("category").notNull(), // Labour, Fertilizer, PestControl, Equipment, Other
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCultivationCostSchema = createInsertSchema(cultivationCosts).omit({ id: true, createdAt: true });
export type InsertCultivationCost = z.infer<typeof insertCultivationCostSchema>;
export type CultivationCost = typeof cultivationCosts.$inferSelect;

export const fertilizerSchedules = pgTable("fertilizer_schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  plotId: varchar("plot_id").notNull(),
  fertilizerName: text("fertilizer_name").notNull(),
  scheduledDate: text("scheduled_date").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull(), // kg, liters, bags
  applicationMethod: text("application_method"), // Drip, Spray, Manual
  status: text("status").notNull().default("Scheduled"), // Scheduled, Applied, Cancelled
  appliedDate: text("applied_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFertilizerScheduleSchema = createInsertSchema(fertilizerSchedules).omit({ id: true, createdAt: true });
export type InsertFertilizerSchedule = z.infer<typeof insertFertilizerScheduleSchema>;
export type FertilizerSchedule = typeof fertilizerSchedules.$inferSelect;

// ============================================================================
// INVENTORY MANAGEMENT
// ============================================================================

export const inventoryItems = pgTable("inventory_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // Fertilizer, Pesticide, Seeds, Tools, Equipment, Fuel
  unit: text("unit").notNull(), // kg, liters, pieces, bags
  currentStock: decimal("current_stock", { precision: 10, scale: 2 }).notNull().default("0"),
  reorderLevel: decimal("reorder_level", { precision: 10, scale: 2 }).notNull(),
  location: text("location"), // Storage location
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }),
  supplier: text("supplier"),
  lastRestocked: text("last_restocked"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({ id: true, createdAt: true });
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;

export const inventoryMovements = pgTable("inventory_movements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: varchar("item_id").notNull(),
  movementType: text("movement_type").notNull(), // IN (restock), OUT (usage), ADJUSTMENT
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  date: text("date").notNull(),
  reference: text("reference"), // Plot ID, Purchase Order, etc.
  performedBy: varchar("performed_by"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertInventoryMovementSchema = createInsertSchema(inventoryMovements).omit({ id: true, createdAt: true });
export type InsertInventoryMovement = z.infer<typeof insertInventoryMovementSchema>;
export type InventoryMovement = typeof inventoryMovements.$inferSelect;

// ============================================================================
// EQUIPMENT & VEHICLE MAINTENANCE
// ============================================================================

export const equipment = pgTable("equipment", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // Tractor, Sprayer, Pump, Vehicle, Tool
  registrationNumber: text("registration_number"),
  purchaseDate: text("purchase_date"),
  purchaseCost: decimal("purchase_cost", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("Operational"), // Operational, UnderMaintenance, Broken
  lastServiceDate: text("last_service_date"),
  nextServiceDate: text("next_service_date"),
  location: text("location"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEquipmentSchema = createInsertSchema(equipment).omit({ id: true, createdAt: true });
export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;
export type Equipment = typeof equipment.$inferSelect;

export const maintenanceRecords = pgTable("maintenance_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  equipmentId: varchar("equipment_id").notNull(),
  date: text("date").notNull(),
  maintenanceType: text("maintenance_type").notNull(), // Routine, Repair, Inspection
  description: text("description").notNull(),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  performedBy: text("performed_by"),
  nextServiceDue: text("next_service_due"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMaintenanceRecordSchema = createInsertSchema(maintenanceRecords).omit({ id: true, createdAt: true });
export type InsertMaintenanceRecord = z.infer<typeof insertMaintenanceRecordSchema>;
export type MaintenanceRecord = typeof maintenanceRecords.$inferSelect;

export const fuelLogs = pgTable("fuel_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  equipmentId: varchar("equipment_id").notNull(),
  date: text("date").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(), // in liters
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
  mileage: integer("mileage"), // for vehicles
  operator: varchar("operator_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFuelLogSchema = createInsertSchema(fuelLogs).omit({ id: true, createdAt: true });
export type InsertFuelLog = z.infer<typeof insertFuelLogSchema>;
export type FuelLog = typeof fuelLogs.$inferSelect;

// ============================================================================
// LIVESTOCK MANAGEMENT
// ============================================================================

export const animals = pgTable("animals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tagNumber: text("tag_number").notNull().unique(),
  name: text("name"),
  type: text("type").notNull(), // Cow, Buffalo, Horse, Dog, Chicken, etc.
  breed: text("breed"),
  dateOfBirth: text("date_of_birth"),
  gender: text("gender").notNull(), // Male, Female
  status: text("status").notNull().default("Active"), // Active, Sold, Deceased
  purchaseDate: text("purchase_date"),
  purchaseCost: decimal("purchase_cost", { precision: 10, scale: 2 }),
  currentValue: decimal("current_value", { precision: 10, scale: 2 }),
  location: text("location"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAnimalSchema = createInsertSchema(animals).omit({ id: true, createdAt: true });
export type InsertAnimal = z.infer<typeof insertAnimalSchema>;
export type Animal = typeof animals.$inferSelect;

export const milkYields = pgTable("milk_yields", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  animalId: varchar("animal_id").notNull(),
  date: text("date").notNull(),
  morningYield: decimal("morning_yield", { precision: 10, scale: 2 }), // in liters
  eveningYield: decimal("evening_yield", { precision: 10, scale: 2 }), // in liters
  totalYield: decimal("total_yield", { precision: 10, scale: 2 }).notNull(),
  quality: text("quality"), // Good, Average, Poor
  recordedBy: varchar("recorded_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMilkYieldSchema = createInsertSchema(milkYields).omit({ id: true, createdAt: true });
export type InsertMilkYield = z.infer<typeof insertMilkYieldSchema>;
export type MilkYield = typeof milkYields.$inferSelect;

export const healthRecords = pgTable("health_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  animalId: varchar("animal_id").notNull(),
  date: text("date").notNull(),
  recordType: text("record_type").notNull(), // Vaccination, Treatment, Checkup
  description: text("description").notNull(),
  veterinarian: text("veterinarian"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  nextDueDate: text("next_due_date"), // for vaccinations
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertHealthRecordSchema = createInsertSchema(healthRecords).omit({ id: true, createdAt: true });
export type InsertHealthRecord = z.infer<typeof insertHealthRecordSchema>;
export type HealthRecord = typeof healthRecords.$inferSelect;

export const animalSales = pgTable("animal_sales", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  animalId: varchar("animal_id").notNull(),
  saleDate: text("sale_date").notNull(),
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }).notNull(),
  buyerName: text("buyer_name"),
  buyerContact: text("buyer_contact"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAnimalSaleSchema = createInsertSchema(animalSales).omit({ id: true, createdAt: true });
export type InsertAnimalSale = z.infer<typeof insertAnimalSaleSchema>;
export type AnimalSale = typeof animalSales.$inferSelect;

// ============================================================================
// FINANCIAL MANAGEMENT
// ============================================================================

export const accounts = pgTable("accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accountCode: text("account_code").notNull().unique(),
  accountName: text("account_name").notNull(),
  accountType: text("account_type").notNull(), // Asset, Liability, Equity, Revenue, Expense
  parentAccountId: varchar("parent_account_id"),
  balance: decimal("balance", { precision: 15, scale: 2 }).notNull().default("0"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAccountSchema = createInsertSchema(accounts).omit({ id: true, createdAt: true });
export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type Account = typeof accounts.$inferSelect;

export const journalEntries = pgTable("journal_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entryDate: text("entry_date").notNull(),
  description: text("description").notNull(),
  reference: text("reference"), // Invoice number, Receipt number, etc.
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({ id: true, createdAt: true });
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;

export const journalLines = pgTable("journal_lines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  journalEntryId: varchar("journal_entry_id").notNull(),
  accountId: varchar("account_id").notNull(),
  debit: decimal("debit", { precision: 15, scale: 2 }).notNull().default("0"),
  credit: decimal("credit", { precision: 15, scale: 2 }).notNull().default("0"),
  description: text("description"),
});

export const insertJournalLineSchema = createInsertSchema(journalLines).omit({ id: true });
export type InsertJournalLine = z.infer<typeof insertJournalLineSchema>;
export type JournalLine = typeof journalLines.$inferSelect;

export const pettyCash = pgTable("petty_cash", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // Travel, Office, Labour, Misc
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: text("type").notNull(), // Income, Expense
  receivedBy: text("received_by"),
  approvedBy: varchar("approved_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPettyCashSchema = createInsertSchema(pettyCash).omit({ id: true, createdAt: true });
export type InsertPettyCash = z.infer<typeof insertPettyCashSchema>;
export type PettyCash = typeof pettyCash.$inferSelect;

// ============================================================================
// AUDIT TRAIL & SYSTEM
// ============================================================================

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  action: text("action").notNull(), // CREATE, UPDATE, DELETE, LOGIN, LOGOUT
  module: text("module").notNull(), // Attendance, Cultivation, Inventory, etc.
  entityType: text("entity_type"), // Plot, Animal, Equipment, etc.
  entityId: varchar("entity_id"),
  changes: jsonb("changes"), // JSON object with before/after values
  ipAddress: text("ip_address"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, timestamp: true });
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
