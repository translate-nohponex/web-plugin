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

$(document).ready( function() {
	var language = '';
	var translation = [];


	//Request the translated data
	var translate = function( ){
		$.ajax({
			dataType: "json",
			url: 'http://translate.nohponex.gr/fetch/listing/?id=1&language=gr',
			/*data: data,*/
			success: function( data ){
				//alert( data.language );
				language = data.language;
				translation =  data.translation;
				translate_page();
			}
		});
	};

	var translate_page = function( root ){
		root = typeof( root ) !== 'undefined' ? root : 'body';

		data = $( root ).find("[data-i18]");
		console.log( data );
		//Replace all keys with the translated values
		data.each(function( index, element ) {
			console.log( 'index : ' + index );
			var el = $( element );
			key = el.attr( 'data-i18' );
			if( key ){
				console.log( 'key : ' + key );
				t =  translation[key];
				console.log( 'translation : ' + t );
				console.log( t );

				el.text( t );
			}
		});

		//Replace all language key data-i18-lang
		lng = $( root ).find("[data-i18-lang]");
		data.each(function( index, element ) {
			console.log( 'index : ' + index );
			var el = $( element );
			el.text( language );
		});
	};
	translate();
});