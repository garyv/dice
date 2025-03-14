import type { DiceConfig } from '../../models/types/dice-config';
import type { Randomizer } from '../../models/types/randomizer';

export type TransformOptions = Randomizer & Pick<DiceConfig, 'spinMax' | 'spinStep'>;
export type ButtonOptions = Pick<DiceConfig, 'addButtonSelector' | 'removeButtonSelector' | 'min' | 'max'>;
type GetOptions = Pick<DiceConfig, 'cssSelector'>;
type RollOptions = TransformOptions & Pick<DiceConfig, 'spinDuration'>;
type RollAllOptions = GetOptions & RollOptions;
type StartOptions = RollAllOptions & ButtonOptions & Pick<DiceConfig, 'parentSelector'>;

export type DiceEvents = {
    /** returns all dice element from the DOM */
    getAll: (options: GetOptions) => NodeListOf<HTMLElement>;

    /** first stage of starting to roll dice */
    dragStart: (dice: HTMLElement, event: PointerEvent) => void;

    /** rotates dice as you drag pointer, release to roll dice */
    drag: (dice: HTMLElement, event: PointerEvent) => void;

    /** change the quantity of dice */
    // updateCount: (newCount: number, options: UpdateCountOptions) => void;

    /** applies a random rotation to the dice element */
    roll: (dice: HTMLElement, options: RollOptions) => void;

    /** applies a random rotation to all dice elements */
    rollAll: (options: RollAllOptions) => void;

    /** initilizes all events for dice simulation */
    start: (options: StartOptions) => void;
};