(function($){

	$.fn.extend({

		leanModal: function(settings) {

			var defaults = {
				top: "10%",
				overlay: 0.5,
				closeButton: null,
				whenClosed: null
			}

			if ( !$("#lean_overlay").length ) {
				var overlay = $("<div id='lean_overlay'></div>");
				$("body").append(overlay);
			}

			settings =  $.extend(defaults, settings);

			return this.each(function() {

				var o = settings;

				$(this).on("open_modal", function() {
					var modal_id = $(this);

					$("#lean_overlay").one("click", function() {
						close_modal(modal_id);
					});

					$(o.closeButton).one("click", function(e) {
						e.preventDefault();
						close_modal(modal_id);
					});

					var modal_height = $(modal_id).outerHeight();
					//var modal_width = $(modal_id).outerWidth();

					$('#lean_overlay').css({ 'display' : 'block', opacity : 0 });

					$('#lean_overlay').fadeTo(350, o.overlay);

					$(modal_id).css({
						'display': 'block',
						'position': 'fixed',
						'opacity': 0,
						'z-index': 11000,
						'left': 50 + '%',
						/*'margin-left': -(modal_width/2) + "px",*/
						'margin-left': "-40%",
						'width': "80%",
						'top': o.top
					});

					$(modal_id).fadeTo(350, 1);
				});

			});

			function close_modal(modal_id) {
				$("#lean_overlay").fadeOut(350);
				$(modal_id).css({ 'display': 'none' });
				$("body").trigger("modal_closed");
				if ( settings.whenClosed ) {
					settings.whenClosed();
				}
			}

		}
	});

})(jQuery);