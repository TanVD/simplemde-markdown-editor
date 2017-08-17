/***
 * Merge the properties of one object into another.
 */
_mergeProperties = function _mergeProperties(target, source) {
    for (var property in source) {
        if (source.hasOwnProperty(property)) {
            if (source[property] instanceof Array) {
                target[property] = source[property].concat(target[property] instanceof Array ? target[property] : []);
            } else if (
                source[property] !== null &&
                typeof source[property] === "object" &&
                source[property].constructor === Object
            ) {
                target[property] = _mergeProperties(target[property] || {}, source[property]);
            } else {
                target[property] = source[property];
            }
        }
    }

    return target;
};

module.exports.mergeProperties = _mergeProperties;