/**
 * @preserve Underscore.inflection.js
 *  (c) 2011 Jeremy Ruppel
 *  Underscore.inflection is freely distributable under the MIT license.
 *  Portions of Underscore.inflection are inspired or borrowed from ActiveSupport
 *  Version 1.0.0
 *  Ported to YUI 3 by Kris Kelly 2013
 *
 */
YUI.add( 'inflection', function ( Y ) {
	"use strict";

	Y.Inflection = function ( config ) {
		this.resetInflections();
	};

	Y.Inflection.NS = 'inflection';

	Y.Inflection.prototype = {
		plurals: [],
		singulars: [],
		uncountables: [],


		gsub: function ( word, rule, replacement ) {
			var pattern = new RegExp( rule.source || rule, 'gi' );

			return pattern.test( word ) ? word.replace( pattern, replacement ) : null;
		},

		plural: function ( rule, replacement ) {
			this.plurals.unshift( [ rule, replacement ] );
		},

		pluralize: function ( word, count, includeNumber ) {
			var result,
				widget = this,
				Arr = Y.Array;

			if ( count !== undefined ) {
				count = Math.round( count );
				result = ( count === 1 ) ? widget.singularize( word ) : widget.pluralize( word );
				result = ( includeNumber ) ? [ count, result ].join( ' ' ) : result;
			}
			else {
				if ( Arr.indexOf( widget.uncountables, word ) > -1 ) {
					return word;
				}

				result = word;

				Arr.some( widget.plurals, function ( rule ) {
						var gsub = this.gsub( word, rule[ 0 ], rule[ 1 ] );

						return gsub ? ( result = gsub ) : false;
					},
					widget );
			}

			return result;
		},

		singular: function ( rule, replacement ) {
			this.singulars.unshift( [ rule, replacement ] );
		},

		singularize: function ( word ) {
			var result = word,
				widget = this,
				Arr = Y.Array;

			if ( Arr.indexOf( widget.uncountables, word ) > -1 ) {
				return word;
			}


			Arr.some( widget.singulars, function ( rule ) {
					var gsub = widget.gsub( word, rule[ 0 ], rule[ 1 ] );

					return gsub ? ( result = gsub ) : false;
				},
				widget );

			return result;
		},

		irregular: function ( singular, plural ) {
			var widget = this;
			widget.plural( '\\b' + singular + '\\b', plural );
			widget.singular( '\\b' + plural + '\\b', singular );
		},

		uncountable: function ( word ) {
			this.uncountables.unshift( word );
		},

		resetInflections: function () {
			var widget = this;

			widget.plurals = [ ];
			widget.singulars = [ ];
			widget.uncountables = [ ];

			widget.plural( /$/, 's' );
			widget.plural( /s$/, 's' );
			widget.plural( /(ax|test)is$/, '$1es' );
			widget.plural( /(octop|vir)us$/, '$1i' );
			widget.plural( /(octop|vir)i$/, '$1i' );
			widget.plural( /(alias|status)$/, '$1es' );
			widget.plural( /(bu)s$/, '$1ses' );
			widget.plural( /(buffal|tomat)o$/, '$1oes' );
			widget.plural( /([ti])um$/, '$1a' );
			widget.plural( /([ti])a$/, '$1a' );
			widget.plural( /sis$/, 'ses' );
			widget.plural( /(?:([^f])fe|([lr])f)$/, '$1$2ves' );
			widget.plural( /(hive)$/, '$1s' );
			widget.plural( /([^aeiouy]|qu)y$/, '$1ies' );
			widget.plural( /(x|ch|ss|sh)$/, '$1es' );
			widget.plural( /(matr|vert|ind)(?:ix|ex)$/, '$1ices' );
			widget.plural( /([m|l])ouse$/, '$1ice' );
			widget.plural( /([m|l])ice$/, '$1ice' );
			widget.plural( /^(ox)$/, '$1en' );
			widget.plural( /^(oxen)$/, '$1' );
			widget.plural( /(quiz)$/, '$1zes' );

			widget.singular( /s$/, '' );
			widget.singular( /ss$/, 'ss' );
			widget.singular( /(n)ews$/, '$1ews' );
			widget.singular( /([ti])a$/, '$1um' );
			widget.singular( /((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/, '$1$2sis' );
			widget.singular( /(^analy)ses$/, '$1sis' );
			widget.singular( /([^f])ves$/, '$1fe' );
			widget.singular( /(hive)s$/, '$1' );
			widget.singular( /(tive)s$/, '$1' );
			widget.singular( /([lr])ves$/, '$1f' );
			widget.singular( /([^aeiouy]|qu)ies$/, '$1y' );
			widget.singular( /(s)eries$/, '$1eries' );
			widget.singular( /(m)ovies$/, '$1ovie' );
			widget.singular( /(x|ch|ss|sh)es$/, '$1' );
			widget.singular( /([m|l])ice$/, '$1ouse' );
			widget.singular( /(bus)es$/, '$1' );
			widget.singular( /(o)es$/, '$1' );
			widget.singular( /(shoe)s$/, '$1' );
			widget.singular( /(cris|ax|test)es$/, '$1is' );
			widget.singular( /(octop|vir)i$/, '$1us' );
			widget.singular( /(alias|status)es$/, '$1' );
			widget.singular( /^(ox)en/, '$1' );
			widget.singular( /(vert|ind)ices$/, '$1ex' );
			widget.singular( /(matr)ices$/, '$1ix' );
			widget.singular( /(quiz)zes$/, '$1' );
			widget.singular( /(database)s$/, '$1' );

			widget.irregular( 'person', 'people' );
			widget.irregular( 'man', 'men' );
			widget.irregular( 'sex', 'sexes' );
			widget.irregular( 'woman', 'women' );
			widget.irregular( 'child', 'children' );
			widget.irregular( 'move', 'moves' );
			widget.irregular( 'sheep', 'sheep' );
			widget.irregular( 'mouse', 'mice' );
			widget.irregular( 'fish', 'fish' );

			Y.Array.each( 'equipment information rice money species series fish sheep jeans'.split( /\s+/ ), function ( word ) {
					widget.uncountable( word );
				},
				widget );

			return widget;
		}
	};

}, '1.0', {} );