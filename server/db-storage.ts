// Database storage implementation using Drizzle ORM
import { db } from "./db";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { format } from "date-fns";
import type {
  User,
  InsertUser,
  Attendance,
  InsertAttendance,
  WorkSchedule,
  InsertWorkSchedule,
  Plot,
  InsertPlot,
  PlotActivity,
  InsertPlotActivity,
  CultivationCost,
  InsertCultivationCost,
  FertilizerSchedule,
  InsertFertilizerSchedule,
  InventoryItem,
  InsertInventoryItem,
  InventoryMovement,
  InsertInventoryMovement,
  Equipment,
  InsertEquipment,
  MaintenanceRecord,
  InsertMaintenanceRecord,
  FuelLog,
  InsertFuelLog,
  Animal,
  InsertAnimal,
  MilkYield,
  InsertMilkYield,
  HealthRecord,
  InsertHealthRecord,
  AnimalSale,
  InsertAnimalSale,
  Account,
  InsertAccount,
  JournalEntry,
  InsertJournalEntry,
  JournalLine,
  InsertJournalLine,
  PettyCash,
  InsertPettyCash,
  Expense,
  InsertExpense,
  AuditLog,
  InsertAuditLog,
} from "@shared/schema";
import {
  users,
  attendanceRecords,
  workSchedules,
  plots,
  plotActivities,
  cultivationCosts,
  fertilizerSchedules,
  inventoryItems,
  inventoryMovements,
  equipment,
  maintenanceRecords,
  fuelLogs,
  animals,
  milkYields,
  healthRecords,
  animalSales,
  accounts,
  journalEntries,
  journalLines,
  pettyCash,
  expenses,
  auditLogs,
} from "@shared/schema";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // ========== USERS ==========

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // ========== ATTENDANCE ==========

  async getAttendanceByDate(date: string): Promise<Attendance[]> {
    return await db
      .select()
      .from(attendanceRecords)
      .where(eq(attendanceRecords.date, date));
  }

  async getAttendanceByUserId(
    userId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Attendance[]> {
    const conditions = [eq(attendanceRecords.userId, userId)];
    if (startDate) conditions.push(gte(attendanceRecords.date, startDate));
    if (endDate) conditions.push(lte(attendanceRecords.date, endDate));

    return await db
      .select()
      .from(attendanceRecords)
      .where(and(...conditions));
  }

  async createAttendance(insertAttendance: InsertAttendance): Promise<Attendance> {
    const [attendance] = await db
      .insert(attendanceRecords)
      .values(insertAttendance)
      .returning();
    return attendance;
  }

  async updateAttendance(
    id: string,
    updates: Partial<InsertAttendance>
  ): Promise<Attendance | undefined> {
    const [attendance] = await db
      .update(attendanceRecords)
      .set(updates)
      .where(eq(attendanceRecords.id, id))
      .returning();
    return attendance;
  }

  // ========== WORK SCHEDULES ==========

  async getWorkSchedulesByDate(date: string): Promise<WorkSchedule[]> {
    return await db.select().from(workSchedules).where(eq(workSchedules.date, date));
  }

  async getWorkSchedulesByUserId(userId: string): Promise<WorkSchedule[]> {
    return await db.select().from(workSchedules).where(eq(workSchedules.userId, userId));
  }

  async createWorkSchedule(insertSchedule: InsertWorkSchedule): Promise<WorkSchedule> {
    const [schedule] = await db
      .insert(workSchedules)
      .values(insertSchedule)
      .returning();
    return schedule;
  }

  async updateWorkSchedule(
    id: string,
    updates: Partial<InsertWorkSchedule>
  ): Promise<WorkSchedule | undefined> {
    const [schedule] = await db
      .update(workSchedules)
      .set(updates)
      .where(eq(workSchedules.id, id))
      .returning();
    return schedule;
  }

  // ========== PLOTS ==========

  async getAllPlots(): Promise<Plot[]> {
    return await db.select().from(plots);
  }

  async getPlot(id: string): Promise<Plot | undefined> {
    const [plot] = await db.select().from(plots).where(eq(plots.id, id));
    return plot;
  }

  async createPlot(insertPlot: InsertPlot): Promise<Plot> {
    const [plot] = await db.insert(plots).values(insertPlot).returning();
    return plot;
  }

  async updatePlot(id: string, updates: Partial<InsertPlot>): Promise<Plot | undefined> {
    const [plot] = await db
      .update(plots)
      .set(updates)
      .where(eq(plots.id, id))
      .returning();
    return plot;
  }

  async deletePlot(id: string): Promise<boolean> {
    const result = await db.delete(plots).where(eq(plots.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // ========== PLOT ACTIVITIES ==========

  async getPlotActivities(plotId: string): Promise<PlotActivity[]> {
    return await db
      .select()
      .from(plotActivities)
      .where(eq(plotActivities.plotId, plotId));
  }

  async createPlotActivity(insertActivity: InsertPlotActivity): Promise<PlotActivity> {
    const [activity] = await db
      .insert(plotActivities)
      .values(insertActivity)
      .returning();
    return activity;
  }

  // ========== CULTIVATION COSTS ==========

  async getCultivationCosts(plotId: string): Promise<CultivationCost[]> {
    return await db
      .select()
      .from(cultivationCosts)
      .where(eq(cultivationCosts.plotId, plotId));
  }

  async createCultivationCost(insertCost: InsertCultivationCost): Promise<CultivationCost> {
    const [cost] = await db.insert(cultivationCosts).values(insertCost).returning();
    return cost;
  }

  // ========== FERTILIZER SCHEDULES ==========

  async getFertilizerSchedules(plotId?: string): Promise<FertilizerSchedule[]> {
    if (plotId) {
      return await db
        .select()
        .from(fertilizerSchedules)
        .where(eq(fertilizerSchedules.plotId, plotId));
    }
    return await db.select().from(fertilizerSchedules);
  }

  async createFertilizerSchedule(
    insertSchedule: InsertFertilizerSchedule
  ): Promise<FertilizerSchedule> {
    const [schedule] = await db
      .insert(fertilizerSchedules)
      .values(insertSchedule)
      .returning();
    return schedule;
  }

  async updateFertilizerSchedule(
    id: string,
    updates: Partial<InsertFertilizerSchedule>
  ): Promise<FertilizerSchedule | undefined> {
    const [schedule] = await db
      .update(fertilizerSchedules)
      .set(updates)
      .where(eq(fertilizerSchedules.id, id))
      .returning();
    return schedule;
  }

  // ========== INVENTORY ==========

  async getAllInventoryItems(): Promise<InventoryItem[]> {
    return await db.select().from(inventoryItems);
  }

  async getInventoryItem(id: string): Promise<InventoryItem | undefined> {
    const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id));
    return item;
  }

  async createInventoryItem(insertItem: InsertInventoryItem): Promise<InventoryItem> {
    const [item] = await db.insert(inventoryItems).values(insertItem).returning();
    return item;
  }

  async updateInventoryItem(
    id: string,
    updates: Partial<InsertInventoryItem>
  ): Promise<InventoryItem | undefined> {
    const [item] = await db
      .update(inventoryItems)
      .set(updates)
      .where(eq(inventoryItems.id, id))
      .returning();
    return item;
  }

  async deleteInventoryItem(id: string): Promise<boolean> {
    const result = await db.delete(inventoryItems).where(eq(inventoryItems.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // ========== INVENTORY MOVEMENTS ==========

  async getInventoryMovements(itemId?: string): Promise<InventoryMovement[]> {
    if (itemId) {
      return await db
        .select()
        .from(inventoryMovements)
        .where(eq(inventoryMovements.itemId, itemId));
    }
    return await db.select().from(inventoryMovements);
  }

  async createInventoryMovement(
    insertMovement: InsertInventoryMovement
  ): Promise<InventoryMovement> {
    const [movement] = await db
      .insert(inventoryMovements)
      .values(insertMovement)
      .returning();

    // Update inventory item stock
    const item = await this.getInventoryItem(insertMovement.itemId);
    if (item) {
      const quantity = parseFloat(insertMovement.quantity as any);
      const currentStock = parseFloat(item.currentStock as any);
      let newStock = currentStock;

      if (insertMovement.movementType === "IN") {
        newStock = currentStock + quantity;
      } else if (insertMovement.movementType === "OUT") {
        newStock = currentStock - quantity;
      } else if (insertMovement.movementType === "ADJUSTMENT") {
        newStock = quantity;
      }

      await db
        .update(inventoryItems)
        .set({ currentStock: newStock.toString() as any })
        .where(eq(inventoryItems.id, insertMovement.itemId));
    }

    return movement;
  }

  // ========== EQUIPMENT ==========

  async getAllEquipment(): Promise<Equipment[]> {
    return await db.select().from(equipment);
  }

  async getEquipment(id: string): Promise<Equipment | undefined> {
    const [equip] = await db.select().from(equipment).where(eq(equipment.id, id));
    return equip;
  }

  async createEquipment(insertEquipment: InsertEquipment): Promise<Equipment> {
    const [equip] = await db.insert(equipment).values(insertEquipment).returning();
    return equip;
  }

  async updateEquipment(
    id: string,
    updates: Partial<InsertEquipment>
  ): Promise<Equipment | undefined> {
    const [equip] = await db
      .update(equipment)
      .set(updates)
      .where(eq(equipment.id, id))
      .returning();
    return equip;
  }

  async deleteEquipment(id: string): Promise<boolean> {
    const result = await db.delete(equipment).where(eq(equipment.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // ========== MAINTENANCE RECORDS ==========

  async getMaintenanceRecords(equipmentId?: string): Promise<MaintenanceRecord[]> {
    if (equipmentId) {
      return await db
        .select()
        .from(maintenanceRecords)
        .where(eq(maintenanceRecords.equipmentId, equipmentId));
    }
    return await db.select().from(maintenanceRecords);
  }

  async createMaintenanceRecord(
    insertRecord: InsertMaintenanceRecord
  ): Promise<MaintenanceRecord> {
    const [record] = await db
      .insert(maintenanceRecords)
      .values(insertRecord)
      .returning();
    return record;
  }

  // ========== FUEL LOGS ==========

  async getFuelLogs(equipmentId?: string): Promise<FuelLog[]> {
    if (equipmentId) {
      return await db
        .select()
        .from(fuelLogs)
        .where(eq(fuelLogs.equipmentId, equipmentId));
    }
    return await db.select().from(fuelLogs);
  }

  async createFuelLog(insertLog: InsertFuelLog): Promise<FuelLog> {
    const [log] = await db.insert(fuelLogs).values(insertLog).returning();
    return log;
  }

  // ========== ANIMALS ==========

  async getAllAnimals(): Promise<Animal[]> {
    return await db.select().from(animals);
  }

  async getAnimal(id: string): Promise<Animal | undefined> {
    const [animal] = await db.select().from(animals).where(eq(animals.id, id));
    return animal;
  }

  async createAnimal(insertAnimal: InsertAnimal): Promise<Animal> {
    const [animal] = await db.insert(animals).values(insertAnimal).returning();
    return animal;
  }

  async updateAnimal(
    id: string,
    updates: Partial<InsertAnimal>
  ): Promise<Animal | undefined> {
    const [animal] = await db
      .update(animals)
      .set(updates)
      .where(eq(animals.id, id))
      .returning();
    return animal;
  }

  async deleteAnimal(id: string): Promise<boolean> {
    const result = await db.delete(animals).where(eq(animals.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // ========== MILK YIELDS ==========

  async getMilkYields(
    animalId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<MilkYield[]> {
    const conditions = [];
    if (animalId) conditions.push(eq(milkYields.animalId, animalId));
    if (startDate) conditions.push(gte(milkYields.date, startDate));
    if (endDate) conditions.push(lte(milkYields.date, endDate));

    if (conditions.length > 0) {
      return await db.select().from(milkYields).where(and(...conditions));
    }
    return await db.select().from(milkYields);
  }

  async createMilkYield(insertYield: InsertMilkYield): Promise<MilkYield> {
    const [yield_] = await db.insert(milkYields).values(insertYield).returning();
    return yield_;
  }

  // ========== HEALTH RECORDS ==========

  async getHealthRecords(animalId?: string): Promise<HealthRecord[]> {
    if (animalId) {
      return await db
        .select()
        .from(healthRecords)
        .where(eq(healthRecords.animalId, animalId));
    }
    return await db.select().from(healthRecords);
  }

  async createHealthRecord(insertRecord: InsertHealthRecord): Promise<HealthRecord> {
    const [record] = await db.insert(healthRecords).values(insertRecord).returning();
    return record;
  }

  // ========== ANIMAL SALES ==========

  async getAnimalSales(): Promise<AnimalSale[]> {
    return await db.select().from(animalSales);
  }

  async createAnimalSale(insertSale: InsertAnimalSale): Promise<AnimalSale> {
    const [sale] = await db.insert(animalSales).values(insertSale).returning();
    return sale;
  }

  // ========== ACCOUNTS ==========

  async getAllAccounts(): Promise<Account[]> {
    return await db.select().from(accounts);
  }

  async getAccount(id: string): Promise<Account | undefined> {
    const [account] = await db.select().from(accounts).where(eq(accounts.id, id));
    return account;
  }

  async createAccount(insertAccount: InsertAccount): Promise<Account> {
    const [account] = await db.insert(accounts).values(insertAccount).returning();
    return account;
  }

  async updateAccount(
    id: string,
    updates: Partial<InsertAccount>
  ): Promise<Account | undefined> {
    const [account] = await db
      .update(accounts)
      .set(updates)
      .where(eq(accounts.id, id))
      .returning();
    return account;
  }

  // ========== JOURNAL ENTRIES ==========

  async getAllJournalEntries(): Promise<JournalEntry[]> {
    return await db.select().from(journalEntries);
  }

  async getJournalEntry(id: string): Promise<JournalEntry | undefined> {
    const [entry] = await db.select().from(journalEntries).where(eq(journalEntries.id, id));
    return entry;
  }

  async createJournalEntry(
    insertEntry: InsertJournalEntry,
    lines: InsertJournalLine[]
  ): Promise<JournalEntry> {
    const [entry] = await db.insert(journalEntries).values(insertEntry).returning();

    // Create journal lines
    for (const line of lines) {
      await db.insert(journalLines).values({
        ...line,
        journalEntryId: entry.id,
      });

      // Update account balance
      const debit = parseFloat(line.debit as any);
      const credit = parseFloat(line.credit as any);

      await db
        .update(accounts)
        .set({
          balance: sql`${accounts.balance} + ${debit} - ${credit}`,
        })
        .where(eq(accounts.accountId, line.accountId));
    }

    return entry;
  }

  async getJournalLines(journalEntryId: string): Promise<JournalLine[]> {
    return await db
      .select()
      .from(journalLines)
      .where(eq(journalLines.journalEntryId, journalEntryId));
  }

  // ========== PETTY CASH ==========

  async getAllPettyCash(): Promise<PettyCash[]> {
    return await db.select().from(pettyCash);
  }

  async createPettyCash(insertEntry: InsertPettyCash): Promise<PettyCash> {
    const [entry] = await db.insert(pettyCash).values(insertEntry).returning();
    return entry;
  }

  // ========== EXPENSES ==========

  async getAllExpenses(): Promise<Expense[]> {
    return await db.select().from(expenses);
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const [expense] = await db.insert(expenses).values(insertExpense).returning();
    return expense;
  }

  // ========== AUDIT LOGS ==========

  async getAuditLogs(userId?: string, module?: string): Promise<AuditLog[]> {
    const conditions = [];
    if (userId) conditions.push(eq(auditLogs.userId, userId));
    if (module) conditions.push(eq(auditLogs.module, module));

    if (conditions.length > 0) {
      return await db.select().from(auditLogs).where(and(...conditions));
    }
    return await db.select().from(auditLogs);
  }

  async createAuditLog(insertLog: InsertAuditLog): Promise<AuditLog> {
    const [log] = await db.insert(auditLogs).values(insertLog).returning();
    return log;
  }

  // ========== DASHBOARD STATS ==========

  async getDashboardStats(): Promise<{
    totalPlots: number;
    totalEmployees: number;
    totalAnimals: number;
    inventoryAlerts: number;
  }> {
    const [plotsCount] = await db.select({ count: sql<number>`count(*)` }).from(plots);
    const [usersCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [animalsCount] = await db.select({ count: sql<number>`count(*)` }).from(animals);

    // Count inventory items with low stock
    const lowStockItems = await db
      .select()
      .from(inventoryItems)
      .where(sql`CAST(${inventoryItems.currentStock} AS DECIMAL) <= CAST(${inventoryItems.reorderLevel} AS DECIMAL)`);

    return {
      totalPlots: plotsCount.count || 0,
      totalEmployees: usersCount.count || 0,
      totalAnimals: animalsCount.count || 0,
      inventoryAlerts: lowStockItems.length,
    };
  }
}
