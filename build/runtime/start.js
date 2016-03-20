window.start = () => {
    "use strict";

    let process = require('process'),
        main = require(process.cwd()+'/configuration/runtime').main;

    require.main = require(main);
    window.start = () => {}
};