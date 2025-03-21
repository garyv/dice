type EventMap = {
    [key: string]: (...args: any[]) => any;
}

export type DiceEventMap = EventMap & {
    /** first stage of starting to roll dice */
    dragStart: (dice: HTMLElement, event: PointerEvent) => void;

    /** rotates dice as you drag pointer, release to roll dice */
    dragMove: (dice: HTMLElement, event: PointerEvent) => void;

    /** change the quantity of dice */
    updateCount: (newCount: number) => void;

    /** applies a random rotation to the dice element */
    roll: (dice: HTMLElement) => void;

    /** applies a random rotation to all dice elements */
    rollAll: () => void;

    /** initilizes all events for dice simulation */
    ready: () => void;
}
