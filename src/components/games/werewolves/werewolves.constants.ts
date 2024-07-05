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
    [EWerewolvesRoleName.wolf]: 'red-400',
    [EWerewolvesRoleName.hunter]: 'orange-400',
    [EWerewolvesRoleName.thief]: 'green-400',
    [EWerewolvesRoleName.witch]: 'blue-400',
    [EWerewolvesRoleName.psychic]: 'purple-400',
    [EWerewolvesRoleName.cupidon]: 'pink-400',
    [EWerewolvesRoleName.villager]: 'white',
}