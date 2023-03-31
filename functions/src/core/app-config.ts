export class AppConfig {
	/* Paths */
	public static PATH_CUSTOMERS = 'customers';
	public static PATH_DEVICES = 'devices';
	public static PATH_EMAILS = 'mail';
	public static PATH_NOTIFICATIONS = 'notifications';
	public static PATH_PRODUCTS = 'products';
	public static PATH_SALES = 'sales';
	public static PATH_TASKS = 'tasks';
	public static PATH_TOPICS = 'topics';
	public static PATH_TRANSACTIONS = 'transactions';
	public static PATH_USERS = 'team';

	/* Vars */
	public static DEFAULT_CURRENCY = 'USD';
	public static DEVICES_DELAY_DAYS = 4;

	public static COUNT_INIT = 1000000;
	public static CUSTOMER_COUNT_INIT = AppConfig.COUNT_INIT;
	public static TRANSACTION_COUNT_INIT = AppConfig.COUNT_INIT;
	public static PRODUCT_COUNT_INIT = AppConfig.COUNT_INIT;
	public static SALE_COUNT_INIT = AppConfig.COUNT_INIT;
}
