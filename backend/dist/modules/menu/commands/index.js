"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMenuItemCommand = exports.CreateMenuItemCommand = exports.UpdateCategoryCommand = exports.CreateCategoryCommand = void 0;
class CreateCategoryCommand {
    ownerId;
    dto;
    constructor(ownerId, dto) {
        this.ownerId = ownerId;
        this.dto = dto;
    }
}
exports.CreateCategoryCommand = CreateCategoryCommand;
class UpdateCategoryCommand {
    ownerId;
    categoryId;
    dto;
    constructor(ownerId, categoryId, dto) {
        this.ownerId = ownerId;
        this.categoryId = categoryId;
        this.dto = dto;
    }
}
exports.UpdateCategoryCommand = UpdateCategoryCommand;
class CreateMenuItemCommand {
    ownerId;
    dto;
    constructor(ownerId, dto) {
        this.ownerId = ownerId;
        this.dto = dto;
    }
}
exports.CreateMenuItemCommand = CreateMenuItemCommand;
class UpdateMenuItemCommand {
    ownerId;
    menuItemId;
    dto;
    constructor(ownerId, menuItemId, dto) {
        this.ownerId = ownerId;
        this.menuItemId = menuItemId;
        this.dto = dto;
    }
}
exports.UpdateMenuItemCommand = UpdateMenuItemCommand;
//# sourceMappingURL=index.js.map