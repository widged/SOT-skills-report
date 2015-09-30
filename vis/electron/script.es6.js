/* jshint esnext: true */

import {Inject}          from '../imports';
import main from '../main.es6.js';

Inject.css({file: '../../dist/css/skill-vis.css', parent: module});
Inject.css({file: '../../dist/css/sot-branding.css', parent: module});
Inject.css({file: '../../dist/css/student-chart.css', parent: module});
Inject.css({file: '../../dist/css/skill-bubbles.css', parent: module});
Inject.css({file: '../../../node_modules/react-select/dist/default.css', parent: module});

main();
