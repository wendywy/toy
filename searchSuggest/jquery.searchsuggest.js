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

			self.url = 'http://search.twitter.com/search.json';

			self.search = ( typeof options === 'string' )
				? options
				: options.search;

			self.options = $.extend( {}, $.fn.searchsuggest.options, options );

			$("<input />").attr({ 
				type: 'text', 
				class: 'top_search_box',
				disabled: 'disabled', 
				autocomplete: 'off'		
			}).addClass("suggest_term_grey").insertAfter("#input_top_search").hide().val('');

			$("#input_top_search").css({
				"position": "absolute",
				"zIndex": 6
			});

			self.keyboardSupport;
		},
		fetch: function() {
			return $.ajax({
				url: this.url,
				data: { q: this.search },
				dataType: 'jsonp'
			});
		}
		addSuggestText: function(data, requestTerm) {
			var textCount = requestTerm.length;
			var $inputSuggest = $('input.suggest_term_grey');
			console.log("L:" + $('input.suggest_term_grey').length);

			$inputSuggest.show().val((data.length>0)? (requestTerm + data[0].substring(textCount)):'');
			
		}

		keyboardSupport: function(){
			$('#input_top_search').on('keydown', function(e) { 
			  var keyCode = e.keyCode || e.which; 
			  var suggestText = $('input.suggest_term_grey').val();
			  if (keyCode == 9|| keyCode == 39) {
			  	// tab key and arrow go right key
			    // call custom function here
			    if(suggestText.length>0){
			    	$('#input_top_search').val(suggestText);
			    	$('input.suggest_term_grey').val('');
			   		 e.preventDefault(); 
			  	}  else if (keyCode == 9) {
	    			e.preventDefault(); 
			  	}
	  		  }  else if (keyCode == 40) {
	    		// go down
			    $('input.suggest_term_grey').hide().val('');

			  }
			});
		}


	}

	$.fn.searchsuggest = function(options) {
		  return this.each(function() {
		  	var searchsuggest = Object.create( Searchsuggest );
		  	searchsuggest.init( options, this );
		  });
	}
	$.fn.searchsuggest.options = {
		search: '@tutspremium',
		wrapEachWith: '<li></li>',
		limit: 10,
		refresh: null,
		onComplete: null,
		transition: 'fadeToggle'
	};


})(jQuery, window, document);
