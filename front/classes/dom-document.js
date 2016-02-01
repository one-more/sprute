'use strict';

module.exports = class {
    setBlock(name, content) {
        $(document.all[`${name}-block`]).html(content)
    }
};