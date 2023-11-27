module.exports = isLiteralObject = function (a) {
    return !!a && a.constructor === Object;
};