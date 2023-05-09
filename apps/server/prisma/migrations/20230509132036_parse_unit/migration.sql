-- CreateTable
CREATE TABLE `ParseUnit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `frequency` INTEGER NOT NULL,
    `siteUrl` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `ParseUnit_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ParseUnit` ADD CONSTRAINT `ParseUnit_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
