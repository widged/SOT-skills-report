/* jshint esnext: true */

import Inject from '../src/components/inject/Inject.es6.js';
import injectJs from '../src/components/inject/injectJs.es6.js';

import main      from '../src/main.es6.js';

Inject.css({file: '../../dist/css/skill-vis.css', parent: module});
Inject.css({file: '../../dist/css/sot-branding.css', parent: module});
Inject.css({file: '../../dist/css/student-chart.css', parent: module});
Inject.css({file: '../../dist/css/skill-bubbles.css', parent: module});
Inject.css({file: '../../dist/css/item-tooltip.css', parent: module});
Inject.css({file: '../../node_modules/react-select/dist/default.css', parent: module});

injectJs([
	'../src/section-secondary/script.js',
	'../dist/vendor/d3/d3.v3.min.js',
], function() {
	main();
});
