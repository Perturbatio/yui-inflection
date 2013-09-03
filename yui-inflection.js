/**
 * @preserve Underscore.inflection.js
 *  (c) 2011 Jeremy Ruppel
 *  Underscore.inflection is freely distributable under the MIT license.
 *  Portions of Underscore.inflection are inspired or borrowed from ActiveSupport
 *  Version 1.0.0
 *  Ported to YUI 3 by Kris Kelly 2013
 *
 */
YUI.add('yui-inflection', function (Y) {
	"use strict";

	Y.Inflection = function () {
		this.resetInflections();
	};

	Y.Inflection.NS = 'inflection';

	Y.Inflection.prototype = {
		plurals: [],
		singulars: [],
		uncountables: [],
		/**
		 * @var defaults is an object storing arrays of the default rules and replacements
		 */
		defaults: {
			singular: [
				[/s$/, ''],
				[/ss$/, 'ss'],//handle singular forms of words like miss, kiss, profess and confess
				[/(n)ews$/, '$1ews'],
				[/([ti])a$/, '$1um'],
				[/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/, '$1$2sis'],
				[/(^analy)ses$/, '$1sis'],
				[/([^f])ves$/, '$1fe'],
				[/(hive)s$/, '$1'],
				[/(tive)s$/, '$1'],
				[/([lr])ves$/, '$1f'],
				[/([^aeiouy]|qu)ies$/, '$1y'],
				[/(s)eries$/, '$1eries'],
				[/(m)ovies$/, '$1ovie'],
				[/(x|ch|ss|sh)es$/, '$1'],
				[/([m|l])ice$/, '$1ouse'],
				[/(bus)es$/, '$1'],
				[/(o)es$/, '$1'],
				[/(shoe)s$/, '$1'],
				[/(cris|ax|test)es$/, '$1is'],
				[/(octop|vir)i$/, '$1us'],
				[/(alias|status)es$/, '$1'],
				[/^(ox)en/, '$1'],
				[/(vert|ind)ices$/, '$1ex'],
				[/(matr)ices$/, '$1ix'],
				[/(quiz)zes$/, '$1'],
				[/(database)s$/, '$1']
			],
			plural: [//array of arrays, index 0 = rule, index 1 = replacement
				[/$/, 's'],
				[/s$/, 's'],
				[/(ax|test)is$/, '$1es'],
				[/(octop|vir)us$/, '$1i'],
				[/(octop|vir)i$/, '$1i'],
				[/(alias|status)$/, '$1es'],
				[/(bu)s$/, '$1ses'],
				[/(buffal|tomat)o$/, '$1oes'],
				[/([ti])um$/, '$1a'],
				[/([ti])a$/, '$1a'],
				[/sis$/, 'ses'],
				[/(?:([^f])fe|([lr])f)$/, '$1$2ves'],
				[/(hive)$/, '$1s'],
				[/([^aeiouy]|qu)y$/, '$1ies'],
				[/(x|ch|ss|sh)$/, '$1es'],
				[/(matr|vert|ind)(?:ix|ex)$/, '$1ices'],
				[/([m|l])ouse$/, '$1ice'],
				[/([m|l])ice$/, '$1ice'],
				[/^(ox)$/, '$1en'],
				[/^(oxen)$/, '$1'],
				[/(quiz)$/, '$1zes']
			],
			irregular: [// array of arrays index 0 = singular, index 1 = plural
				['person', 'people'],
				['man', 'men' ],
				['sex', 'sexes'],
				['woman', 'women'],
				['child', 'children'],
				['move', 'moves'],
				['mouse', 'mice']
			],
			uncountable: ["equipment", "information", "rice", "money", "species", "series", "fish", "sheep", "jeans"]
		},

		/**
		 * global substitution function, intended for internal use only
		 *
		 * @param word
		 * @param rule
		 * @param replacement
		 * @returns {XML|string|void}
		 */
		gsub: function (word, rule, replacement) {
			var pattern = new RegExp(rule.source || rule, 'gi');

			return pattern.test(word) ? word.replace(pattern, replacement) : null;
		},

		/**
		 * Add a plural rule to the list
		 *
		 * @param rule
		 * @param replacement
		 */
		plural: function (rule, replacement) {
			this.plurals.unshift([ rule, replacement ]);
		},

		/**
		 * Return the pluralized version of the word
		 *
		 * @param word
		 * @param count
		 * @param includeNumber
		 * @returns {*}
		 */
		pluralize: function (word, count, includeNumber) {
			var result,
				widget = this,
				Arr = Y.Array;

			if ( count !== undefined ) {
				count = Math.round(count);
				result = ( count === 1 ) ? widget.singularize(word) : widget.pluralize(word);
				result = ( includeNumber ) ? [ count, result ].join(' ') : result;
			} else {
				if ( Arr.indexOf(widget.uncountables, word) > -1 ) {
					return word;
				}

				result = word;

				Arr.some(widget.plurals, function (rule) {
					var gsub = this.gsub(word, rule[ 0 ], rule[ 1 ]);
					return gsub ? ( result = gsub ) : false;
				}, widget);
			}

			return result;
		},

		/**
		 * Add a singular rule to the list
		 *
		 * @param rule
		 * @param replacement
		 */
		singular: function (rule, replacement) {
			this.singulars.unshift([ rule, replacement ]);
		},

		/**
		 * Return a singularized version of word
		 *
		 * @param word
		 * @returns {*}
		 */
		singularize: function (word) {
			var result = word,
				widget = this,
				Arr = Y.Array;

			if ( Arr.indexOf(widget.uncountables, word) > -1 ) {
				return word;
			}


			Arr.some(widget.singulars, function (rule) {
				var gsub = widget.gsub(word, rule[ 0 ], rule[ 1 ]);
				return gsub ? ( result = gsub ) : false;
			}, widget);

			return result;
		},

		/**
		 * Add a singular and plural version of an irregular word
		 *
		 * @param singular
		 * @param plural
		 */
		irregular: function (singular, plural) {
			var widget = this;
			widget.plural('\\b' + singular + '\\b', plural);
			widget.singular('\\b' + plural + '\\b', singular);
		},

		/**
		 * add an uncountable word (one that has the same singular and plural form)
		 *
		 * @param word
		 */
		uncountable: function (word) {
			this.uncountables.unshift(word);
		},

		/**
		 * reset the inflections to the defaults
		 *
		 * @returns {*}
		 */
		resetInflections: function () {
			var widget = this,
				defaults = widget.defaults,
				defaultIrregular = defaults.irregular,
				defaultPlural = defaults.plural,
				defaultSingular = defaults.singular,
				defaultUncountable = defaults.uncountable;

			widget.plurals = [ ];
			widget.singulars = [ ];
			widget.uncountables = [ ];

			//plurals
			Y.Array.each(defaultPlural, function (pair) {
				widget.plural(pair[0], pair[1]);
			}, widget);

			//singulars
			Y.Array.each(defaultSingular, function (pair) {
				widget.singular(pair[0], pair[1]);
			}, widget);

			//irregulars
			Y.Array.each(defaultIrregular, function (pair) {
				widget.irregular(pair[0], pair[1]);
			}, widget);

			//uncountables are stored as single items
			Y.Array.each(defaultUncountable, function (word) {
				widget.uncountable(word);
			}, widget);

			return widget;
		}
	};

}, '1.0', {});