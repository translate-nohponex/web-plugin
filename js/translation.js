/*(function ( $ ) {

	var methods = {
        init : function(options) {

        },
        show : function( ) {    },// IS
        hide : function( ) {  },// GOOD
        update : function( content ) {  }// !!!
    };

    $.fn.translate = function(methodOrOptions) {
        if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            // Default to "init"
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.tooltip' );
        }    
    };


}( jQuery ));*/

(function() {
	var language = '';
	var translation = [];


	//Request the translated data
	window.translate = function( lang ){
		$.ajax({
			dataType: "json",
			url: 'http://translate.nohponex.gr/fetch/listing/?id=1&language=' + lang ,
			/*data: data,*/
			success: function( data ){
				//alert( data.language );
				language = data.language;
				translation =  data.translation;
				translate_page( 'html' );
			}
		});
	};

	/*var translation_text = function( key ){
		return translation[ key ];
	}*/
	var translation_text = function( key, parameters ){
		parameters = typeof( parameters ) !== 'undefined' ? parameters : null;

		var t = translation[ key ];

		//If parameters are set
		if( parameters ){
			for (var k in parameters ) {
			  if (parameters.hasOwnProperty(k)){
			  	t = t.replace( '%' + k + '%', parameters[k] );
			  }
			}
		}

		return t;
	}

	window.translate_page = function( parent_element ){
		parent_element = typeof( parent_element ) !== 'undefined' ? parent_element : 'body';

		var translatable_elements = $( parent_element ).find( '[data-i18]');
		


		//Replace all keys with the translated values
		translatable_elements.each(function( index, element ) {
			//Get element object
			var el = $( element );
			//Get elements key
			var key = el.attr( 'data-i18' );
			//If key is set
			if( key ){
												
				//Translation parameters
				var parameters = null;
				if( el.attr( 'data-i18-data' ) ){
					//Parse string as json object
					parameters = jQuery.parseJSON( el.attr( 'data-i18-data' ) );
				}

				var t = translation_text( key, parameters );
				//Replace element's text
				el.text( t );
			}
		});

		//Replace all language key data-i18-lang
		var translatable_language_elements = $( parent_element ).find( '[data-i18-lang]' );
		translatable_language_elements.each(function( index, element ) {
			var el = $( element );
			el.text( language );
		});

	};

	//Translate this page on load in greek language
	translate( 'gr' );
})();