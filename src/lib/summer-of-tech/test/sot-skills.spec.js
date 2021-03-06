/* jshint esnext: true */

var assert = require('assert');

import SummerOfTech from '../SummerOfTech.es6.js';
import students     from '../../../../dist/data-from-tools/students.js';
import categories   from '../../../../dist/data-from-tools/students.js';

describe('skills', function() {
	let summerOfTech;
	beforeEach(function() {
		summerOfTech = new SummerOfTech();
	});

	describe('listSkills', function() {

		let summerOfTech;

		beforeEach(function() {
			const rawSkills = {
			  "names": {
			    "dict": [
			      "AI",
			      "Android",
			      "Computer Architecture"
			    ]
			  },
			  "students": [
			    {
			      "levels": {
			        "Interested": "190 1031 1073 1165 1309 1352 1358 1397 1403 1409 1411 1416 1418 1422 1424 1426 1442 1449 1455 1496 1531 1553 1575 1610 1619 1620 1626 1717 1761 1786 1845 1866 1927 1933 2021 2023 2032 2049 2050 2063 2069 2071 2103 2105 2110 2143 2150 2160 2191 2195 2224 2238 2248 2273 2280 2289 2290 2298 2299 2300 2302 2304 2305 2316 2317 2325 2330 2348 2383 2402 2413 2414 2417 2482 2487 2494 2497 2509 2513 2539 2551 2587 2593 2595 2607 2649 2657 2669 2673 2691 2711 2742 2748 2761 2770 2772 2781 2790 2815 2818 2819 2820 2854 2917 2919 2927 2941 2943 2955 2957 2972 2986 2987 2998 3008 3012 3014 3029 3073 3092 3094 3102 3220 3260 3270 3272 3274 3295 3305 3307 3327 3362 3366 3368 3370 3371 3372 3375 3376 3384 3394 3400 3404 3407 3409 3414 3417 3419 3429 3430 3436 3439 3442 3452 3456 3460 3461 3464 3469 3470 3472 3476 3482 3484 3485 3488 3491 3492 3501 3504 3511 3512 3519 3524 3526 3535 3542 3557 3558 3570 3572 3573 3574 3581 3586 3587 3590 3594 3596 3600 3602 3605 3606 3610 3619 3628 3636 3640 3641 3643 3651 3664 3666 3684 3700 3707 3708 3709 3711 3712 3716 3723 3725 3727 3730 3739 3748 3749 3750 3759 3765 3768 3774 3795 3813 3817 3819 3826 3839 3850 3853 3856 3863 3866 3870 3895 3913 3927 3931 3932 3933 3936 3940 3942 3948 3954 3972 3990 3992 3998 4003 4007 4010 4035 4040 4043 4048 4054 4056 4080 4104 4111 4121 4122 4130 4132 4141 4143 4188 4191 4192 4219 4241 4245 4252 4253 4270 4274 4284 4291 4292 4308 4313 4335 4338 4344 4352 4358 4362 4363 4391 4400 4405 4437 4446 4451 4476 4483 4486 4487 4494 4495 4497 4500 4503 4506 4568 4574 4581 4649 4682 4685 4692 4702 4712 4713 4717 4730 4732 4734 4748 4753 4783 4786 4811 4822 4872 4873 4876 4883 4889 4896 4902 4904 4924 4934 4938 4939 4943 4944 4969 4977 4991 4999 5016 5018 5019 5046 5051 5055 5071 5073 5075 5090 5096 5104 5105 5114 5116 5134 5136 5137 5154 5165 5193 5196 5209 5217 5239 5240",
			        "Academic": "219 877 1095 1165 1353 1358 1411 1426 1449 1553 1567 1575 1619 1717 1761 1933 2021 2063 2069 2103 2143 2150 2160 2177 2224 2248 2273 2280 2298 2299 2304 2348 2383 2414 2417 2486 2587 2607 2649 2657 2669 2748 2772 2781 2917 2957 2972 2987 2998 3027 3029 3059 3094 3161 3260 3326 3368 3370 3376 3384 3417 3429 3439 3461 3476 3482 3492 3499 3524 3542 3557 3558 3572 3573 3617 3651 3664 3708 3709 3724 3730 3748 3822 3863 3870 4007 4010 4121 4130 4176 4335 4495 4502 4652 4682 4699 4883 4939 4969 5016 5018 5100 5116 5193 5209",
			        "Practical": "1403 1418 1442 1610 1845 1927 2238 2330 2494 2691 2742 2773 2818 2919 3375 3485 3628 3711 3712 3927 4270 4634 5104 5114 5165",
			        "Paid": "1424 1496 2062 3954 5105"
			      }
			    },
			    {
			      "levels": {
			        "Paid": "190 1403 2145 2177 2305 2414 2509 2595 2657 2747 2781 2790 2814 2818 3307 3362 3504 3847 4400 5102",
			        "Interested": "190 219 1073 1165 1309 1346 1352 1353 1358 1397 1403 1409 1416 1422 1424 1426 1442 1449 1455 1531 1553 1575 1610 1619 1620 1624 1626 1717 1761 1786 1845 1866 1927 1933 1995 2021 2023 2032 2034 2049 2050 2051 2062 2063 2103 2105 2106 2108 2129 2143 2145 2150 2154 2159 2160 2177 2180 2188 2191 2195 2224 2225 2238 2248 2263 2265 2271 2273 2289 2290 2298 2299 2300 2302 2304 2305 2316 2317 2323 2325 2327 2330 2333 2348 2383 2392 2402 2413 2414 2417 2433 2482 2486 2494 2506 2509 2513 2539 2551 2587 2592 2593 2595 2607 2649 2657 2669 2673 2691 2710 2711 2734 2738 2742 2748 2755 2762 2770 2772 2781 2788 2790 2814 2815 2818 2819 2820 2854 2881 2882 2894 2917 2919 2927 2941 2955 2957 2972 2982 2986 2987 2998 3008 3012 3014 3029 3048 3070 3073 3089 3092 3094 3152 3178 3220 3260 3264 3269 3272 3274 3295 3305 3307 3317 3326 3327 3358 3362 3364 3366 3368 3369 3370 3371 3375 3376 3384 3394 3404 3407 3409 3414 3417 3419 3421 3429 3430 3436 3439 3442 3449 3452 3455 3456 3460 3461 3464 3469 3470 3472 3473 3476 3481 3482 3484 3485 3488 3491 3492 3493 3497 3499 3501 3504 3507 3511 3512 3518 3519 3522 3524 3526 3535 3542 3548 3550 3557 3558 3570 3572 3573 3574 3580 3581 3586 3590 3592 3595 3596 3597 3600 3602 3605 3606 3610 3613 3619 3628 3634 3636 3637 3641 3643 3657 3664 3666 3679 3684 3691 3700 3707 3708 3709 3710 3711 3712 3715 3716 3723 3725 3727 3739 3748 3749 3750 3752 3759 3765 3768 3774 3777 3782 3788 3791 3795 3799 3800 3807 3808 3813 3817 3819 3826 3828 3839 3847 3850 3853 3856 3863 3864 3866 3870 3895 3910 3913 3917 3918 3925 3927 3931 3932 3933 3936 3940 3942 3948 3954 3972 3973 3976 3990 3992 3998 4003 4007 4010 4018 4033 4035 4040 4043 4044 4048 4054 4056 4080 4104 4111 4121 4125 4130 4132 4139 4140 4141 4143 4176 4188 4191 4192 4212 4219 4233 4241 4243 4245 4249 4252 4253 4256 4265 4270 4271 4274 4284 4291 4292 4308 4313 4321 4329 4335 4338 4344 4348 4352 4362 4363 4379 4387 4389 4391 4404 4405 4424 4437 4443 4446 4451 4458 4461 4476 4483 4486 4487 4494 4495 4497 4500 4502 4503 4506 4508 4530 4531 4568 4572 4574 4581 4584 4598 4634 4643 4649 4652 4669 4682 4685 4692 4693 4702 4712 4713 4717 4730 4732 4734 4735 4746 4753 4760 4783 4786 4811 4822 4827 4867 4872 4873 4876 4883 4886 4889 4896 4902 4904 4924 4926 4934 4938 4939 4940 4942 4943 4944 4962 4969 4977 4991 4994 4999 5014 5016 5018 5019 5039 5046 5051 5061 5067 5071 5095 5096 5100 5102 5104 5105 5114 5116 5134 5136 5137 5165 5172 5173 5183 5193 5196 5209 5217 5239 5240 5273",
			        "Practical": "219 877 1031 1095 1165 1309 1346 1358 1409 1422 1424 1442 1455 1610 1623 1626 1631 1761 1845 2051 2103 2105 2143 2150 2195 2248 2265 2304 2317 2333 2402 2486 2494 2497 2669 2691 2742 2748 2770 2773 2881 2917 2941 2943 2972 2986 3012 3014 3027 3035 3059 3102 3370 3371 3400 3429 3442 3464 3472 3481 3482 3485 3491 3492 3497 3499 3524 3542 3549 3580 3595 3596 3597 3602 3627 3636 3651 3708 3710 3711 3712 3715 3808 3817 3856 3917 3927 3940 4010 4018 4033 4080 4111 4176 4188 4219 4243 4358 4379 4408 4494 4685 4713 4786 4886 4924 4926 4938 4977 5046 5051 5055 5061 5089 5100 5104 5105 5154 5172 5239 5273",
			        "Academic": "908 965 1026 1416 1418 1496 1531 1553 1567 1575 1619 1624 1717 1927 1995 2021 2034 2062 2063 2129 2225 2238 2299 2323 2330 2348 2417 2482 2506 2738 2761 2815 2882 2919 2987 3094 3152 3161 3178 3366 3375 3417 3419 3439 3572 3573 3586 3590 3628 3679 3691 3692 3709 3723 3777 3782 3791 3863 3870 3972 3998 4035 4087 4121 4139 4140 4143 4241 4249 4253 4329 4352 4389 4405 4461 4495 4500 4598 4643 4652 4702 4732 5016 5039 5069 5071 5095 5113 5137 5173"
			      }
			    },
			    {
			      "levels": {
			      }
			    }
			  ]
			};

			summerOfTech = new SummerOfTech();
			summerOfTech
			  	.rawSkills(rawSkills)
			  	.activeExperienceLevels([SummerOfTech.experienceLevels.Paid]);
		});

	    it('lists the skills at the active experience levels', function() {
			var actual = summerOfTech.listSkillNames(['Android','Computer Architecture']);
	        assert.deepEqual(actual, [ 'Android' ]);
	    });

	    it('lists all skills at experience levels when names are undefined', function() {
			var actual = summerOfTech.listSkillNames();
	        assert.deepEqual(actual, [ 'AI', 'Android' ]);
	    });

	});


	describe('listStudentsWithSkills', function() {
		let summerOfTech;

		beforeEach(function() {
			const rawSkills = {
			  "names": {
			    "dict": [
			      "Android",
			      "Computer Architecture"
			    ]
			  },
			  "students": [
			    {
			      "levels": {
			        "Paid": "190 1403"
			      }
			    },
			    {
			      "levels": {
			        "Paid": "190 908"
			      }
			    },
			  ]
			};

			summerOfTech = new SummerOfTech();
			summerOfTech
			  	.rawSkills(rawSkills)
			  	.activeExperienceLevels([SummerOfTech.experienceLevels.Paid]);
		});

	    it('lists the students that have all the specified skills at prespecified expertise levels', function() {
			var list = summerOfTech.listStudentsWithSkills(['Android','Computer Architecture']);
	        assert.deepEqual(list, ['190']);
	    });

	    it('lists all students when primary skills are undefined', function() {
			var list = summerOfTech.listStudentsWithSkills();
	        assert.deepEqual(list, ['190','1403','908']);
	    });


	});

	describe('listSkillsOfStudents', function() {

		beforeEach(function() {
			const rawSkills = {
			  "names": {
			    "dict": [
			      "Android",
			      "Computer Architecture",
			      "Javascript"
			    ]
			  },
			  "students": [
			    {
			      "levels": {
			        "Paid": "190 1403"
			      }
			    },
			    {
			      "levels": {
			        "Paid": "190 908"
			      }
			    },
				{
			      "levels": {
			        "Paid": "365"
			      }
			    },			    
			  ]
			};

			summerOfTech
				  	.rawSkills(rawSkills)
				  	.activeExperienceLevels([SummerOfTech.experienceLevels.Paid]);
		});
		
	    it('lists the skills that the specified students have', function() {
			var actual = summerOfTech.listSkillsOfStudents(['190','908','1043']);
	        assert.deepEqual(actual, [ 'Android', 'Computer Architecture' ]);
	    });

	    it('lists all skills when students are undefined', function() {
			var actual = summerOfTech.listSkillsOfStudents();
	        assert.deepEqual(actual, [ 'Android', 'Computer Architecture', 'Javascript' ]);
	    });

	    it('lists no skills when an empty student list is given', function() {
			var actual = summerOfTech.listSkillsOfStudents([]);
	        assert.deepEqual(actual, []);
	    });
	});

	describe('listComplementarySkills', function() {

		beforeEach(function() {
			const rawSkills = {
			  "names": {
			    "dict": [
			      "Android",
			      "Computer Architecture",
			      "Javascript"
			    ]
			  },
			  "students": [
			    {
			      "levels": {
			        "Paid": "190 1403"
			      }
			    },
			    {
			      "levels": {
			        "Paid": "190 908"
			      }
			    },
				{
			      "levels": {
			        "Paid": "365"
			      }
			    },			    
			  ]
			};

			summerOfTech
			  	.rawSkills(rawSkills)
			  	.activeExperienceLevels([SummerOfTech.experienceLevels.Paid]);
		});

	    it('lists the skills that co-occur with a list of primary skills', function() {
			var actual = summerOfTech.listComplementarySkills(['Android']);
	        assert.deepEqual(actual, ['Computer Architecture']);
	    });

	    it('lists all skills as complementary skills when the primary skills are undefined', function() {
			var actual = summerOfTech.listComplementarySkills();
	        assert.deepEqual(actual, ['Android','Computer Architecture','Javascript']);
	    });

	});

});
