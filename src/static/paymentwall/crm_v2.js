;(function(){
	'use strict';

	var ControllersUrl = window.ControllersUrl || 'https://api.paymentwall.com/api/';
	var UrlParams = window.UrlParams || '';
	var Standalone = window.crm_in_new_window || false;
	var timeout = null;
	var cache = {};

	var CRM = Class.create({
		STAGE_BLANK: 'blank',
		STAGE_INIT: 'init',
		STAGE_MISSING_GOODS: 'missing_goods',
		STAGE_MISSING_PAYMENT: 'missing_payment',
		STAGE_BLOCKED_TRANSACTION: 'blocked_transaction',
		STAGE_BLOCKED_PS: 'blocked_ps',
		STAGE_NEW_PAYMENT_OPTION_REQUEST: 'new_payment_option_request',
		STAGE_OTHER_PROBLEM: 'other_problem',
		STAGE_OTHER_PROBLEM_CHECK: 'other_problem_check',
		STAGE_THANK_YOU: 'thank_you',
		STAGE_TICKETS_LIST: 'tickets_list',
		STAGE_TICKET_DETAILS: 'ticket_details',
		STAGE_FAILED_PINGBACK: 'failed_pingback',
		STAGE_RISK_VERIFICATION: 'risk_verification',
		STAGE_CC_BUSINESS: 'cc_business',
		STAGE_RISK_UPLOAD: 'risk_upload',
		//STAGE_RISK_VERIFIED: 'risk_verified',
		STAGE_RISK_DECLINED: 'risk_declined',
		STAGE_RISK_NOT_APPROVED: 'risk_not_approved',
		STAGE_RECURRING_PAYMENTS: 'recurring_payments',
		STAGE_UKASH_RISK_UPLOAD: 'ukash_risk_upload',
		STAGE_CC_LIST: 'cc_list',

		stage: undefined,
		stagesHistory: [],

		initialize: function(helpButtonSelector) {
			this.helpButtonSelector = helpButtonSelector;
			this.help = $$(this.helpButtonSelector);
			this.root = $('crm-root');
			this.fade = $('crm-fade');
			this.spinner = $('crm-spinner');

			if (window.addEventListener) {
				window.addEventListener('resize', this.positionModal.bind(this));
			} else if (window.attachEvent) {
				window.attachEvent('onresize', this.positionModal.bind(this));
			}

			this.help.each(function(h) {
				h.stopObserving('click');
				var childElements = h.select('*');
				if (childElements) {
					h.select('*').each(function(element){
						element.stopObserving('click');
					});
				}
			});

			this.setupObservers();
		}
	});

	CRM.prototype.setupObservers = function() {
		var self = this;

		document.observe('click', this.handleClickHelp.bind(this));
		document.observe('click', this.handleClicks.bind(this));

		this.root.observe('crm:toggle-spinner', function(event) {
			self.toggleSpinner(event.memo.toggle);
		});

		this.root.observe('crm:show', function(event) {
			self.showStage(event.memo.stage, event.memo.params || {});
		});

		this.root.observe('crm:hide', function(event) {
			self.hideModal();
		})
	};

	CRM.prototype.setupStage = function(stage, params) {
		var self = this,
			data = params,

			fetchData = function(url, ajaxParams) {
				new Ajax.Request(ControllersUrl + url, _.extend(defaultParams, ajaxParams));
			},

			fetchDataList = function(url) {
				if (!data.list) {
					new Ajax.Request(ControllersUrl + url, defaultParams);
				} else {
					callRenderStage({responseJSON: data});
					toggleSpinner();
				}
			},

			callRenderStage = function(response) {
				data = response.responseJSON;
				self.renderStage(stage, params, data);
			},

			toggleSpinner = function() {
				$('crm-root').fire('crm:toggle-spinner', {toggle: false});
			},

			requireCache = function(callback) {
				if (cache.ready) {
					toggleSpinner();
					if (typeof callback == 'function') {
						callback.call(self);
					} else {
						self.renderStage(stage, params, data);
					}
				} else {
					fetchData('crm/init', {
						onSuccess: function(response) {
							data = response.responseJSON;
							cache = {
								ready: true,
								blocked_transaction: data.blocked_transaction,
								account_id: data.account_id,
								email: data.email,
								email_confirmed: data.email_confirmed,
								opened_tickets: data.opened_tickets,
								opened_risk_tickets: data.opened_risk_tickets,
								tickets: data.tickets,
								has_active_recurring_payments: data.has_active_recurring_payments
							};

							if (typeof callback == 'function') {
								callback.call(self);
							}

							callRenderStage(response);
						}
					});
				}
			},

			defaultParams = {
				parameters: UrlParams,
				onSuccess: callRenderStage,
				onComplete: toggleSpinner
			},

			preparators = {
				// do some ajax-requests to fetch additional data etc.
				init: function() {
					requireCache();
				},

				blocked_transaction: function(params) {
					requireCache(function() {
							data.blocked_transaction = cache.blocked_transaction;

							if (typeof cache.blocked_transaction['ticket'] != 'undefined') {
								self.showStage(self.STAGE_TICKET_DETAILS, {ticket: cache.blocked_transaction['ticket'].id});
							} else {
								self.renderStage(stage, params, data);
							}
						}
					);
				},

				blocked_ps: function(params) {
					requireCache(function() {
							var hidden = $('crm-blocked_ps-ps_id');
							data.ps_id = hidden ? hidden.value : 0;
							self.renderStage(stage, params, data);
						}
					);
				},

				tickets_list: function() {
					fetchDataList('crm/inquiries');
				},

				ticket_details: function(params) {
					if (data['ticket']) {
						new Ajax.Request(ControllersUrl + 'crm/inquiry', _.extend(defaultParams, {
							method: 'get',
							parameters: UrlParams + '&ticket=' + data['ticket'],
							onSuccess: function(response) {
								data = response.responseJSON;

								if (typeof params.transaction != 'undefined') {
									data.transaction = params.transaction;
								}

								self.renderStage(stage, params, data);
							}
						}));
					}
				},

				missing_goods: function() {
					fetchDataList('crm/missing-goods');
				},

				cc_business: function (params) {
					this.renderStage(stage, params, data);
				},

				cc_list_load: function (params) {
					this.renderStage(stage, params, data);
				},

				cc_list: function (params) {
					ccList.fetchData(function(data) {
						self.renderStage(stage, params, data);
					});
				},

				risk_verification: function(params) {
					requireCache(function() {
						data.queue_len = params.queue_len || 1;
						data.avg_processing_time = params.avg_processing_time || 0;
						data.step = params.step || 1;
						self.renderStage(stage, params, data);
					});
				},

				risk_upload: function(params) {
					requireCache(function() {
							data.blocked_transaction = cache.blocked_transaction;
							self.renderStage(stage, params, data);
						}
					);
				},

				ukash_risk_upload: function(params) {
					requireCache(function() {
						self.renderStage(stage, params, data);
					});
				},

				recurring_payments: function() {
					fetchDataList('crm/recurring-payments');
				}
			};

		if (stage in preparators) {
			this.toggleSpinner(true);
			preparators[stage].call(this, params);
		} else {
			callRenderStage({responseJSON: data});
			toggleSpinner();
		}
	};

	CRM.prototype.beforeRenderStage = function(stage, params, data) {
		var self = this,

			checkers = {
				// do some custom logic here. Return true to render current stage.
				blocked_transaction: function(params, data) {
					return !!cache.blocked_transaction;
				},

				blocked_ps: function(params, data) {
					if (cache.opened_risk_tickets.length > 0) {
						this.showStage(this.STAGE_OTHER_PROBLEM_CHECK);
					}
					return !cache.opened_risk_tickets.length;
				},

				other_problem_check: function(params, data) {
					if (cache.opened_tickets.length == 0) {
						this.showStage(this.STAGE_OTHER_PROBLEM);
					}
					return !!cache.opened_tickets.length;
				},

				missing_goods: function(params, data) {
					if (data['total_count'] == 0) {
						this.showStage(this.STAGE_MISSING_PAYMENT);
					}
					return (data['total_count'] > 0);
				}
			};

		if (stage in checkers) {
			return checkers[stage].call(this, params, data);
		}

		return true;
	};

	CRM.prototype.afterRenderStage = function(stage, params, data) {
		var self = this,

			checkers = {
				// do some custom logic here.

				blank: function(params) {
					self.showStage(self[params.stage] || self.STAGE_INIT, params);
				},

				init: function() {
					if (!cache.blocked_transaction) {
						$('crm-blocked-transaction-item').hide();
					}
					if (cache.tickets.length == 0) {
						$('crm-init-previous_inquiries-container').hide();
					}
					if (!cache.has_active_recurring_payments) {
						$('crm-recurring-payments-item').hide();
					}
				},

				blocked_transaction: function() {
					self.toggleEmailInput('crm-blocked_transaction-email');
				},

				blocked_ps: function() {
					self.toggleEmailInput('crm-blocked_ps-email');
				},

				new_payment_option_request: function() {
					self.toggleEmailInput('crm-new_payment_option_request-email');
				},

				ticket_details: function(params) {
					var chat = $('crm-chat-body');
					chat.scrollTop = chat.scrollHeight;

					timeout = window.setTimeout( function() {
						var message = $('crm-message-text');
						var attachment = $('crm-ticket_details-attachment');

						if (!message || !attachment) {
							return;
						}

						if (message.getValue() == '' && attachment.value == '') {
							self.showStage(self.STAGE_TICKET_DETAILS, {ticket: params.ticket});
						}
					}, 60000);
				},

				missing_payment: function() {
					self.toggleEmailInput('crm-missing_payment-user-email');

					if (this.stage == this.STAGE_MISSING_GOODS) {
						$('crm-missing_payment-no-payments').hide();
						$('crm-missing_payment-send-receipt').show();
					} else if (this.stage == this.STAGE_INIT) {
						$('crm-missing_payment-no-payments').show();
						$('crm-missing_payment-send-receipt').hide();
					}
				},

				other_problem: function(params, data) {
					if (typeof data['problem'] != 'undefined' && data['problem'] == 'not_receive_vc') {
						$('crm-other_problem-title-basic').hide();
						$('crm-other_problem-title-missing-good').show();
					}

					self.toggleEmailInput('crm-other_problem-email');
				},

				risk_verification: function(params) {
					$('crm-risk_verification-progress').style.width = '' + params.progress + '%';

					var step1 = (typeof params['step'] == 'undefined' || params['step'] == 1);

					$$('#crm-root .step-1').each(function(el) {
						el.toggle(step1);
					});
					$$('#crm-root .step-2').each(function(el) {
						el.toggle(!step1);
					});
				},

				risk_upload: function() {
					self.toggleEmailInput('crm-risk_upload-email');
				},

				ukash_risk_upload: function() {
					var UKASH_PAYMENT_SYSTEM_ID = 35;
					$('crm-ukash_risk_upload-ps-id').setValue(UKASH_PAYMENT_SYSTEM_ID);
					self.toggleEmailInput('crm-ukash_risk_upload-email');
				}
			};

		if (stage in checkers) {
			return checkers[stage].call(this, params, data);
		}

		return true;
	};

	CRM.prototype.showStage = function(stage, params) {
		window.clearTimeout(timeout);
		var contentContainer = this.getContentContainer(stage);
		params = params || {};

		if (!!contentContainer) {
			this.setupStage(stage, params);
		}

		this.toggleFade(true);

		if (!cache.ready) {
			this.toggleSpinner(true);
		}
	};

	CRM.prototype.renderStage = function(stage, params, data) {
		var contentContainer = this.getContentContainer(stage);
		var content = contentContainer.innerHTML;
		var template = _.template(content);

		if (this.beforeRenderStage(stage, params, data)) {
			this.root.update(template(data));

			this.afterRenderStage(stage, params, data);

			this.stage = stage;
			this.stagesHistory.push({stage: stage, params: params});

			this.positionModal();
			this.toggleSpinner(false);
		}
	};

	CRM.prototype.getContentContainer = function(stage) {
		return $('crm-stage-' + stage);
	};

	CRM.prototype.handleClickHelp = function(event) {
		var target = event.findElement(this.helpButtonSelector);
		if (!target) {
			return;
		}

		event.stop();

		var params = {
				stage: target.readAttribute('data-stage')
			},
			dataParams;

		if (dataParams = target.readAttribute('data-params')) {
			params = _.extend(params, JSON.parse(dataParams));
		}

		if (Standalone) {
			window.open(ControllersUrl + 'account/help?' + UrlParams);
		} else {
			this.showStage(this.STAGE_BLANK, params);
			this.toggleFade(true);

			if (!cache.ready) {
				this.toggleSpinner(true);
			}
		}
	};

	CRM.prototype.handleClicks = function(event) {
		var self = this;

		// close modal
		if (event.findElement('.crm-close-modal')) {
			event.stop();
			this.hideModal();
		}

		// file inputs
		document.observe('click', function(event) {
			var target;
			if (target = event.findElement('.custom-file-input .btn-close')) {
				target.up().select('input[type="file"]').first().value = '';
				target.up().select('.filename').first().innerHTML = '';
				target.hide();
			}
		});

		// navigation (prev / next)
		var setStageLink = event.findElement('.crm-set-stage');
		if (setStageLink) {
			event.stop();
			var stage = setStageLink.readAttribute('data-stage');
			var rel = setStageLink.readAttribute('rel');
			var params = {};
			var paramsJSON = setStageLink.readAttribute('data-params');
			if (paramsJSON) {
				params = JSON.parse(paramsJSON);
			}
			if (stage && rel == 'next' && stage in this) {
				this.showStage(this[stage], params);
			} else if (rel == 'prev' && this.stagesHistory.length > 1) {
				this.stagesHistory.pop(); // pop current stage
				var data = this.stagesHistory.pop();
				this.showStage(data.stage, data.params);
			}
		}

		// pagination
		var paginationLink = event.findElement('.crm-pagination-links');
		if (paginationLink) {
			event.stop();
			new Ajax.Request(paginationLink.href, {
				method: 'get',
				onCreate: function() {
					self.toggleSpinner(true);
				},
				onSuccess: function(response) {
					var stage = paginationLink.readAttribute('data-stage');
					self.showStage(stage, response.responseJSON);
				}
			});
		}
	};

	CRM.prototype.hideModal = function() {
		this.root.update('');
		this.stage = undefined;
		this.stagesHistory = [];
		this.toggleFade(false);
		cache = {};
	};

	CRM.prototype.positionModal = function() {
		var w = window,
			d = document,
			e = d.documentElement,
			g = d.getElementsByTagName('body')[0],

			x = w.innerWidth  || e.clientWidth  || g.clientWidth,
			y = w.innerHeight || e.clientHeight || g.clientHeight,

			elx = this.root.offsetWidth,
			ely = this.root.offsetHeight,

			top =  (y - ely) / 2,
			left = (x - elx) / 2,
			style = {};

		if (x > elx && y > ely) {
			style = {
				top: top + 'px',
				left: left + 'px'
			};
		} else if (x < elx && y > ely) {
			style = {
				top: top + 'px',
				left: 20 + 'px'
			};
		} else if (x > elx && y < ely) {
			style = {
				top: 20 + 'px',
				left: left + 'px'
			};
		} else if (x < elx && y < ely) {
			style = {
				top: 20 + 'px',
				left: 20 + 'px'
			};
		}

		this.root.setStyle(style);
		this.spinner.setStyle(style);
	};

	CRM.prototype.toggleFade = function(toggle) {
		toggle = (typeof toggle != 'undefined') ? toggle : true;
		this.fade.toggle(toggle);
	};

	CRM.prototype.toggleSpinner = function(toggle) {
		this.spinner.setStyle({
			top: this.root.getStyle('top'),
			left: this.root.getStyle('left'),
			width: this.root.getStyle('width'),
			height: this.root.getStyle('height')
		});

		this.spinner.toggle(toggle);

		$('crm-spinner-content').setStyle({
			marginTop: '' + (Math.floor(parseInt(this.spinner.getStyle('height')) / 2) - 24) + 'px'
		});
	};

	CRM.prototype.toggleEmailInput = function(id) {
		var email = $(id);
		var container = $(id + '-container');

		email.value = !!cache.email ? cache.email : '';
		container.toggle(!(cache.email && cache.email_confirmed));
	};

	var ie = (function() {
		var v = 5, div = document.createElement('div');

		while(
			div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
			div.getElementsByTagName('i')[0]
		);

		return (v > 6) ? v : undefined;
	}());

	// this flow is only enabled for newer IE (and other browsers)
	if (!ie || ie > 7) {
		document.observe('dom:loaded', function() {
			new CRM(window.crmFlowHelpButtonSelector ? window.crmFlowHelpButtonSelector : '.crm-help-button');

			window.ccBusinessCheck.start();
 		});
	}

	/**
	 *
	 * @type {CRMWindow}
     */
	window.CRMWindow = new function () {

		/**
		 *
		 * @type {CRMWindow}
         * @private
         */
		var _this = this;

		/**
		 *
		 * @type {string}
		 */
		_this.rootSelector = 'crm-root';

		/**
		 * show form loader
		 */
		_this.showLoader = function () {
			$(_this.rootSelector).fire('crm:toggle-spinner', {toggle: true});
		};

		/**
		 * hide form loader
		 */
		_this.hideLoader = function () {
			$(_this.rootSelector).fire('crm:toggle-spinner', {toggle: false});
		};

		/**
		 * open modal window
		 *
		 * @param stage
         */
		_this.showModal = function (stage) {
			$(_this.rootSelector).fire('crm:show', {stage: stage});
		};

		/**
		 * close modal window
		 */
		_this.hideModal = function () {
			$(_this.rootSelector).fire('crm:hide');
		};

	};

	/**
	 *
	 * @type {ccBusinessCheck}
     */
	window.ccBusinessCheck = new function () {

		var _this = this;
		/**
		 *
		 * @type {string}
		 */
		_this.binNum = 6;
		/**
		 *
		 * @type {number}
		 */
		_this.fullNum = 16;
		/**
		 *
		 * @type {number}
		 */
		_this.lastNum = 4;

		/**
		 * 
		 * @type {string}
         */
		_this.url = 'cc-business-checker';

		/**
		 *
		 * @type {string}
         */
		_this.urCheck = 'cc-business-checker/check-ccbin';

		/**
		 *
		 * @type {string}
         */
		_this.closeButtonSelector = 'close-cc_business-window';
		/**
		 *
		 * @type {string}
         */
		_this.formSelector = 'cc_business-form';
		/**
		 *
		 * @type {string}
         */
		_this.errorContainerSelector = 'ps-option-request-errors';

		/**
		 * 
		 * @returns {ccBusinessCheck}
         */
		_this.start = function () {
			return _this;
		};
 
		/**
		 * Bind all necessary event listeners
		 */
		_this.addEventListeners = function () {
			document.getElementById(_this.closeButtonSelector).addEventListener("click", function(){
				_this.hideModal();
			});
			
			document.getElementById(_this.formSelector).addEventListener("submit", function(e){
				e.preventDefault();
				_this.submitForm();
			});
			
			return _this;
		};

		/**
		 *	Bin number
		 * @type {string}
         */
		_this.ccBin = '';

		/**
		 *
		 * @type {string}
         */
		_this.lastCc = '';

		/**
		 * check if need verification cc business
		 * @param input
		 * @param callback
         */
		_this.checkCardBin = function (input, callback) {

			if (input.value === undefined || input.value === null || input.value === '') {
				callback(false);
				return;
			}
			
			var clearNum = input.value.replace(/\s/g, '');

			_this.ccBin = clearNum.substring(0, _this.binNum);
			_this.lastCc = clearNum.substring(clearNum.length - _this.lastNum);

			if (clearNum.length < _this.fullNum || this.ccBin.length < _this.binNum || _this.lastCc.length < _this.lastNum) {
				callback(false);
				return;
			}

			new Ajax.Request(ControllersUrl + _this.urCheck, {
				method: 'get',
				parameters: UrlParams + '&ccBin=' + _this.ccBin + '&ccLast=' + _this.lastCc,
				onComplete: function(response) {
					var data = response.responseJSON;
					if (data.success === true && data.message.needsVerification === true) {
						callback(true);
						return;
					}
					callback(false);
				}
			});
		};

		_this.callbackForm = function () {

		};

		/**
		 * submit form with business details
		 */
		_this.submitForm = function () {

			$(_this.errorContainerSelector).hide();
			new Ajax.Request(ControllersUrl + _this.url + "?" + UrlParams + '&ccBin=' + _this.ccBin + '&ccLast=' + _this.lastCc, {
				method: 'post',
				parameters: $(_this.formSelector).serialize(),
				onCreate: function() {
					CRMWindow.showLoader();
				},
				onComplete: function(response) {
					CRMWindow.hideLoader();
					var data = response.responseJSON;

					if (data.success === true) {
						_this.callbackForm(true);
						return;
					}

					Object.keys(data.errors).forEach(function (key) {
						$(_this.errorContainerSelector).update(data.errors[key]);
					});

 					$(_this.errorContainerSelector).show();
					_this.callbackForm(false);
				}
			});
		};

		/**
		 * open modal window
		 */
		_this.showModal = function (callback) {
			CRMWindow.showModal('cc_business');
			CRMWindow.hideLoader();
			_this.callbackForm = callback;
			_this.addEventListeners();
		};

		/**
		 * close modal window
		 */
		_this.hideModal = function () {
			CRMWindow.hideModal();
		};

		/**
		 * constructor
		 */
		(function constructor() {

		})();
	};

	/**
	 *
	 * @type {ccBusinessCheck}
	 */
	window.ccList = new function () {

		var _this = this;
 
		/**
		 * open modal cc list window
		 */
		_this.showCCListModal = function () {
 			CRMWindow.showModal('cc_list_load');
 			CRMWindow.showModal('cc_list');
		}; //

		/**
		 * Bind all necessary event listeners
		 */
		_this.addEventListeners = function () {

			var className = document.getElementsByClassName("cc-delete-js");
			for (var i = 0; i < className.length; i++) {
				className[i].addEventListener("click", _this.deleteCC, false);
			}
		};

		_this.deleteCC = function (e) {
			var deleteInProcess = false;
			var cardId = e.target.getAttribute("data-id");

			if (!confirm("Are you sure you want to delete this card?") || deleteInProcess)
				return;

			deleteInProcess = true;

			new Ajax.Request(ControllersUrl + 'account/delete-card', {
				method: 'POST',
				parameters: UrlParams +  '&cardId=' + cardId,
				onCreate: function() {
					CRMWindow.showLoader();
				},
				onSuccess: function (t) {
					CRMWindow.hideLoader();
					try {
						var data = t.responseText.evalJSON();
					}
					catch (e) {
					}

					if (!data.error) {
						$('card_' + cardId).remove();
						if ($$('#card_table tr[id^=card_]').length == 0) {
							$('card_table').hide();
							$('empty_card_list').show();
						}
					}

					deleteInProcess = false;
				}
			});
		};

		/**
		 *
		 * @param callback
         */
		_this.fetchData = function(callback) {
			new Ajax.Request(ControllersUrl + 'account/cards-list', {
				method: 'get',
				parameters: UrlParams,
				onCreate: function() {
					CRMWindow.showLoader();
				},
				onComplete: function(response) {
					CRMWindow.hideLoader();

					var data = response.responseJSON;
					callback(data);

					_this.addEventListeners();
				}
			});
		};

		/**
		 * constructor
		 */
		(function constructor() {

		})();
	};

}());
