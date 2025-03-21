//@ts-check
/** @type {import('./types/dice-rules').DiceRules} */
export const diceRules = {
    getSize: (count) => {
        switch (count) {
            case 1:
                return '45vmin';
            case 2:
                return '38vmin';
            case 3:
            case 4:
                return '26vmin';
            // no default
        }
        return '25vmin';
    },

    isValidCount: (count, min, max) => count >= min && count <= max,
};

export const { getSize, isValidCount } = diceRules;