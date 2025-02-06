import type { DiceConfig } from '../../models/types/dice-config';
import type { Randomizer } from '../../models/types/randomizer';

export type TransformOptions = Randomizer & Pick<DiceConfig, 'spinMax' | 'spinStep'>;
type GetOptions = Pick<DiceConfig, 'cssSelector'>;
type RollOptions = TransformOptions & Pick<DiceConfig, 'spinDuration'>;
type StartOptions = GetOptions & RollOptions;

export type DiceEvents = {
    /** returns all dice element from the DOM */
    getAll: (options: GetOptions) => NodeListOf<HTMLElement>;

    /** applies a random rotation to the dice element */
    roll: (dice: HTMLElement, options: RollOptions) => void;

    /** applies a random rotation to all dice elements */
    rollAll: (options: StartOptions) => void;

    start: (options: StartOptions) => void;
};