function showSecureForm(lookupData) {
	var html;
	if (typeof formContainer3ds != 'undefined') {
		formContainer = formContainer3ds;
	}
	if (lookupData.fullHTML) {
		html = lookupData.fullHTML;
		$(formContainer).update(html);
		secureForm = document.getElementsByName('run3dsForm')[0];
		secureForm.submit();
	} else {
		html = '<form id="secureForm" action="' + lookupData.actionURL + '" method="POST" ';
		if (secureNewWindow) {
			html += 'target="blank" style="text-align: center;"';
		}
		html += '>';
		html += '<input type="hidden" name="PaReq" value="' + lookupData.paymentRequest + '">';
		html += '<input type="hidden" name="MD" value="' + lookupData.refId + '">';
		html += '<input type="hidden" name="TermUrl" value="' + lookupData.returnURL + '">';
		if (secureNewWindow) {
			html += '<button type="submit" id="secure_proceed" class="button">' + proceedTitle + '</button>';
		}
		html += '</form>';

		if (secureNewWindow) {
			$(formContainer).update(html);
			$('secure_proceed').observe('click', function (event) {
				event.preventDefault();
				$('secureForm').submit();
				var message = '<div style="text-align: center;"><p>' + newWindowMessage + '</p></div>';
				$(formContainer).update(message);
			});
		} else {
			$(formContainer).insert(html);
			$('secureForm').submit();
		}
	}
	enableForm = false;
}
