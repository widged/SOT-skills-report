/* jshint esnext: true */

import Inject from '../src/components/inject/Inject.es6.js';
import injectJs from '../src/components/inject/injectJs.es6.js';

import main      from '../src/main.es6.js';

Inject.css({file: '../../dist/css/sot-branding.css', parent: module});
Inject.css({file: '../../dist/css/student-vis.css', parent: module});
Inject.css({file: '../../dist/css/skill-bubbles.css', parent: module});
Inject.css({file: '../../dist/css/color-legend.css', parent: module});
Inject.css({file: '../../dist/css/item-tooltip.css', parent: module});
Inject.css({file: '../../dist/css/react-select.css', parent: module});


injectJs([
	'../dist/scripts/skill-bubbles.d3.js',
	'../dist/vendor/d3/d3.v3.min.js',
], function() {
	main();
});
