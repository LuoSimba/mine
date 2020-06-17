

const Util = function () {};

Util.rnd = function (max) {

    // ECMA 20.2 The Math Object
    return Math.floor(

        // the range of `Math.random()' is [0,1)
        // the range of `Math.random() * max' is [0, max)
        Math.random() * max
    );

    // random in range [a, b):
    // (double) Math.random() * (b - a) + a;
};


