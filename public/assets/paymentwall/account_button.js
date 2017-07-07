var AccountButton = Class.create({
	initialize: function(popup) {
		this.accountMenu = $(popup + '_account_div');
		this.accountButton = $(popup + '_account_but');

	},
	accountToggle: function() {
		this.accountMenu.toggle(); 
		this.accountButton.toggleClassName('sel');
	}	
});