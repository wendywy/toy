// Utility V0.9

if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {};
		F.prototype = obj;
		return new F();
	};
}

(function($, window, document, undefined){
	var Searchsuggest = {
		init: function( options, elem ) {
			var self = this;

			self.elem = elem;
			self.$elem = $( elem );

			self.search = ( typeof options === 'string' )
				? options
				: options.search;

			self.options = $.extend( {}, $.fn.searchsuggest.options, options );

			$("<input />").attr({ 
				type: 'text', 
				class: 'top_search_box',
				disabled: 'disabled', 
				autocomplete: 'off'		
			}).addClass("suggest_term_grey").insertAfter(self.$elem).hide().val('');

			// self.$elem.css({
			// 	"position": "absolute",
			// 	"zIndex": 6
			// });

			self.autocomplete(elem);
			self.keyboardSupport(elem);
		},
		autocomplete: function(elem){
			var self = this;
			self.elem = elem;
			self.$elem = $( elem );
			self.$elem.autocomplete({
				source: function( request, response ) {
							$.ajax({
								url: self.options.url,
								dataType: "jsonp",
								jsonp: "jsonp",
								data: {
									type: "search.suggestedterm",
									max: self.options.limit,
									term: request.term
								},
								cache: true,
								success: function( data ) {
									response( data );
									self.addSuggestText(data, request.term);

								}
						});
					},
					minLength: self.options.minLength,
					delay: self.options.delay,
					select: function( event, ui ) {
					 	$( this ).val(ui.item.label);
					
						if ( self.options.onSelect && typeof self.options.onSelect === 'function' ) {
								//self.options.suggestedSearchSelectEvent();
							self.options.onSelect.apply( self.elem, arguments );
						}


					 	return false;	
					},
					open: function() {
						$( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
					},
					close: function() {
						$( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
						$(".suggest_term_grey").hide();
					}
				});
			
		},

		addSuggestText: function(data, requestTerm) {
			var textCount = requestTerm.length;
			var $inputSuggest = $('input.suggest_term_grey');

			$inputSuggest.show().val((data.length>0)? (requestTerm + data[0].substring(textCount)):'');
			
		},

		keyboardSupport: function(elem){
			var self = this;
			self.$elem = $( elem );

			self.$elem.on('keydown', function(e) { 
			  var keyCode = e.keyCode || e.which; 
			  var $inputSuggest = $('input.suggest_term_grey');
			  var suggestText = $inputSuggest.val();
			  if (keyCode == 9|| keyCode == 39) {
			  	// tab key and arrow go right key
			    // call custom function here
			    if(suggestText.length>0){
			    	self.$elem.val(suggestText);
			    	$inputSuggest.val('');
			   		 e.preventDefault(); 
			  	}  else if (keyCode == 9) {
	    			e.preventDefault(); 
			  	}
	  		  }  else if (keyCode == 40) {
	    		// go down
			    $inputSuggest.hide().val('');

			  }
			});
		}
	};

	$.fn.searchsuggest = function(options) {
		  return this.each(function() {
		  	var searchsuggest = Object.create( Searchsuggest );
		  	searchsuggest.init( options, this );
		  });
	}
	$.fn.searchsuggest.options = {
		url: 'http://preview.lasoo.com.au/data.js',
		limit: 10,
		minLength: 1,
		delay: 700,
		onSelect: null
	};


})(jQuery, window, document);
