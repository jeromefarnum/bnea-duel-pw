var CardSaver = Class.create({
	initialize: function(opt) {
		this.saveUrl = opt.saveUrl || 0;
		this.listenCheckBox();
		this.listenSaveButton();
	},
	listenCheckBox: function() {
		if ($('js-save')) {
			$('js-save').observe('click', function(){
				if ($('save').className == "checkbox") {
					 $('save_checkbox_id').writeAttribute("checked", "true");
					 $('save_button_id').show();
				 } else {
					 $('save_checkbox_id').writeAttribute("checked", "");
					 $('save_button_id').hide();
				 }

				 $('save').toggleClassName('checked');
			});
		}
	},
	getSubmitForm: function() {
		if ($('save_card_form')) {
			return $('save_card_form')
		} else {
			return $$('form')[0];
		}
	}, 
	listenSaveButton: function() {
		var ref = this;
		if ($('save_button_id') && this.saveUrl) {
			$('save_button_id').observe('click', function(e){
				if ($('errors')) {
					$('errors').hide();
					$('errors').update('');	
				}	
				e.stop();
				var form = ref.getSubmitForm();
				if(form) {
					new Ajax.Request(ref.saveUrl, {
						method: 'POST',
						parameters: form.serialize(),
						onSuccess: function(t) {
							try{
								var data = t.responseText.evalJSON();
								if (data.result == 1) {
									$('save_card1').hide();
									$('save_card2').show();
								} else {
									if ($('errors')) {
										if (data.error instanceof Array) {
											var error = '';
											data.error.each(function(e){
												error += e + '<br/>';
											});
										} else {
											var error = data.error;
										}
										$('errors').update(error);
										$('errors').show();
									}
								}
							}catch(Exc) {
								/**
								 * for debug
								 */
								console.log(Exc);
							}
						}
					});
				}
			});
		}
	}
});

var CardSaver2click = Class.create(CardSaver,{
	listenCheckBox: function() {
		if ($('save_checkbox_id')) {
			$('save_checkbox_id').observe('change', function(e){if ($('save_button_id')) $('save_button_id').toggle();});
		}
	}
});

var CSFactory = Class.create({
	factory: function(opt) {
		var type = opt.type || 0;
		switch (type) {
			case '2click': 
				return new CardSaver2click(opt);
			default:
				return new CardSaver(opt);
		}
	}
});