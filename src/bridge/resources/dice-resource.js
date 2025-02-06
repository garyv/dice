//@ts-check
import { diceConfig } from '../../domain/models/dice-config';
import { diceEvents } from '../../domain/events/dice-events';
import { randomizer } from '../../domain/models/randomizer';

diceEvents.start({ ...diceConfig, ...randomizer });