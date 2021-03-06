"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guild = void 0;
const typeorm_1 = require("typeorm");
const abstract_entity_1 = require("./abstract.entity");
const member_entity_1 = require("./member.entity");
const class_transformer_1 = require("class-transformer");
const ban_entity_1 = require("./ban.entity");
let Guild = class Guild extends abstract_entity_1.AbstractEntity {
    toJson() {
        return class_transformer_1.classToPlain(this);
    }
};
__decorate([
    typeorm_1.Column('varchar'),
    __metadata("design:type", String)
], Guild.prototype, "name", void 0);
__decorate([
    typeorm_1.Column('varchar'),
    __metadata("design:type", String)
], Guild.prototype, "ownerId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => member_entity_1.Member, (member) => member.guild),
    class_transformer_1.Exclude(),
    __metadata("design:type", Array)
], Guild.prototype, "members", void 0);
__decorate([
    typeorm_1.OneToMany(() => ban_entity_1.BanEntity, (bans) => bans.guild),
    class_transformer_1.Exclude(),
    __metadata("design:type", Array)
], Guild.prototype, "bans", void 0);
__decorate([
    typeorm_1.Column('varchar', { nullable: true }),
    __metadata("design:type", String)
], Guild.prototype, "icon", void 0);
__decorate([
    typeorm_1.Column("simple-array", { default: [] }),
    __metadata("design:type", Array)
], Guild.prototype, "inviteLinks", void 0);
Guild = __decorate([
    typeorm_1.Entity('guilds')
], Guild);
exports.Guild = Guild;
//# sourceMappingURL=guild.entity.js.map