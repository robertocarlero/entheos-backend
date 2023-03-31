import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

/* Modules */
import * as Auth from './modules/auth';
import * as Customers from './modules/customers';
import * as Devices from './modules/devices';
import * as Notifications from './modules/notifications';
import * as Products from './modules/products';
import * as Sales from './modules/sales';
import * as Schedules from './modules/schedules';
import * as Tasks from './modules/tasks';
import * as Team from './modules/team';
import * as Transactions from './modules/transactions';

export const auth = Auth;
export const customers = Customers;
export const devices = Devices;
export const notifications = Notifications;
export const products = Products;
export const sales = Sales;
export const schedules = Schedules;
export const tasks = Tasks;
export const team = Team;
export const transactions = Transactions;
