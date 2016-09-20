var productBidAppFactory = angular.module( 'productBidAppFactory', [] );
productBidAppFactory.factory( 'productBidAppFactory',  function ( $http ) {
	return {
		getProducts : function() {
			return $http.get( 'https://api.github.com/search/repositories?q=products' );
		},										
	}
});