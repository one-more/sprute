window.start = () => {
    "use strict";

    window.start = () => {};
    window.require = require;
    window.process = require('process');

    const main = require(process.cwd()+'/configuration/runtime').main;

    require.main = require(main)
};