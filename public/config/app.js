var productBidApp = angular.module( 'productBidApp', ['productBidAppFactory']);
var bidders = [
	{
		id: 1,
		label: 'Zero Cool',
		value: 'Zero Cool',
		bidCredits : 15,
		productBids : []
	}, 
	{
		id: 2,
		label: 'Crash Override',
		value: 'Crash Override',
		bidCredits : 15,
		productBids : []
	},
	{
		id: 3,
		label: 'Acid Burn',
		value: 'Acid Burn',
		bidCredits : 15,
		productBids : []
	}, 
	{
		id: 4,
		label: 'The Plague',
		value: 'The Plague',
		bidCredits : 15,
		productBids : []
	}	
];
var notification = angular.element( document.querySelector( '.notificationHolder' ) );	
productBidApp.controller('productList', [ '$scope', 'productBidAppFactory',  function ( $scope, productBidAppFactory ) {
	var cellCtr = 1;
	var products = [];
	var initialPrice = 10;
	productBidAppFactory.getProducts().then( function successCallback ( response ) {
		angular.forEach( response.data.items , function( v ) {
			products.push({
				cellCtr : cellCtr++,
				productName : v.full_name,
				price : initialPrice.toFixed(2),
				userNames : '' ,
				ctr : $scope.ctr
			});
		});    			
	});
	$scope.products = products;
	$scope.productName = '';
}]);
productBidApp.controller('overlay', [ '$scope',  function ( $scope ) {
	$scope.bidders = '';
	$scope.bidder = '';
}]);
productBidApp.directive( 'productTimer', function() {
	return {
		link : function ( scope,element,attr ) {
			function initializeTimer() {
				var ctr = 30;
				element.text( ctr );
				var productTimer = setInterval( function() {
					ctr = ctr - 1;
					if ( ctr === 0 ) {
						clearInterval( productTimer );
						element.parent().next().find('button').addClass( 'closed' );
						element.parent().next().find('button').html( 'Closed' );
						element.parent().next().find('button').attr( 'disabled', true );
					}
					element.text( ctr );
				}, 1000 );
			}
			initializeTimer();
		}
	}
});
productBidApp.directive( 'bidBtn', function() {
	return {
		link : function ( scope,element,attr ) {
			angular.forEach( element, function( value, key ){
				var thisBtn = angular.element( value );
				if ( element.hasClass( 'closed' ) ) {

				} else {
					thisBtn.on( 'click', function() {
						angular.element( document.querySelector('.overlay') ).removeClass('hidden');
						var selectedRow = element.parent().parent();
						selectedRow.addClass( 'selectedRow' );		
						//console.log( scope.products );									
					} );
				}
			});		
		}
	}	
} );
productBidApp.directive( 'submitBidBtn', function() {
	return {
		link : function ( scope,element,attr ) {			
			element.on( 'click', function() {
				var bidderCtr = angular.element( document.querySelector( 'select.bidders' ) ).children().length;		
				var selectedWinner = angular.element( document.querySelector( '.selectedRow .productWinner' ) );
				var bidPrice = angular.element( document.querySelector( '.selectedRow .productPrice' ) );
				var productTimerText = angular.element( document.querySelector( '.selectedRow .productTimer' ) );
				var productBidBtn = angular.element( document.querySelector( '.selectedRow button' ) );
				var productName = angular.element( document.querySelector( '.selectedRow input.productName' ) ).val();		
				var bid = parseFloat( bidPrice.text() ) + 0.01;
				var selectedBidder = scope.bidders;		
				var bidCredits = 0;
				var productBids = '';	
				if ( bidderCtr === 1 ) {
						notification.text( 'No bidders available.' );
				} else {
					angular.forEach( bidders, function(v,k) {							
							if ( bidders[ k ].bidCredits === 0 && bidders[ k ].value == selectedBidder ) {
								notification.text( selectedBidder + ' has no bid credits left.' );	
								return true;					
							} else {	
								if ( selectedBidder == v.value ) {														
									bidders[k].productBids.push( productName );	
									productBids = bidders[k].productBids;		
									var sortArray = bidders[k].productBids.slice().sort();
									var arrayResults = [];
									for ( var i = 0; i < bidders[k].productBids.length - 1; i++) {
									    if ( sortArray[i + 2] == sortArray[i] ) {
									        arrayResults.push( sortArray[i] );
									    }
									}	
									if ( arrayResults.length > 0 ) {
										notification.text('You already exceeded the maximum bid for this product.');	
										return true;
									} else {
										bidders[k].bidCredits = bidders[k].bidCredits - 1;
										bidCredits = bidders[k].bidCredits;
										selectedWinner.text( selectedBidder );	
										bidPrice.text( bid.toFixed(2) );	
										productTimerText.text( 30 );				
										var bidTimer = setInterval( function() {
											var bidCtr = parseInt( productTimerText.text() );
											bidCtr -= 1;
											if ( bidCtr === 0 ) {
												clearInterval( bidTimer );
												productBidBtn.addClass( 'closed' );
												productBidBtn.html( 'Closed' );
												productBidBtn.attr( 'disabled', true );
											}
											productTimerText.text( bidCtr );
											//console.log( bidCtr );  		
										}, 1000 );																
										angular.element( document.querySelector( '.selectedRow' ) ).removeClass( 'selectedRow' );	
										angular.element( document.querySelector('.overlay') ).addClass('hidden');	
										angular.element( document.querySelector( 'select.bidders' ) ).val('');	
										notification.text('');																															
									}
									//console.log( arrayResults );																																					
								} 																													
							}
					} );
				}									
			});
		}
	}	
} );
productBidApp.directive( 'cancelBidBtn', function() {
	return {
		link : function ( scope,element,attr ) {	
			element.on( 'click', function() {
				angular.element( document.querySelector('.overlay') ).addClass('hidden');
				angular.element( document.querySelector( 'select.bidders' ) ).val('');		
				notification.text('');	
			});
		}
	}	
} );
