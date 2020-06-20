

const Util = class {

    /**
     * return integer [0, max)
     */
    static rnd (max) {

        // ECMA 20.2 The Math Object
        return Math.floor(

            // the range of `Math.random()' is [0,1)
            // the range of `Math.random() * max' is [0, max)
            // (double)
            Math.random() * max
        );

    }

    /**
     * return integer [min, max)
     */
    static rnd_range (min, max) {

        return this.rnd(max - min) + min;

    }
};



