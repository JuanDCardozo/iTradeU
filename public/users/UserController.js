(function(){

  angular
       .module('users')
       .controller('UserController', [
          '$http', '$mdSidenav', '$mdBottomSheet', '$timeout', '$log',
          UserController
       ]);


  /**
   * Main Controller for the Angular Material Starter App
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function UserController($http, $mdSidenav, $mdBottomSheet, $timeout, $log ) {
    var self = this;

    self.selected     = null;
    self.users        = [ ];
    self.selectUser   = selectUser;
    self.toggleList   = toggleUsersList;
    self.makeContact  = makeContact;

    // Load all registered users
    $http.get('/items'). success(function(data, status, headers, config) {
       self.users    = data.items;
       self.selected = data.items[0];
       console.log(data);
       console.log(self.users);
       console.log(self.selected);
     });


    // *********************************
    // Internal methods
    // *********************************

    /**
     * Hide or Show the 'left' sideNav area
     */
    function toggleUsersList() {
      $mdSidenav('left').toggle();
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectUser ( user ) {
      console.log(user);
        $http.post('/match',user). success(function(data){
          console.log(data);
          self.selected = data.items;
        });
      //self.selected = angular.isNumber(user) ? self.users.items[user] : user;
    }

    /**
     * Show the Contact view in the bottom sheet
     */
    function makeContact(selectedUser) {

        $mdBottomSheet.show({
          controllerAs  : "vm",
          templateUrl   : 'public/users/contactSheet.html',
          controller    : [ '$mdBottomSheet', ContactSheetController],
          parent        : angular.element(document.getElementById('content'))
        }).then(function(clickedItem) {
          $log.debug( clickedItem.name + ' clicked!');
        });

        /**
         * User ContactSheet controller
         */
        function ContactSheetController( $mdBottomSheet ) {
          this.user = selectedUser;
          this.items = [
            { name: 'Phone'       , icon: 'phone'       , icon_url: 'public/assets/svg/phone.svg'},
            { name: 'Twitter'     , icon: 'twitter'     , icon_url: 'public/assets/svg/twitter.svg'},
            { name: 'Google+'     , icon: 'google_plus' , icon_url: 'public/assets/svg/google_plus.svg'},
            { name: 'Hangout'     , icon: 'hangouts'    , icon_url: 'public/assets/svg/hangouts.svg'}
          ];
          this.contactUser = function(action) {
            // The actually contact process has not been implemented...
            // so just hide the bottomSheet

            $mdBottomSheet.hide(action);
          };
        }
    }

  }

})();