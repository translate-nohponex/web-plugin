(function($) {

	$.fn.Translate = function( init ){
		init = typeof( init ) !== 'undefined' ? init : {};

		this.parameters = { project_id : null, language : 'en', API_KEY : null, onLoad : null, translationStorageType : sessionStorage };

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
		
		this.api_base = 'https://translate.nohponex.gr/';

		/**
		  * Initialize 
		  */
		this.initialize = function( lang ){
			lang = typeof( lang ) !== 'undefined' ? lang : this.parameters.language;
			var me = this;

			//API Request url
			var api_url = this.api_base + 'fetch/listing/?id=' + this.parameters.project_id + '&language=' + lang +'&api_key=' + this.parameters.API_KEY;

			//Check sessionStorage
			var temp = ( typeof( sessionStorage ) !== 'undefined' ) ? sessionStorage.getItem( api_url ) : null;

			//Check localStorage
			if( !temp && typeof( localStorage ) !== 'undefined' ){
				temp = localStorage.getItem( api_url ); 
			}

			//Use cached translation
			if( temp ){
				
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

			//If cached translation is empty or parsing has failed
			if( !temp ){
				console.log( 'from http..' );
				$.ajax({
					dataType: "json",
					url: api_url,
					/*data: data,*/
					success: function ( data ){
						//if storage type is set
						if( me.parameters.translationStorageType ){
							//Store as JSON string to storage
							me.parameters.translationStorageType.setItem( api_url, JSON.stringify( { language: data.language, translation : data.translation, date : new Date() } ) );
						}
						
						me.language = data.language;
						me.translation = data.translation;

						me.translate_page( 'html' );
					},
					error: function( jqXHR, textStatus, errorThrown ){
						try{
								console.log( jqXHR );
								console.log( jqXHR.responseJSON.error );
								console.log( textStatus );
								console.log( errorThrown );
						}catch(e){}
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
					
					if( t  ){ //If translation is available
    					//Replace element's text
    					el.text( t );
					}else if( !el.text() ){ //If translation is not available and element is empty
					    el.text( key );
					}
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
		this.initialize( );
	};
	
	/**
     * Create a new key 
     * @param {string} key
     * @param {Object} parameters Optional
     */
	$.fn.Translate.prototype.translation_text = function( key, parameters ){
		parameters = typeof( parameters ) !== 'undefined' ? parameters : null;

		var t = this.translation[ key ];

		//If translation is not set
		if( !t ){
			//TODO On missing key add request
			this.add_key( key );
			return null;
		}
		

		//If parameters are set
		if( parameters ){
			for (var k in parameters ) {
			  if (parameters.hasOwnProperty(k)){
			  	t = t.replace( '%' + k + '%', parameters[k] );
			  }
			}
		}
		return t;
	};
	
	/**
	 * Create a new key 
     * @param {string} key
	 */
	$.fn.Translate.prototype.add_key = function( key ){
	    var api_url = this.api_base + 'fetch/create/?id=' + this.parameters.project_id +'&api_key=' + this.parameters.API_KEY + '&key=' + key;
	    
	    $.ajax({
	        type: "POST",
            dataType: "json",
            url: api_url,
            success: function ( data ){
            },
            error: function( jqXHR, textStatus, errorThrown ){                
            }
        });
	};
}( jQuery ));