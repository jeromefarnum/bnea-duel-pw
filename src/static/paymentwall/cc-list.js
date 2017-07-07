;(function(){
    'use strict';

    var ccListAction = ccListAction || {};

    ccListAction.addEventListeners = function() {
        document.getElementById('acc_cards').addEventListener('click', function (e) {
            e.preventDefault();
            ccList.showCCListModal();
            account.accountToggle();
        });
    };


    /**
     * constructor
     */
    (function constructor() {
        ccListAction.addEventListeners();
    })();

})();

