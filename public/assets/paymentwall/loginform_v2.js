var LoginForm = Class.create( {
	initialize: function(popup, offerwall, deactivate, urlParams, isNewWindow, useSsl, options) {
		this.previousPage = '';
		this.currentPage = '';
		this.userName = '';
		this.inquiryLogin = false;
		this.closeWindow = false;
		this.popupName = popup;
		this.popup = $(popup);
		this.popupButton = $(popup + "_account_but"); /* if widget == w6*/
		this.offerwall = $(offerwall);
		this.deactivate = $(deactivate);

		this.urlParams = urlParams;
		this.isNewWindow = isNewWindow;
		this.redirectToWithUserId = (!options || typeof options.redirectToWithUserId == 'undefined') ? 0 : options.redirectToWithUserId;

		this.loginFormContainer = $(popup + '_login');
		this.signupFormContainer = $(popup + '_signup');
		this.signupFormContainerQuick = $(popup + '_signup_quick');
		this.signupFormContainerQuickStep1 = $(popup + '_signup_quick_step1');
		this.verifyAccountFormContainer = $(popup + '_verify_account_form');
		this.forgotPasswordFormContainer = $(popup + '_forgot_password');
		this.emailHashFormContainer = $(popup + '_email_hash');
		this.resetPasswordFormContainer = $(popup + '_reset_pass');

		this.titleMiniText = $(popup + '_title_mini');

		this.loginForm = $(popup + '_login_form');
		this.loginFormQuick = $(popup + '_login_form_quick');
		this.signupForm = $(popup + '_signup_form');
		this.signupFormQuick = $(popup + '_signup_form_quick');
		this.emailSentToField = $(popup + '_confirmation_email_value');
		this.resendPasswordForm = $(popup + '_signup_form_quick_resend');
		this.shortLoginFormQuick = $(popup + '_short_login_form_quick');

		this.forgotPasswordForm = $(popup + '_forgot_password_form');
		this.emailHashForm = $(popup + '_email_hash_form');
		this.resetPasswordForm = $(popup + '_reset_pass_form');

		this.logoutForm = $(popup + '_logout_form');
		this.emailConfirmDiv = $(popup + '_signup_email_confirm');

		this.forgotPasswordForm_Email = $(popup + '_forgot_password_email');
		this.emailHashForm_Userhash = $(popup + '_userhash_code_check');
		this.emailHashForm_Hash = $(popup + '_hash');
		this.emailHashForm_Email = $(popup + '_remind_password_email_value');
		this.resetPasswordForm_PasswordHash = $(popup + '_hash_password_check');
		this.resetPasswordForm_Userhash = $(popup + '_userhash_password_check');
		this.resetPasswordForm_Message = $(popup + '_passwords_changed');
		this.resetPasswordForm_FieldsContainer = $(popup + '_reset_passwords_container');

		this.skipLoginBox = $(popup + '_skip_login');
		this.useSsl = (typeof useSsl == 'undefined') ? 0 : useSsl;

		this.accountButtonHolder = $('account_toolbar');
		this.accountMenuDiv = $(popup + '_account_div');
		this.standaloneResendSuccessfull = $(popup + '_resent_successfully');
		this.standaloneBackButton = $(popup + '_back_button');
		this.standaloneSignUpStep1 = $(popup + '_signup_step_1');
		this.standaloneHeaderText = $(popup + '_header_text');
		this.loginInquiryForm = $(popup + '_login_inquiry_form');
		this.signupInquiryForm = $(popup + '_signup_inquiry_form');
		this.isLoggedIn = (options && options.isLoggedIn) ? true : false;
		this.useUpdateSignupFlowForMobiamoStandalone = (options && options.useUpdateSignupFlowForMobiamoStandalone) ? true : false;
		this.helpButton = $(popup + '_help_button');
		this.accountMenuActions = $(popup + '_account_menu_actions');
		this.postInitialize();

		this.onLoginListeners = [];
		this.turnedOnClose = false;

		this.backToLoginForm = this.showLoginForm;

		this.lastResponse = {};
	},
	showHideForms: [
		'login',
		'signup',
		'forgot_password',
		'email_hash',
		'reset_pass',
		'signup_quick',
		'signup_email_confirm',
		'login_inquiry_form',
		'signup_inquiry_form'
	],
	postInitialize: function() {},
	open: function() {},
	close: function() {},
	turnOnClose: function() {
		this.turnedOnClose = true;
	},
	onClose: function(){},
	refresh: function() {},
	showLoginForm: function() {
		this.hideOther();
		this.hideErrors(this.loginForm);
		this.loginFormContainer.show();
		this.loginForm.show();
		this.titleMiniText.innerText = this._tx("Log in");
		this.backToLoginForm = this.showLoginForm;

		var ref = this;
		this.loginForm.onsubmit = function () {return ref.login()};
	},
	showLoginFormQuick: function() {
		this.hideOther();
		this.hideErrors(this.loginFormQuick);
		this.signupFormContainerQuick.show();
		this.loginFormQuick.show();
		this.titleMiniText.innerText = this._tx("Sign up");
		this.backToLoginForm = this.showLoginFormQuick;
	},
	showSignupForm: function() {
		this.hideOther();
		this.hideErrors(this.signupForm);
		this.signupFormContainer.show();
		this.signupForm.show();
		this.titleMiniText.innerText = this._tx("Sign up");
	},
	showForgotPasswordForm: function() {
		this.clearInputs();
		this.hideOther();
		this.hideErrors(this.forgotPasswordForm);
		this.forgotPasswordFormContainer.show();
		this.forgotPasswordForm.show();
		this.titleMiniText.innerText = this._tx("Password Reminder");
	},
	showEmailHashForm: function() {
		this.hideErrors(this.emailHashForm);
		this.hideOther();
		this.emailHashFormContainer.show();
		this.emailHashForm.show();
	},
	showResetPassForm: function() {
		this.hideErrors(this.resetPasswordForm);
		this.hideOther();
		this.resetPasswordFormContainer.show();
		this.resetPasswordForm.show();
	},
	openLoginForm: function() {
		this.hideAccountMenu();
		this.popupButton.toggleClassName("sel"); /* if widget == w6*/
		this.close();
		this.open();
		this.showLoginForm();
	},
	openLoginFormQuick: function() {
		this.hideAccountMenu();
		this.close();
		this.open();
		this.showLoginFormQuick();
	},
	openSignupForm: function() {
		this.hideAccountMenu();
		this.popupButton.toggleClassName("sel"); /* if widget == w6*/
		this.close();
		this.open();
		this.showSignupForm();
	},
	openSignupFormQuick: function() {
		this.hideAccountMenu();
		this.close();
		this.open();

		this.showLoginFormQuick();
	},
	openForgotPasswordForm: function() {
		this.close();
		this.open();
		this.showForgotPasswordForm();
	},
	openEmailHashForm: function() {
		this.close();
		this.open();
		this.showEmailHashForm();
	},
	openResetPassForm: function() {
		this.close();
		this.open();
		this.showResetPassForm();
	},
	hideOther: function() {
		if (this.popup) {
			var popupId = this.popup.id;
			this.showHideForms.each(function(e) {
				var form = $(popupId + '_' + e);
				if (form) {
					form.hide();
				}
			});
		}
	},
	clearInputs: function() {
		$$('[id=' + this.popupName + '] input[type=text]').each(function(e) {
			e.setValue('');
		});
	},
	loginCallback: function (ref) {
		if (window.opener) { // if it's a new window login
			if (typeof window.opener.loginForm !== 'undefined') {
				window.opener.loginForm.loginCallback(window.opener.loginForm);
			}
		}
		ref.callOnLoginListeners();
		var turnedOnClose = ref.turnedOnClose;
		ref.turnedOnClose = false;
		ref.close();
		ref.turnedOnClose = turnedOnClose;
	},
	login: function(onLoginCallback) {
		var onLoginCallback = onLoginCallback || null;
		this.customLogin(this.loginForm, onLoginCallback);
		return false;
	},
	loginQuick: function() {
		this.customLogin(this.loginFormQuick, this.loginCallback);
		return false;
	},
	loginShort: function() {
		this.customLogin(this.shortLoginFormQuick, this.loginCallback);
		return false;
	},
	customLogin: function(form, onLogin) {
		var ref = this;
		new Ajax.Request(form.action, {
			parameters: form.serialize(),
			onSuccess: function(t) {
				var result = t.responseText.evalJSON();
				ref.lastResponse = result;
				if (result.result == 1) {
					if (typeof onLogin === 'function') { // if callback given - call it
						ref.reloadAccountMenu();
						onLogin(ref);
					} else { // otherwise do default action
						ref.refresh('login');
					}
				} else {
					ref.showErrors(form, result.errors);
				}
			}
		});
	},
	logout: function() {
		var ref = this;
		new Ajax.Request(ref.logoutForm.action, {
			parameters: ref.logoutForm.serialize(),
			onSuccess: function(t) {
				var result = t.responseText.evalJSON();
				ref.lastResponse = result;
				if (result.result == 1) {
					ref.refresh('logout');
				} else {
					ref.showErrors(ref.loginForm, result.errors);
				}
			}
		});
	},
	signup: function() {
		var ref = this;
		new Ajax.Request(ref.signupForm.action, {
			parameters: ref.signupForm.serialize(),
			onSuccess: function(t) {
				var result = t.responseText.evalJSON();
				ref.lastResponse = result;
				if (result.result == 1) {
					ref.signupForm.hide();
					ref.skipLoginBox.hide();
					ref.emailConfirmDiv.show();
				} else {
					ref.showErrors(ref.signupForm, result.errors);
				}
			}
		});
		return false;
	},
	signupQuick: function() {
		var ref = this;
		new Ajax.Request(
			this.signupFormQuick.action, {
				parameters: ref.signupFormQuick.serialize(),
				onSuccess: function(t) {
					var result = t.responseText.evalJSON();
					ref.lastResponse = result;
					if (result.result == 1) {
						ref.signupFormContainerQuickStep1.hide();
						var emailInput = $(ref.signupFormQuick['data[email]']);
						var email = emailInput.getValue();
						ref.emailSentToField.innerHTML = email; // fill quick login for fields
						$(ref.shortLoginFormQuick['login']).value = email;
						$(ref.shortLoginFormQuick['hash']).value = result.data.hash; // fill resend form fields
						$(ref.resendPasswordForm['ua_id']).value = result.data.id;
						$(ref.resendPasswordForm['hash']).value = result.data.hash;
						ref.verifyAccountFormContainer.show();
					} else if (typeof result.error_code !== 'undefined' && result.error_code == 1) { // if email already exists
						ref.signupFormContainerQuick.hide();
						var emailInput = $(ref.signupFormQuick['data[email]']);
						ref.loginForm.login.value = emailInput.getValue();

						ref.showErrors(ref.loginForm, result.errors);

						ref.loginForm.onsubmit = function () {return ref.login(ref.loginCallback)};
						ref.titleMiniText.innerText = ref._tx("Log in");
						ref.loginFormContainer.show();
					} else {
						ref.showErrors(ref.signupFormQuick, result.errors);
					}
				}
			});
		return false;
	},
	signupQuickResend: function() {
		var ref = this;
		new Ajax.Request(this.resendPasswordForm.action, {
			parameters: ref.resendPasswordForm.serialize(),
			onSuccess: function(t) {
				var result = t.responseJSON;
				ref.lastResponse = result;
				if (result.result) {
					var didntReceiveSpan = ref.resendPasswordForm.up().down();
					didntReceiveSpan.hide();
					didntReceiveSpan.next().show();
				}
			}
		});
	},
	forgotPassword: function(resend, el) {
		var resend = resend || false;
		var el = el || null;
		var ref = this;
		new Ajax.Request(ref.forgotPasswordForm.action, {
			parameters: ref.forgotPasswordForm.serialize(),
			onSuccess: function(t) {
				var result = t.responseText.evalJSON();
				ref.lastResponse = result;
				if (result.result) {
					ref.openEmailHashForm();

					var email = ref.forgotPasswordForm['email'];
					ref.emailHashForm_Email.innerHTML = $(email).getValue();

					if (resend && el) {
						var didntReceiveSpan = $(el).up().down();
						didntReceiveSpan.hide();
						didntReceiveSpan.next().show();
					}
				} else {
					ref.showErrors(ref.forgotPasswordForm, result.errors);
				}
			}
		});
		return false;
	},
	checkCode: function() {
		var ref = this;
		new Ajax.Request(ref.emailHashForm.action, {
			parameters: ref.emailHashForm.serialize(),
			onSuccess: function(t) {
				var result = t.responseText.evalJSON();
				ref.lastResponse = result;
				if (!result.errors.length) {
					ref.resetPasswordForm_PasswordHash.setValue(result.result);
					ref.emailHashForm_Hash.setValue('');
					ref.openResetPassForm();
				} else {
					ref.showErrors(ref.emailHashForm, result.errors);
				}
			}
		});
		return false;
	},
	resetPassword: function() {
		var ref = this;
		new Ajax.Request(ref.resetPasswordForm.action, {
			parameters: ref.resetPasswordForm.serialize(),
			onSuccess: function(t) {
				var result = t.responseText.evalJSON();
				ref.lastResponse = result;
				if (result.result == 1) {
					ref.resetPasswordForm_FieldsContainer.hide();
					ref.resetPasswordForm_Message.show();
					ref.hideErrors(ref.resetPasswordForm);
					this.clearInputs();
				} else {
					ref.showErrors(ref.resetPasswordForm, result.errors);
				}
			}
		});
		return false;
	},
	showErrors: function(form, errors) {
		var errorsContainer = this.getErrorsContainer(form);
		var html = this.buildErrorsHtml(errors);
		errorsContainer.update(html);
		errorsContainer.show();
	},
	hideErrors: function(form) {
		this.getErrorsContainer(form).hide();
	},
	getErrorsContainer: function(form) {
		return errorsContainer = form.select('div[class="error"]').pop();
	},
	buildErrorsHtml: function(errors) {
		var result = '<ul>';
		errors.each(function(error) {
			result += '<li>' + error + '</li>';
		});

		result += '</ul>';

		return result;
	},
	reloadPage: function() {
		this.refresh();
	},

	backToSignupFormQuick: function() {
		this.verifyAccountFormContainer.hide();
		this.signupFormContainerQuickStep1.show();
	},

	// calls login listeners
	callOnLoginListeners: function() {
		for (var i = 0; i < this.onLoginListeners.length; i++) {
			this.onLoginListeners[i].callback(this.onLoginListeners[i].ref);
		}
	},
	// adds listener to login event
	addOnLoginListeners: function(callback, ref) {
		if (callback && typeof (callback) === 'function') {
			this.onLoginListeners.push( {
				callback: callback,
				ref: ref
			});
		}
	},
	// hides account menu
	hideAccountMenu: function() {
		if (this.accountMenuDiv) {
			this.accountMenuDiv.hide();
		}
	},
	// reloads account menu div
	reloadAccountMenu: function() {
		var ref = this;
		if (this.accountMenuDiv) {
			new Ajax.Request(ControllersUrl + 'login/account-menu?' + this.urlParams, {
				parameters: {},
				method: "GET",
				onSuccess: function(t) {
					var result = t.responseText.evalJSON();
					ref.lastResponse = result;
					if (result.success !== 'undefined' && result.success) {
						ref.accountButtonHolder.update(result.html);
						account = new AccountButton("login_popup");
						ref.logoutForm = $(ref.popupName + '_logout_form');
					}
				}
			});
		}
	},
	// translation helper
	_tx: function(source) {
		if ('undefined' != typeof(_string_table) && undefined != _string_table[source]) {
			return _string_table[source];
		} else return source;
	}

});

var MobileLoginForm = Class.create(LoginForm, {
	initialize: function($super, popup, offerwall, deactivate, urlParams, isNewWindow, useSsl) {
		$super(popup, offerwall, deactivate, urlParams, isNewWindow, useSsl);
		this.urlParams = urlParams;
		this.loginForm = $(popup + '_login_form');
		this.signupForm = $(popup + '_signup_form');
		this.logoutForm = $(popup + '_logout_form');
		this.resetPasswordFormContainer = $(popup + '_reset_passwords_container');
	},
	signup: function() {
		var ref = this;
		new Ajax.Request(ref.signupForm.action, {
			parameters: ref.signupForm.serialize(),
			onSuccess: function(t) {
				var result = t.responseText.evalJSON();
				ref.lastResponse = result;
				if (result.result == 1) {
					$('form_signup').hide();
					$('confirm_signup').show();
					$('footer').hide();
				} else {
					ref.showErrors(ref.signupForm, result.errors);
					if ($('header_in')) {
						new Effect.ScrollTo('header_in');
					}
				}
			}
		});
	},
	refresh: function() {
		window.location.reload();
	},
	logout: function() {
		var ref = this;
		new Ajax.Request(ref.logoutForm.action, {
			parameters: ref.logoutForm.serialize(),
			onSuccess: function(t) {
				var result = t.responseText.evalJSON();
				ref.lastResponse = result;
				if (result.result == 1) {
					ref.refresh();
				} else {
					// ref.showErrors(ref.loginForm, result.errors);
				}
			}
		});
	},
	showHideForms: [ 'forgot_password', 'email_hash',
			'reset_passwords_container', 'passwords_changed' ],
	hideOther: function() {
		var popupId = 'ps_mobile';
		this.showHideForms.each(function(e) {
			$(popupId + '_' + e).hide();
		});
	}
});

var LoginFormHtml = Class.create(LoginForm, {
	open: function() {
		this.setUpFacebookLoginUrl();
		this.toggle();
	},
	toggle: function() {
		this.showLoginForm();
		this.popup.toggle();
		this.offerwall.style.opacity = this.offerwall.style.opacity == '0.5' ? '1' : '0.5';
		this.deactivate.toggle();
	},
	close: function() {
		this.showLoginForm();
		this.popup.hide();
		this.offerwall.style.opacity = '1';
		this.deactivate.hide();
        if(this.turnedOnClose === true){
            this.onClose();
        }
	},
    onClose: function(){
        this.refresh();
    },
	refresh: function() {
		window.location.reload();
	},
	setUpFacebookLoginUrl: function() {
		var ref = this;
		var queryUrl = ControllersUrl + 'login/get-fb-login-url/?' + this.urlParams;
		queryUrl = this.useSsl ? queryUrl.replace('http://','https://'): queryUrl;
		new Ajax.Request(
			queryUrl, {
			onSuccess: function(t) {
				var result = t.responseText.evalJSON();
				ref.lastResponse = result;
				$$('.fbconnect_pop').each(function(el) {el.href = result['url']});
			},
			onFailure: function() {
				$$('.fbconnect_pop').each(function(el) {el.hide()});
			}
		});
	},
	showSignupFormWithFbData: function(data) {
		this.hideErrors(this.signupForm);
		this.loginFormContainer.hide();
		$H(data).each(function(item) {
			var id = 'loginform_' + item[0];
			if ($(id)) {
				$(id).setValue(item[1]);
			}
		});

		//this.signupFormContainer.show();
		this.showSignupForm();
	}
});

var LoginFormNewWindow = Class.create(LoginForm, {
	postInitialize: function() {
		if (this.popup) {
			// //this.skipLoginBox.hide();
			// this.showLoginForm();
			this.popup.show();
			this.offerwall.style.opacity = '1';
			this.deactivate.show();
		}
	},
	open: function() {
		this.openInNewWindow();
	},
	close: function() {
        if(this.closeWindow === true){
            this.closeWindow = false;
            window.close();
        }
	},
	refresh: function(action) {
		if (action == 'logout') {
			window.location.reload();
		} else {
			this.close();
			window.opener.location.reload();
		}
	},
	openInNewWindow: function(operation) {
		var windowUrl = this.useSsl ? ControllersUrl.replace('http://', 'https://'): ControllersUrl;
		loginWindow = window.open(windowUrl + 'login/?' + this.urlParams + '&operation=' + (operation || 'login'),
			'Paymentwall',
			'scrollbars=yes,resizable=yes,location=no,width=800,height=530');
		var ref = this;
		loginTimer = setInterval(function() {ref.checker(ref)}, 2000);
	},
	checker: function(ref) {
		if (loginWindow.closed) {
			clearInterval(loginTimer);
			if (ref.onLoginListeners.length == 0) {
				window.location.href = window.location.href;
			}
		}
	},
	openLoginForm: function() {
		this.close();
		this.openInNewWindow('login');
	},
	openSignupForm: function() {
		this.close();
		this.openInNewWindow('signup');
	},
	openSignupFormQuick: function() {
		this.close();
		this.openInNewWindow('signupQuick');
	},
	openForgotPasswordForm: function() {
		this.close();
		this.openInNewWindow('forgotPassword');
	},
	openEmailHashForm: function() {
		this.forgotPasswordFormContainer.hide();
		this.emailHashFormContainer.show();
	},
	openResetPassForm: function() {
		this.emailHashFormContainer.hide();
		this.resetPasswordFormContainer.show();
	}
});

var LoginFormNewWindowRedirectWithUserId = Class.create(LoginForm, {
	refresh: function(action) {
		document.location.href = this.redirectToWithUserId + ( this.lastResponse.email ? '&uid=' + this.lastResponse.email : ''); 
	}
});

var LoginFormMobiamoStandalone = Class.create(LoginForm, {
	postInitialize: function() {
		this.initBackButton();
		this.initAccountMenu();
	},
	initBackButton: function() {
		LoginForm.previousPage = this.deactivate;
		var ref = this;
		this.standaloneBackButton.observe('click', function(){
			if (LoginForm.previousPage != ref.deactivate) {
				ref.hideAllLoginStep();
				LoginForm.previousPage.show();
				LoginForm.currentPage = LoginForm.previousPage;
				ref.updateHeaderText(LoginForm.currentPage);
				if (LoginForm.currentPage == ref.loginFormContainer || LoginForm.currentPage == ref.signupFormContainer || LoginForm.currentPage == ref.standaloneSignUpStep1) {
					LoginForm.previousPage = ref.deactivate;
				}
			} else {
				ref.deactivate.show();
				ref.popup.hide();
				ref.standaloneBackButton.hide();
				ref.standaloneHeaderText.hide();
				$('header-text').show();
				if (!$('ps_price_table_cnt')) {
					$('back-button').show();
				}
			}
		});
	},

	hideAllLoginStep: function() {
		$$('.login-step').each(function(el) {
			el.hide();
		});
	},
	open: function() {
		this.setUpFacebookLoginUrl();
		this.toggle();
	},
	toggle: function() {
		this.showLoginForm();
		this.popup.toggle();
	},
	showLoginForm: function(action) {
		this.hideOther();
		this.hideErrors(this.loginForm);
		this.loginFormContainer.show();
		this.deactivate.hide();
		this.loginForm.show();
		this.backToLoginForm = this.showLoginForm;
		var ref = this;
		this.standaloneBackButton.show();
		this.updateHeaderText(this.loginFormContainer);
		LoginForm.inquiryLogin = (action == 'help');
		this.loginForm.onsubmit = function () {return ref.login()};
		$('back-button').hide();
	},
	close: function() {
		this.showLoginForm();
		this.popup.hide();
		this.offerwall.style.opacity = '1';
		if(this.turnedOnClose === true){
			this.onClose();
		}
	},
	onClose: function(){
		this.refresh();
	},
	setUpFacebookLoginUrl: function() {
		var ref = this;
		var queryUrl = ControllersUrl + 'login/get-fb-login-url/?' + this.urlParams;
		queryUrl = this.useSsl ? queryUrl.replace('http://','https://'): queryUrl;
		new Ajax.Request(
			queryUrl, {
				onSuccess: function(t) {
					var result = t.responseText.evalJSON();
					ref.lastResponse = result;
					$$('.fbconnect_pop').each(function(el) {el.href = result['url']});
				},
				onFailure: function() {
					$$('.fbconnect_pop').each(function(el) {el.hide()});
				}
			});
		if ($$('.fbconnect_pop')) {
			$$('.fbconnect_pop').each(function(el) {
				el.observe('click', function(e) {
					e.stop();
					var left = screen.width/2 - 500;
					var top = screen.height/2 - 300;
					window.open(el.readAttribute('href'),'Paymentwall','scrollbars=yes,resizable=yes,location=yes,width=1000,height=600,screenX='+left+',screenY='+top+',left='+left+',top='+top);
				});
			});
		}
	},
	refresh: function(action) {
		$('header-text').show();
		this.standaloneHeaderText.hide();
		paymentSystems.open(null, 'mobilegateway', true);
		this.updateMenuSelect(action);
		this.standaloneBackButton.hide();
		this.popup.hide();
		this.deactivate.show();
	},
	showSignupFormWithFbData: function(data) {
		this.hideErrors(this.signupForm);
		this.loginFormContainer.hide();
		$H(data).each(function(item) {
			var id = 'loginform_' + item[0];
			if ($(id)) {
				$(id).setValue(item[1]);
			}
		});

		//this.signupFormContainer.show();
		this.showSignupForm();
	},
	forgotPassword: function(resend, el) {
		var resend = resend || false;
		var el = el || null;
		var ref = this;
		new Ajax.Request(ref.forgotPasswordForm.action, {
			parameters: ref.forgotPasswordForm.serialize(),
			onSuccess: function(t) {
				var result = t.responseText.evalJSON();
				ref.lastResponse = result;
				if (result.success) {
					ref.openEmailHashForm();

					var email = ref.forgotPasswordForm['data[email]'];
					ref.emailHashForm_Email.innerHTML = $(email).getValue();

					if (resend && el) {
						ref.standaloneResendSuccessfull.show();
					} else {
						ref.standaloneResendSuccessfull.hide();
					}
					ref.updateHeaderText(ref.forgotPasswordFormContainer);
				} else {
					ref.showErrors(ref.forgotPasswordForm, result.errors);
				}
			}
		});
		return false;
	},
	showForgotPasswordForm: function() {
		this.clearInputs();
		this.hideOther();
		this.hideErrors(this.forgotPasswordForm);
		this.forgotPasswordFormContainer.show();
		this.forgotPasswordForm.show();
		this.updateHeaderText(this.forgotPasswordFormContainer);
		LoginForm.previousPage = this.loginFormContainer;
		LoginForm.currentPage = this.forgotPasswordFormContainer;
	},
	showSignupForm: function() {
		this.hideOther();
		this.hideErrors(this.signupForm);
		this.signupFormContainer.show();
		this.signupForm.show();
		this.updateHeaderText(this.standaloneSignUpStep1);
		this.standaloneSignUpStep1.show();
		this.standaloneBackButton.show();
		$('back-button').hide();
	},
	signup: function() {
		var ref = this;
		new Ajax.Request(ref.signupForm.action, {
			parameters: ref.signupForm.serialize(),
			onSuccess: function(t) {
				var result = t.responseText.evalJSON();
				ref.lastResponse = result;
				if ((ref.useUpdateSignupFlowForMobiamoStandalone && result.result) || result.success) {
					ref.signupForm.reset();
					ref.signupForm.hide();
					ref.skipLoginBox.hide();
					if (LoginForm.inquiryLogin) {
						ref.signupInquiryForm.show()
					} else {
						ref.emailConfirmDiv.show();
					}
					ref.standaloneBackButton.hide();
					ref.updateHeaderText();
					ref.isLoggedIn = true;
					if (result.name) {
						ref.userName = result.name;
					}
				} else {
					ref.showErrors(ref.signupForm, result.errors);
				}
			}
		});
		return false;
	},
	updateHeaderText: function(form, custom) {
		var headerText = '';
		if (form == this.loginFormContainer) {
			headerText = '<h2> <span> '+ this._tx('Log in')+ (custom ? '<div class="step-number">'+this._tx("Have a question about your payments?") +'</div>': '')+ '</span></h2>';
		} else if (form == this.standaloneSignUpStep1) {
			headerText = '<h2> <span>'+ this._tx('Sign Up') + '</span></h2>';
		} else if (form == this.forgotPasswordFormContainer) {
			headerText = '<h2> <span>'+ this._tx('Password Reminder')+'</span> </h2>';
		}
		this.standaloneHeaderText.update(headerText);
	},
	customLogin: function(form, onLogin) {
		var ref = this;
		new Ajax.Request(form.action, {
			parameters: form.serialize(),
			onSuccess: function(t) {
				var result = t.responseText.evalJSON();
				ref.lastResponse = result;
				if (result.success) {
					form.reset();
					if (result.name) {
						ref.userName = result.name;
					}
					ref.isLoggedIn = true;
					if (LoginForm.inquiryLogin) {
						ref.loginForm.reset();
						ref.loginForm.hide();
						ref.loginInquiryForm.show();
						ref.standaloneBackButton.hide();
						ref.updateHeaderText();
					} else {
						ref.refresh('login');
					}
				} else {
					ref.showErrors(form, result.errors);
				}
			}
		});
	},
	openLoginForm: function(action) {
		this.close();
		this.open();
		this.showLoginForm(action);
	},
	openSignupForm: function() {
		this.close();
		this.open();
		this.showSignupForm();
	},

	logout: function() {
		var ref = this;
		new Ajax.Request(ref.logoutForm.action, {
			parameters: ref.logoutForm.serialize(),
			onSuccess: function(t) {
				var result = t.responseText.evalJSON();
				ref.lastResponse = result;
				if (result.result == 1) {
					ref.isLoggedIn = false;
					ref.refresh('logout');
				} else {
					// ref.showErrors(ref.loginForm, result.errors);
				}
			}
		});
	},
	initAccountMenu: function(){
		document.observe('click', function(e, el){
			if(e.target != $('mo1_login_popup_account_div') && !e.target.descendantOf('mo1_login_popup_account_div')) {
				$('mo1_login_popup_account_menu_actions').hide();
			}
		});
		this.handleAccountMenuSelect();
	},
	handleAccountMenuSelect: function(){
		var ref = this;
		ref.accountMenuDiv.observe('click', function(){
			$('mo1_login_popup_account_menu_actions').toggle();
		});
		ref.accountMenuDiv.observe('blur', function(){
			$('mo1_login_popup_account_menu_actions').hide();
		});

		$$('.account-menu-action').each(function(item){
			item.observe('click', function(){
				var option = item.readAttribute('data-value');
				if (option == 'mysetting') {
					var win = window.open(BaseUrl + 'users/account', '_blank');
					win.focus();
				} if (option == 'help') {
					if (ref.isLoggedIn) {
						var win = window.open(BaseUrl + 'users/account/inquiries', '_blank');
						win.focus();
					} else {
						ref.openLoginForm('help');
						$('header-text').hide();
						ref.updateHeaderText(ref.loginFormContainer, true);
						ref.standaloneHeaderText.show();
					}
				} else if (option == 'logout') {
					ref.logout();
				} else if (option == 'login') {
					ref.openLoginForm();
					$('header-text').hide();
					ref.standaloneHeaderText.show();
				} else if (option == 'signup') {
					ref.openSignupForm();
					$('header-text').hide();
					ref.standaloneHeaderText.show();
				}
				if ($('bigText')) {
					$('bigText').hide();
				}
			});
		});
	},
	updateMenuSelect: function(action){
		this.accountMenuDiv.stopObserving();
		var html = '';
		if (action == 'logout') {
			html +=	'<div  class="footer-select-visible" data-value="">' + this._tx("My Account") +'</div>';
			html +=	'<ul id="mo1_login_popup_account_menu_actions" class="footer-select-list" style="display: none">';
			html +=	'<li class="footer-select-list__login account-menu-action" data-value="login">' + this._tx('Log in') +'</li>';
			html +=	'<li class="footer-select-list__sigup account-menu-action" data-value="signup">' + this._tx('Sign up') + '</li>';
			html +=	'<li class="footer-select-list__sigup account-menu-action"  data-value="help">' + this._tx('Help') + '</li>';
			html +=	'</ul>';
		} else {
			html +=	'<div  class="footer-select-visible" data-value="">' + this.userName +'</div>';
			html +=	'<ul id="mo1_login_popup_account_menu_actions" class="footer-select-list" style="display: none">';
			html += '<li class="footer-select-list__settings account-menu-action" data-value="mysetting">' + this._tx('My Setting')+ '</li>';
			html += '<li class="footer-select-list__help account-menu-action" data-value="help">' + this._tx('Help')+ '</li>';
			html += '<li class="footer-select-list__logout account-menu-action" data-value="logout">' + this._tx('Log out') + '</li>';
			html +=	'</ul>';
		}
		this.accountMenuDiv.update(html);
		this.handleAccountMenuSelect();
	}
});

var LoginFormsFactory = Class.create( {
	factory : function(popup, offerwall, deactivate, urlParams, isNewWindow, useSsl, options) {
		if (options && options.redirectToWithUserId) {
			return new LoginFormNewWindowRedirectWithUserId(popup, offerwall, deactivate, urlParams, isNewWindow, useSsl, options);
		}
		if (popup == 'ps_mobile') {
			return new MobileLoginForm(popup, offerwall, deactivate, urlParams, isNewWindow, useSsl);
		}
		if (isNewWindow) {
			return new LoginFormNewWindow(popup, offerwall, deactivate, urlParams, isNewWindow, useSsl);
		}
		if (popup == 'mo1_login_popup') {
			return new LoginFormMobiamoStandalone(popup, offerwall, deactivate, urlParams, isNewWindow, useSsl, options);
		}
		return new LoginFormHtml(popup, offerwall, deactivate, urlParams, isNewWindow, useSsl);
	}
});
