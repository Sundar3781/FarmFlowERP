import { randomUUID } from "crypto";
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
  AuditLog,
  InsertAuditLog,
} from "@shared/schema";

// ============================================================================
// STORAGE INTERFACE
// ============================================================================

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Attendance
  getAttendanceByDate(date: string): Promise<Attendance[]>;
  getAttendanceByUserId(userId: string, startDate?: string, endDate?: string): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: string, attendance: Partial<InsertAttendance>): Promise<Attendance | undefined>;

  // Work Schedules
  getWorkSchedulesByDate(date: string): Promise<WorkSchedule[]>;
  getWorkSchedulesByUserId(userId: string): Promise<WorkSchedule[]>;
  createWorkSchedule(schedule: InsertWorkSchedule): Promise<WorkSchedule>;
  updateWorkSchedule(id: string, schedule: Partial<InsertWorkSchedule>): Promise<WorkSchedule | undefined>;

  // Plots
  getAllPlots(): Promise<Plot[]>;
  getPlot(id: string): Promise<Plot | undefined>;
  createPlot(plot: InsertPlot): Promise<Plot>;
  updatePlot(id: string, plot: Partial<InsertPlot>): Promise<Plot | undefined>;
  deletePlot(id: string): Promise<boolean>;

  // Plot Activities
  getPlotActivities(plotId: string): Promise<PlotActivity[]>;
  createPlotActivity(activity: InsertPlotActivity): Promise<PlotActivity>;

  // Cultivation Costs
  getCultivationCosts(plotId: string): Promise<CultivationCost[]>;
  createCultivationCost(cost: InsertCultivationCost): Promise<CultivationCost>;

  // Fertilizer Schedules
  getFertilizerSchedules(plotId?: string): Promise<FertilizerSchedule[]>;
  createFertilizerSchedule(schedule: InsertFertilizerSchedule): Promise<FertilizerSchedule>;
  updateFertilizerSchedule(id: string, schedule: Partial<InsertFertilizerSchedule>): Promise<FertilizerSchedule | undefined>;

  // Inventory
  getAllInventoryItems(): Promise<InventoryItem[]>;
  getInventoryItem(id: string): Promise<InventoryItem | undefined>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: string, item: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined>;
  deleteInventoryItem(id: string): Promise<boolean>;

  // Inventory Movements
  getInventoryMovements(itemId?: string): Promise<InventoryMovement[]>;
  createInventoryMovement(movement: InsertInventoryMovement): Promise<InventoryMovement>;

  // Equipment
  getAllEquipment(): Promise<Equipment[]>;
  getEquipment(id: string): Promise<Equipment | undefined>;
  createEquipment(equipment: InsertEquipment): Promise<Equipment>;
  updateEquipment(id: string, equipment: Partial<InsertEquipment>): Promise<Equipment | undefined>;
  deleteEquipment(id: string): Promise<boolean>;

  // Maintenance Records
  getMaintenanceRecords(equipmentId?: string): Promise<MaintenanceRecord[]>;
  createMaintenanceRecord(record: InsertMaintenanceRecord): Promise<MaintenanceRecord>;

  // Fuel Logs
  getFuelLogs(equipmentId?: string): Promise<FuelLog[]>;
  createFuelLog(log: InsertFuelLog): Promise<FuelLog>;

  // Animals
  getAllAnimals(): Promise<Animal[]>;
  getAnimal(id: string): Promise<Animal | undefined>;
  createAnimal(animal: InsertAnimal): Promise<Animal>;
  updateAnimal(id: string, animal: Partial<InsertAnimal>): Promise<Animal | undefined>;
  deleteAnimal(id: string): Promise<boolean>;

  // Milk Yields
  getMilkYields(animalId?: string, startDate?: string, endDate?: string): Promise<MilkYield[]>;
  createMilkYield(yield_: InsertMilkYield): Promise<MilkYield>;

  // Health Records
  getHealthRecords(animalId?: string): Promise<HealthRecord[]>;
  createHealthRecord(record: InsertHealthRecord): Promise<HealthRecord>;

  // Animal Sales
  getAnimalSales(): Promise<AnimalSale[]>;
  createAnimalSale(sale: InsertAnimalSale): Promise<AnimalSale>;

  // Accounts
  getAllAccounts(): Promise<Account[]>;
  getAccount(id: string): Promise<Account | undefined>;
  createAccount(account: InsertAccount): Promise<Account>;
  updateAccount(id: string, account: Partial<InsertAccount>): Promise<Account | undefined>;

  // Journal Entries
  getAllJournalEntries(): Promise<JournalEntry[]>;
  getJournalEntry(id: string): Promise<JournalEntry | undefined>;
  createJournalEntry(entry: InsertJournalEntry, lines: InsertJournalLine[]): Promise<JournalEntry>;

  // Journal Lines
  getJournalLines(journalEntryId: string): Promise<JournalLine[]>;

  // Petty Cash
  getAllPettyCash(): Promise<PettyCash[]>;
  createPettyCash(entry: InsertPettyCash): Promise<PettyCash>;

  // Audit Logs
  getAuditLogs(userId?: string, module?: string): Promise<AuditLog[]>;
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;

  // Dashboard Stats
  getDashboardStats(): Promise<{
    totalPlots: number;
    totalEmployees: number;
    totalAnimals: number;
    inventoryAlerts: number;
  }>;
}

// ============================================================================
// IN-MEMORY STORAGE IMPLEMENTATION
// ============================================================================

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private attendance: Map<string, Attendance>;
  private workSchedules: Map<string, WorkSchedule>;
  private plots: Map<string, Plot>;
  private plotActivities: Map<string, PlotActivity>;
  private cultivationCosts: Map<string, CultivationCost>;
  private fertilizerSchedules: Map<string, FertilizerSchedule>;
  private inventoryItems: Map<string, InventoryItem>;
  private inventoryMovements: Map<string, InventoryMovement>;
  private equipment: Map<string, Equipment>;
  private maintenanceRecords: Map<string, MaintenanceRecord>;
  private fuelLogs: Map<string, FuelLog>;
  private animals: Map<string, Animal>;
  private milkYields: Map<string, MilkYield>;
  private healthRecords: Map<string, HealthRecord>;
  private animalSales: Map<string, AnimalSale>;
  private accounts: Map<string, Account>;
  private journalEntries: Map<string, JournalEntry>;
  private journalLines: Map<string, JournalLine>;
  private pettyCash: Map<string, PettyCash>;
  private auditLogs: Map<string, AuditLog>;

  constructor() {
    this.users = new Map();
    this.attendance = new Map();
    this.workSchedules = new Map();
    this.plots = new Map();
    this.plotActivities = new Map();
    this.cultivationCosts = new Map();
    this.fertilizerSchedules = new Map();
    this.inventoryItems = new Map();
    this.inventoryMovements = new Map();
    this.equipment = new Map();
    this.maintenanceRecords = new Map();
    this.fuelLogs = new Map();
    this.animals = new Map();
    this.milkYields = new Map();
    this.healthRecords = new Map();
    this.animalSales = new Map();
    this.accounts = new Map();
    this.journalEntries = new Map();
    this.journalLines = new Map();
    this.pettyCash = new Map();
    this.auditLogs = new Map();

    this.initializeSeedData();
  }

  // ========== USERS ==========

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // ========== ATTENDANCE ==========

  async getAttendanceByDate(date: string): Promise<Attendance[]> {
    return Array.from(this.attendance.values()).filter((a) => a.date === date);
  }

  async getAttendanceByUserId(
    userId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Attendance[]> {
    let records = Array.from(this.attendance.values()).filter(
      (a) => a.userId === userId
    );
    if (startDate) {
      records = records.filter((a) => a.date >= startDate);
    }
    if (endDate) {
      records = records.filter((a) => a.date <= endDate);
    }
    return records;
  }

  async createAttendance(insertAttendance: InsertAttendance): Promise<Attendance> {
    const id = randomUUID();
    const attendance: Attendance = {
      ...insertAttendance,
      id,
      createdAt: new Date(),
    };
    this.attendance.set(id, attendance);
    return attendance;
  }

  async updateAttendance(
    id: string,
    updates: Partial<InsertAttendance>
  ): Promise<Attendance | undefined> {
    const attendance = this.attendance.get(id);
    if (!attendance) return undefined;
    const updated = { ...attendance, ...updates };
    this.attendance.set(id, updated);
    return updated;
  }

  // ========== WORK SCHEDULES ==========

  async getWorkSchedulesByDate(date: string): Promise<WorkSchedule[]> {
    return Array.from(this.workSchedules.values()).filter((s) => s.date === date);
  }

  async getWorkSchedulesByUserId(userId: string): Promise<WorkSchedule[]> {
    return Array.from(this.workSchedules.values()).filter(
      (s) => s.userId === userId
    );
  }

  async createWorkSchedule(
    insertSchedule: InsertWorkSchedule
  ): Promise<WorkSchedule> {
    const id = randomUUID();
    const schedule: WorkSchedule = {
      ...insertSchedule,
      id,
      createdAt: new Date(),
    };
    this.workSchedules.set(id, schedule);
    return schedule;
  }

  async updateWorkSchedule(
    id: string,
    updates: Partial<InsertWorkSchedule>
  ): Promise<WorkSchedule | undefined> {
    const schedule = this.workSchedules.get(id);
    if (!schedule) return undefined;
    const updated = { ...schedule, ...updates };
    this.workSchedules.set(id, updated);
    return updated;
  }

  // ========== PLOTS ==========

  async getAllPlots(): Promise<Plot[]> {
    return Array.from(this.plots.values());
  }

  async getPlot(id: string): Promise<Plot | undefined> {
    return this.plots.get(id);
  }

  async createPlot(insertPlot: InsertPlot): Promise<Plot> {
    const id = randomUUID();
    const plot: Plot = { ...insertPlot, id, createdAt: new Date() };
    this.plots.set(id, plot);
    return plot;
  }

  async updatePlot(
    id: string,
    updates: Partial<InsertPlot>
  ): Promise<Plot | undefined> {
    const plot = this.plots.get(id);
    if (!plot) return undefined;
    const updated = { ...plot, ...updates };
    this.plots.set(id, updated);
    return updated;
  }

  async deletePlot(id: string): Promise<boolean> {
    return this.plots.delete(id);
  }

  // ========== PLOT ACTIVITIES ==========

  async getPlotActivities(plotId: string): Promise<PlotActivity[]> {
    return Array.from(this.plotActivities.values()).filter(
      (a) => a.plotId === plotId
    );
  }

  async createPlotActivity(
    insertActivity: InsertPlotActivity
  ): Promise<PlotActivity> {
    const id = randomUUID();
    const activity: PlotActivity = {
      ...insertActivity,
      id,
      createdAt: new Date(),
    };
    this.plotActivities.set(id, activity);
    return activity;
  }

  // ========== CULTIVATION COSTS ==========

  async getCultivationCosts(plotId: string): Promise<CultivationCost[]> {
    return Array.from(this.cultivationCosts.values()).filter(
      (c) => c.plotId === plotId
    );
  }

  async createCultivationCost(
    insertCost: InsertCultivationCost
  ): Promise<CultivationCost> {
    const id = randomUUID();
    const cost: CultivationCost = {
      ...insertCost,
      id,
      createdAt: new Date(),
    };
    this.cultivationCosts.set(id, cost);
    return cost;
  }

  // ========== FERTILIZER SCHEDULES ==========

  async getFertilizerSchedules(plotId?: string): Promise<FertilizerSchedule[]> {
    let schedules = Array.from(this.fertilizerSchedules.values());
    if (plotId) {
      schedules = schedules.filter((s) => s.plotId === plotId);
    }
    return schedules;
  }

  async createFertilizerSchedule(
    insertSchedule: InsertFertilizerSchedule
  ): Promise<FertilizerSchedule> {
    const id = randomUUID();
    const schedule: FertilizerSchedule = {
      ...insertSchedule,
      id,
      createdAt: new Date(),
    };
    this.fertilizerSchedules.set(id, schedule);
    return schedule;
  }

  async updateFertilizerSchedule(
    id: string,
    updates: Partial<InsertFertilizerSchedule>
  ): Promise<FertilizerSchedule | undefined> {
    const schedule = this.fertilizerSchedules.get(id);
    if (!schedule) return undefined;
    const updated = { ...schedule, ...updates };
    this.fertilizerSchedules.set(id, updated);
    return updated;
  }

  // ========== INVENTORY ==========

  async getAllInventoryItems(): Promise<InventoryItem[]> {
    return Array.from(this.inventoryItems.values());
  }

  async getInventoryItem(id: string): Promise<InventoryItem | undefined> {
    return this.inventoryItems.get(id);
  }

  async createInventoryItem(insertItem: InsertInventoryItem): Promise<InventoryItem> {
    const id = randomUUID();
    const item: InventoryItem = { ...insertItem, id, createdAt: new Date() };
    this.inventoryItems.set(id, item);
    return item;
  }

  async updateInventoryItem(
    id: string,
    updates: Partial<InsertInventoryItem>
  ): Promise<InventoryItem | undefined> {
    const item = this.inventoryItems.get(id);
    if (!item) return undefined;
    const updated = { ...item, ...updates };
    this.inventoryItems.set(id, updated);
    return updated;
  }

  async deleteInventoryItem(id: string): Promise<boolean> {
    return this.inventoryItems.delete(id);
  }

  // ========== INVENTORY MOVEMENTS ==========

  async getInventoryMovements(itemId?: string): Promise<InventoryMovement[]> {
    let movements = Array.from(this.inventoryMovements.values());
    if (itemId) {
      movements = movements.filter((m) => m.itemId === itemId);
    }
    return movements;
  }

  async createInventoryMovement(
    insertMovement: InsertInventoryMovement
  ): Promise<InventoryMovement> {
    const id = randomUUID();
    const movement: InventoryMovement = {
      ...insertMovement,
      id,
      createdAt: new Date(),
    };
    this.inventoryMovements.set(id, movement);

    // Update inventory item stock
    const item = this.inventoryItems.get(insertMovement.itemId);
    if (item) {
      const quantity = parseFloat(insertMovement.quantity as any);
      if (insertMovement.movementType === "IN") {
        item.currentStock = (parseFloat(item.currentStock as any) + quantity).toString() as any;
      } else if (insertMovement.movementType === "OUT") {
        item.currentStock = (parseFloat(item.currentStock as any) - quantity).toString() as any;
      } else if (insertMovement.movementType === "ADJUSTMENT") {
        item.currentStock = quantity.toString() as any;
      }
      this.inventoryItems.set(item.id, item);
    }

    return movement;
  }

  // ========== EQUIPMENT ==========

  async getAllEquipment(): Promise<Equipment[]> {
    return Array.from(this.equipment.values());
  }

  async getEquipment(id: string): Promise<Equipment | undefined> {
    return this.equipment.get(id);
  }

  async createEquipment(insertEquipment: InsertEquipment): Promise<Equipment> {
    const id = randomUUID();
    const equipment: Equipment = {
      ...insertEquipment,
      id,
      createdAt: new Date(),
    };
    this.equipment.set(id, equipment);
    return equipment;
  }

  async updateEquipment(
    id: string,
    updates: Partial<InsertEquipment>
  ): Promise<Equipment | undefined> {
    const equipment = this.equipment.get(id);
    if (!equipment) return undefined;
    const updated = { ...equipment, ...updates };
    this.equipment.set(id, updated);
    return updated;
  }

  async deleteEquipment(id: string): Promise<boolean> {
    return this.equipment.delete(id);
  }

  // ========== MAINTENANCE RECORDS ==========

  async getMaintenanceRecords(equipmentId?: string): Promise<MaintenanceRecord[]> {
    let records = Array.from(this.maintenanceRecords.values());
    if (equipmentId) {
      records = records.filter((r) => r.equipmentId === equipmentId);
    }
    return records;
  }

  async createMaintenanceRecord(
    insertRecord: InsertMaintenanceRecord
  ): Promise<MaintenanceRecord> {
    const id = randomUUID();
    const record: MaintenanceRecord = {
      ...insertRecord,
      id,
      createdAt: new Date(),
    };
    this.maintenanceRecords.set(id, record);
    return record;
  }

  // ========== FUEL LOGS ==========

  async getFuelLogs(equipmentId?: string): Promise<FuelLog[]> {
    let logs = Array.from(this.fuelLogs.values());
    if (equipmentId) {
      logs = logs.filter((l) => l.equipmentId === equipmentId);
    }
    return logs;
  }

  async createFuelLog(insertLog: InsertFuelLog): Promise<FuelLog> {
    const id = randomUUID();
    const log: FuelLog = { ...insertLog, id, createdAt: new Date() };
    this.fuelLogs.set(id, log);
    return log;
  }

  // ========== ANIMALS ==========

  async getAllAnimals(): Promise<Animal[]> {
    return Array.from(this.animals.values());
  }

  async getAnimal(id: string): Promise<Animal | undefined> {
    return this.animals.get(id);
  }

  async createAnimal(insertAnimal: InsertAnimal): Promise<Animal> {
    const id = randomUUID();
    const animal: Animal = { ...insertAnimal, id, createdAt: new Date() };
    this.animals.set(id, animal);
    return animal;
  }

  async updateAnimal(
    id: string,
    updates: Partial<InsertAnimal>
  ): Promise<Animal | undefined> {
    const animal = this.animals.get(id);
    if (!animal) return undefined;
    const updated = { ...animal, ...updates };
    this.animals.set(id, updated);
    return updated;
  }

  async deleteAnimal(id: string): Promise<boolean> {
    return this.animals.delete(id);
  }

  // ========== MILK YIELDS ==========

  async getMilkYields(
    animalId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<MilkYield[]> {
    let yields = Array.from(this.milkYields.values());
    if (animalId) {
      yields = yields.filter((y) => y.animalId === animalId);
    }
    if (startDate) {
      yields = yields.filter((y) => y.date >= startDate);
    }
    if (endDate) {
      yields = yields.filter((y) => y.date <= endDate);
    }
    return yields;
  }

  async createMilkYield(insertYield: InsertMilkYield): Promise<MilkYield> {
    const id = randomUUID();
    const yield_: MilkYield = { ...insertYield, id, createdAt: new Date() };
    this.milkYields.set(id, yield_);
    return yield_;
  }

  // ========== HEALTH RECORDS ==========

  async getHealthRecords(animalId?: string): Promise<HealthRecord[]> {
    let records = Array.from(this.healthRecords.values());
    if (animalId) {
      records = records.filter((r) => r.animalId === animalId);
    }
    return records;
  }

  async createHealthRecord(insertRecord: InsertHealthRecord): Promise<HealthRecord> {
    const id = randomUUID();
    const record: HealthRecord = {
      ...insertRecord,
      id,
      createdAt: new Date(),
    };
    this.healthRecords.set(id, record);
    return record;
  }

  // ========== ANIMAL SALES ==========

  async getAnimalSales(): Promise<AnimalSale[]> {
    return Array.from(this.animalSales.values());
  }

  async createAnimalSale(insertSale: InsertAnimalSale): Promise<AnimalSale> {
    const id = randomUUID();
    const sale: AnimalSale = { ...insertSale, id, createdAt: new Date() };
    this.animalSales.set(id, sale);
    return sale;
  }

  // ========== ACCOUNTS ==========

  async getAllAccounts(): Promise<Account[]> {
    return Array.from(this.accounts.values());
  }

  async getAccount(id: string): Promise<Account | undefined> {
    return this.accounts.get(id);
  }

  async createAccount(insertAccount: InsertAccount): Promise<Account> {
    const id = randomUUID();
    const account: Account = { ...insertAccount, id, createdAt: new Date() };
    this.accounts.set(id, account);
    return account;
  }

  async updateAccount(
    id: string,
    updates: Partial<InsertAccount>
  ): Promise<Account | undefined> {
    const account = this.accounts.get(id);
    if (!account) return undefined;
    const updated = { ...account, ...updates };
    this.accounts.set(id, updated);
    return updated;
  }

  // ========== JOURNAL ENTRIES ==========

  async getAllJournalEntries(): Promise<JournalEntry[]> {
    return Array.from(this.journalEntries.values());
  }

  async getJournalEntry(id: string): Promise<JournalEntry | undefined> {
    return this.journalEntries.get(id);
  }

  async createJournalEntry(
    insertEntry: InsertJournalEntry,
    lines: InsertJournalLine[]
  ): Promise<JournalEntry> {
    const id = randomUUID();
    const entry: JournalEntry = { ...insertEntry, id, createdAt: new Date() };
    this.journalEntries.set(id, entry);

    // Create journal lines
    for (const line of lines) {
      const lineId = randomUUID();
      const journalLine: JournalLine = { ...line, id: lineId, journalEntryId: id };
      this.journalLines.set(lineId, journalLine);

      // Update account balance
      const account = this.accounts.get(line.accountId);
      if (account) {
        const debit = parseFloat(line.debit as any);
        const credit = parseFloat(line.credit as any);
        const currentBalance = parseFloat(account.balance as any);
        account.balance = (currentBalance + debit - credit).toString() as any;
        this.accounts.set(account.id, account);
      }
    }

    return entry;
  }

  async getJournalLines(journalEntryId: string): Promise<JournalLine[]> {
    return Array.from(this.journalLines.values()).filter(
      (l) => l.journalEntryId === journalEntryId
    );
  }

  // ========== PETTY CASH ==========

  async getAllPettyCash(): Promise<PettyCash[]> {
    return Array.from(this.pettyCash.values());
  }

  async createPettyCash(insertEntry: InsertPettyCash): Promise<PettyCash> {
    const id = randomUUID();
    const entry: PettyCash = { ...insertEntry, id, createdAt: new Date() };
    this.pettyCash.set(id, entry);
    return entry;
  }

  // ========== AUDIT LOGS ==========

  async getAuditLogs(userId?: string, module?: string): Promise<AuditLog[]> {
    let logs = Array.from(this.auditLogs.values());
    if (userId) {
      logs = logs.filter((l) => l.userId === userId);
    }
    if (module) {
      logs = logs.filter((l) => l.module === module);
    }
    return logs;
  }

  async createAuditLog(insertLog: InsertAuditLog): Promise<AuditLog> {
    const id = randomUUID();
    const log: AuditLog = { ...insertLog, id, timestamp: new Date() };
    this.auditLogs.set(id, log);
    return log;
  }

  // ========== DASHBOARD STATS ==========

  async getDashboardStats(): Promise<{
    totalPlots: number;
    totalEmployees: number;
    totalAnimals: number;
    inventoryAlerts: number;
  }> {
    const totalPlots = this.plots.size;
    const totalEmployees = this.users.size;
    const totalAnimals = this.animals.size;

    // Count inventory items with low stock
    const inventoryAlerts = Array.from(this.inventoryItems.values()).filter(
      (item) => parseFloat(item.currentStock as any) <= parseFloat(item.reorderLevel as any)
    ).length;

    return {
      totalPlots,
      totalEmployees,
      totalAnimals,
      inventoryAlerts,
    };
  }

  // ========== SEED DATA ==========

  private initializeSeedData() {
    // Create demo users
    const demoUsers = [
      {
        username: "admin",
        password: "admin",
        fullName: "Admin User",
        role: "Admin",
        email: "admin@farm.com",
        phone: null,
        isActive: true,
      },
      {
        username: "manager",
        password: "manager",
        fullName: "Farm Manager",
        role: "Manager",
        email: "manager@farm.com",
        phone: null,
        isActive: true,
      },
      {
        username: "user",
        password: "user",
        fullName: "Farm Operator",
        role: "Operator",
        email: "user@farm.com",
        phone: null,
        isActive: true,
      },
    ];

    for (const userData of demoUsers) {
      const id = randomUUID();
      const user: User = { ...userData, id, createdAt: new Date() };
      this.users.set(id, user);
    }
  }
}

// Use DatabaseStorage for production
import { DatabaseStorage } from "./db-storage";
export const storage = new DatabaseStorage();

// Seed database with demo users and sample data on startup
async function seedDatabase() {
  try {
    // Check if users exist
    const existingUser = await storage.getUserByUsername("admin");
    if (existingUser) {
      console.log("Database already seeded");
      return;
    }

    // Create demo users
    const demoUsers = [
      {
        username: "admin",
        password: "admin",
        fullName: "Admin User",
        role: "Admin",
        email: "admin@farm.com",
        phone: null,
        isActive: true,
      },
      {
        username: "manager",
        password: "manager",
        fullName: "Farm Manager",
        role: "Manager",
        email: "manager@farm.com",
        phone: null,
        isActive: true,
      },
      {
        username: "rajesh",
        password: "password",
        fullName: "Rajesh Kumar",
        role: "Supervisor",
        email: "rajesh@farm.com",
        phone: "+91 98765 43210",
        isActive: true,
      },
      {
        username: "priya",
        password: "password",
        fullName: "Priya Sharma",
        role: "Operator",
        email: "priya@farm.com",
        phone: "+91 98765 43211",
        isActive: true,
      },
      {
        username: "arun",
        password: "password",
        fullName: "Arun Patel",
        role: "Operator",
        email: "arun@farm.com",
        phone: "+91 98765 43212",
        isActive: true,
      },
      {
        username: "meena",
        password: "password",
        fullName: "Meena Devi",
        role: "Operator",
        email: "meena@farm.com",
        phone: "+91 98765 43213",
        isActive: true,
      },
      {
        username: "suresh",
        password: "password",
        fullName: "Suresh Babu",
        role: "Operator",
        email: "suresh@farm.com",
        phone: "+91 98765 43214",
        isActive: true,
      },
    ];

    const users = [];
    for (const userData of demoUsers) {
      const user = await storage.createUser(userData);
      users.push(user);
    }

    // Create attendance records for today
    const today = format(new Date(), "yyyy-MM-dd");
    const attendanceData = [
      {
        userId: users[2].id,
        date: today,
        status: "Present" as const,
        checkIn: "08:45:00",
        checkOut: "17:30:00",
        workHours: 8.75,
      },
      {
        userId: users[3].id,
        date: today,
        status: "Present" as const,
        checkIn: "09:00:00",
        checkOut: "17:45:00",
        workHours: 8.75,
      },
      {
        userId: users[4].id,
        date: today,
        status: "Late" as const,
        checkIn: "09:30:00",
        checkOut: null,
        workHours: null,
      },
      {
        userId: users[5].id,
        date: today,
        status: "Absent" as const,
        checkIn: null,
        checkOut: null,
        workHours: 0,
      },
      {
        userId: users[6].id,
        date: today,
        status: "Present" as const,
        checkIn: "08:30:00",
        checkOut: "17:15:00",
        workHours: 8.75,
      },
    ];

    for (const attendance of attendanceData) {
      await storage.createAttendance(attendance);
    }

    console.log("Database seeded with demo users and attendance data");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Seed on module load
seedDatabase();
