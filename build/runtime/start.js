window.start = () => {
    "use strict";

    let _require = require.bind(null, {}, '/'),
        process = _require('process'),
        main = _require(process.cwd()+'/configuration/runtime').main;

    _require(main);
    window.start = () => {}
};