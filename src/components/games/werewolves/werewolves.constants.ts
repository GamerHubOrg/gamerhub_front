import { EWerewolvesRoleName } from "./werewolves.types"

export const rolesList: Record<EWerewolvesRoleName, any> = {
    [EWerewolvesRoleName.wolf]: 'wolf',
    [EWerewolvesRoleName.hunter]: 'hunter',
    [EWerewolvesRoleName.thief]: 'thief',
    [EWerewolvesRoleName.witch]: 'witch',
    [EWerewolvesRoleName.psychic]: 'psychic',
    [EWerewolvesRoleName.cupidon]: 'cupidon',
    [EWerewolvesRoleName.villager]: 'villager',
}

export const rolesColor: Record<EWerewolvesRoleName, string> = {
    [EWerewolvesRoleName.wolf]: 'rgb(248 113 113)',
    [EWerewolvesRoleName.hunter]: 'rgb(251 146 60)',
    [EWerewolvesRoleName.thief]: 'rgb(74 222 128)',
    [EWerewolvesRoleName.witch]: 'rgb(96 165 250)',
    [EWerewolvesRoleName.psychic]: 'rgb(192 132 252)',
    [EWerewolvesRoleName.cupidon]: 'rgb(244 114 182)',
    [EWerewolvesRoleName.villager]: 'rgb(255 255 255)',
}