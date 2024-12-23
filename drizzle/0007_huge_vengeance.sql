CREATE TABLE `BudgetedData` (
	`categoryType` text,
	`userId` text,
	`value` real DEFAULT 0,
	FOREIGN KEY (`categoryType`) REFERENCES `Categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `UserLists`(`userId`) ON UPDATE no action ON DELETE no action
);
