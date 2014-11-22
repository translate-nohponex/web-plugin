(function($) {

	$.fn.Translate = function( init ){
		init = typeof( init ) !== 'undefined' ? init : {};

		this.parameters = { project_id : null, language : 'en', API_KEY : null, onLoad : null };

		//Parse init to parameters
		for (var k in init ) {
		  if ( init.hasOwnProperty( k ) && this.parameters.hasOwnProperty( k ) ){
		  	this.parameters[ k ]  = init [ k ];
		  }
		}

		//Current language
		this.language = this.parameters.language;
		//Current translation key : translation
		this.translation = [];
			

		//Request the translated data
		this.initialize = function( lang ){
			var me = this;

			var api_url = 'http://translate.nohponex.gr/fetch/listing/?id=' + this.parameters.project_id + '&language=' + lang;
			//Check sessionStorage first
			var temp = sessionStorage.getItem( api_url );
			
			if( typeof( temp ) !== 'undefined' && temp != null ){
				
				//Parse as json from session storage
				try {
        			temp = JSON.parse( temp );

        			this.language = temp.language;
					this.translation = temp.translation;

					console.log( 'from cache..' );

					this.translate_page( 'html' );
        		}catch(e){
        			temp = null;
        		}
				
				
			}
			if( !temp ){
				console.log( 'from http..' );
				$.ajax({
					dataType: "json",
					url: api_url,
					/*data: data,*/
					success: function ( data ){
						//Store as JSON string to session storage
						sessionStorage.setItem( api_url, JSON.stringify( { language: data.language, translation : data.translation  } ) );
						
						me.language = data.language;
						me.translation = data.translation;

						me.translate_page( 'html' );
					},
					error: function( jqXHR, textStatus, errorThrown ){
						console.log( jqXHR );
						console.log( jqXHR.responseJSON.error );
						console.log( textStatus );
						console.log( errorThrown );
					}
				});
			}
		};
		

		this.translate_page = function( parent_element ){
			parent_element = typeof( parent_element ) !== 'undefined' ? parent_element : 'body';

			var translatable_elements = $( parent_element ).find( '[data-i18]');
			
			var me = this;
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
					var t = me.translation_text( key, parameters );
					//Replace element's text
					el.text( t );
				}
			});

			//Replace all language key data-i18-lang
			var translatable_language_elements = $( parent_element ).find( '[data-i18-lang]' );
			translatable_language_elements.each(function( index, element ) {
				var el = $( element );
				el.text( me.language );
			});

		};


		

		//Initialize
		//this;
	}
	$.fn.Translate.prototype.translation_text = function( key, parameters ){
			parameters = typeof( parameters ) !== 'undefined' ? parameters : null;

			var t = this.translation[ key ];

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
}( jQuery ));