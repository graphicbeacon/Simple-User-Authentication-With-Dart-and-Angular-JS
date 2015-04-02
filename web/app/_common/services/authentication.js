(function() {

    function AuthenticationService(Q, Http, Location) {

        var authUrls, setAuthToken, getAuthToken, login, logout, validateToken;

        authUrls = {
            login: '/auth/login',
            logout: '/auth/logout',
            validToken: '/auth/token'
        };

        setAuthToken = function(token) {
            localStorage.setItem('SimpleAppAuthToken', token);
        };

        login = function(form, userCredentials) {

            var deferred = Q.defer();

            Http.post(authUrls.login, userCredentials)
                .then(function(response, status, headers) {

                    var authToken = response.data;

                    console.log(response);

                    // Store token locally
                    setAuthToken(authToken);

                    deferred.resolve(authToken);

                    // Redirect to homepage
                    Location.path('/');

                    // Reset form to pristine state
                    form.$setPristine();
                    form.problemLogin = false;
                },
                function(error) {

                    deferred.reject(error);

                    form.$setPristine();
                    form.problemLogin = true;
                });

            return deferred.promise;
        };

        getAuthToken = function() {
            return localStorage.getItem('SimpleAppAuthToken');
        };

        validateToken = function() {
            var deferred = Q.defer();

            Http.post(authUrls.validToken, this.getAuthToken())
                .then(function() {
                    deferred.resolve({ validToken: true });
                },
                function(error) {
                    deferred.reject({ validToken: false });
                });

            return deferred.promise;
        };

        logout = function(username) {
            // TODO: Implement logout service
        };

        return {
            login: login,
            logout: logout,
            getAuthToken: getAuthToken,
            validateToken: validateToken
        }
    }

    AuthenticationService.$inject = ['$q', '$http','$location'];

    angular.module('simpleApp')
        .factory('AuthenticationService', AuthenticationService);

})();