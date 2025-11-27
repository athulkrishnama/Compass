import { store } from "@/store/store";
import type { ROLE } from "@/types/role";

export function isLoggedin() {
    return store.getState().user.isLoggedin;
}

export function roleChecker(role: ROLE) {
    return store.getState().user.role === role;
}

export function getRole(): ROLE | null {
    return store.getState().user.role;
}
