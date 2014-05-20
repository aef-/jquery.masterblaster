describe("FilthyPillow", function() {
  var $mb1, $mb2, $mb3, $mb4, $mb5, $document,
      keys = {
        TAB: 9,
        ENTER: 13,
        CHAR_A: 65
      };

  var TAGS = [ "tag1", "tag2", "te", "reallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallyreallybigtag", "120321", "234234234234234234234234" ];

  function keySim( $element, keyCode, shiftKey ) {
    triggerKey( $element, "keydown", keyCode, shiftKey );
    triggerKey( $element, "keypress", keyCode, shiftKey );
    triggerKey( $element, "keyup", keyCode, shiftKey );
  };
  function triggerKey( $element, type, keyCode, shiftKey ) {
    var e = $.Event( type );
    e.which = keyCode;
    e.shiftKey = shiftKey;
    $element.trigger( e );
  }

  beforeEach(function() {
    setFixtures(
      '<input class="masterblaster-1"/>' +
      '<input class="masterblaster-2"/>' +
      '<input class="masterblaster-3"/>' +
      '<input class="masterblaster-4"/>' +
      '<input class="masterblaster-5"/>'
    );
    $document = $( document );

    $mb1 = $( ".masterblaster-1" );
    $mb1.masterblaster( {
      showAddButton: true,
      animate: false,  //necessary otherwise tests may fail due to race condition of animate function
      validateOnChange: true,
      tagRules: {
        unique: true,
        minLength: 3
      }
    } );
    $mb2 = $( ".masterblaster-2" );
    $mb2.masterblaster( {
      showAddButton: false,
      animate: false,
      tagRules: {
        unique: false,
        minLength: null
      }
    } );
    $mb3 = $( ".masterblaster-3" );
    $mb3.masterblaster( {
      triggerKeys: [ keys.CHAR_A, keys.ENTER ]
    } );

    $mb4 = $( ".masterblaster-4" );  //is never destroyed
    $mb4.masterblaster( {
    } );

    $mb5 = $( ".masterblaster-5" );
    $mb5.masterblaster( {
      tagRules: {
        regexp: /^\d+$/,
        maxLength: 10
      }
    } );
  });

  afterEach(function() {
    $mb1.masterblaster( "destroy" );
    $mb2.masterblaster( "destroy" );
    $mb3.masterblaster( "destroy" );
    $mb5.masterblaster( "destroy" );
  });

  describe( "Behavior", function( ) {
    it("should add on add button click", function() {
      var $input = $mb1.next( ).find( "input" );
      $input.val( TAGS[ 0 ] );
      $mb1.next( ).find( ".mb-add-button" ).click( );
      expect( $mb1 ).toHaveTag( TAGS[ 0 ] );
    });
    it("should remove correct tag on remove tag click", function() {
      var $input = $mb1.next( ).find( "input" );
      $input.val( TAGS[ 0 ] );
      $mb1.next( ).find( ".mb-add-button" ).click( );
      $input.val( TAGS[ 1 ] );
      $mb1.next( ).find( ".mb-add-button" ).click( );

      $mb1.next( ).find( "[data-tag='"+TAGS[ 0 ]+"']" ).find( ".mb-tag-remove" ).click( );
      expect( $mb1 ).not.toHaveTag( TAGS[ 0 ] );
      expect( $mb1 ).toHaveTag( TAGS[ 1 ] );
    });
    it("should show error on when duplicate tags are added when unique is true", function() {
      var $input = $mb1.next( ).find( "input" );
      $input.val( TAGS[ 0 ] );
      $mb1.next( ).find( ".mb-add-button" ).click( );

      $input.val( TAGS[ 0 ] );
      $mb1.next( ).find( ".mb-add-button" ).click( );
      expect( $mb1.next( ) ).toHaveClass( "mb-error" );
    });
    it("should show error on when tag is less than 3 is entered on default config", function() {
      var $input = $mb1.next( ).find( "input" );
      $input.val( TAGS[ 2 ] );
      $mb1.next( ).find( ".mb-add-button" ).click( );
      expect( $mb1.next( ) ).toHaveClass( "mb-error" );
    });
    it("should hide error on when good class is added", function() {
      var $input = $mb1.next( ).find( "input" );
      $input.val( TAGS[ 2 ] );
      $mb1.next( ).find( ".mb-add-button" ).click( );
      expect( $mb1.next( ) ).toHaveClass( "mb-error" );
      $input.val( TAGS[ 1 ] );
      $mb1.next( ).find( ".mb-add-button" ).click( );
      expect( $mb1.next( ) ).not.toHaveClass( "mb-error" );
    });
    it("should trigger event on add through input", function() {
      var spyEvent = spyOnEvent($mb1.selector,'mb:add')
      var $input = $mb1.next( ).find( "input" );
      $input.val( TAGS[ 1 ] );
      $mb1.next( ).find( ".mb-add-button" ).click( );
      expect( spyEvent ).toHaveBeenTriggered( );
    });
    it("should trigger event on add through push", function() {
      var spyEvent = spyOnEvent($mb1.selector,'mb:add')
      $mb1.masterblaster( "push", TAGS[ 0 ] );
      expect( spyEvent ).toHaveBeenTriggered( );
    });

    it("should trigger event on pop", function() {
      var spyEvent = spyOnEvent($mb1.selector,'mb:remove')
      var $input = $mb1.next( ).find( "input" );
      $input.val( TAGS[ 1 ] );
      $mb1.next( ).find( ".mb-add-button" ).click( );
      $mb1.masterblaster( "pop" );
      expect( spyEvent ).toHaveBeenTriggered( );
    });
    it("should trigger event on remove through remove function", function() {
      var spyEvent = spyOnEvent($mb1.selector,'mb:remove')
      var $input = $mb1.next( ).find( "input" );
      $input.val( TAGS[ 1 ] );
      $mb1.next( ).find( ".mb-add-button" ).click( );
      $mb1.masterblaster( "remove", TAGS[ 1 ] );
      expect( spyEvent ).toHaveBeenTriggered( );
    });
    it("should trigger event on remove through click", function() {
      var spyEvent = spyOnEvent($mb1.selector,'mb:remove')
      var $input = $mb1.next( ).find( "input" );
      $input.val( TAGS[ 1 ] );
      $mb1.next( ).find( ".mb-add-button" ).click( );
      $mb1.next( ).find( "[data-tag='"+TAGS[ 1 ]+"']" ).find( ".mb-tag-remove" ).click( );
      expect( spyEvent ).toHaveBeenTriggered( );
    });
    it("should trigger error on duplicate tags when unique is set", function() {
      var spyEvent = spyOnEvent($mb1.selector,'mb:error')
      var $input = $mb1.next( ).find( "input" );
      $input.val( TAGS[ 0 ] );
      $mb1.next( ).find( ".mb-add-button" ).click( );

      $input.val( TAGS[ 0 ] );
      $mb1.next( ).find( ".mb-add-button" ).click( );
      expect( spyEvent ).toHaveBeenTriggered( );
    });
    it("should trigger error on short tag when minLength is set", function() {
      var spyEvent = spyOnEvent($mb1.selector,'mb:error')
      var $input = $mb1.next( ).find( "input" );
      $input.val( TAGS[ 2 ] );
      $mb1.next( ).find( ".mb-add-button" ).click( );
      expect( spyEvent ).toHaveBeenTriggered( );
    });
    it("should trigger error on keyup", function() {
      var spyEvent = spyOnEvent($mb1.selector,'mb:error')
      var $input = $mb1.next( ).find( "input" );
      keySim( $input, keys.CHAR_A );
      expect( spyEvent ).toHaveBeenTriggered( );
    });
  } );

  describe( "Configuration", function( ) {
    it("should show add button", function() {
      expect( $mb1.next( ).find( ".mb-add-button" ) ).toBeVisible( );
    });
    it("should hide add button when showAddButton is set", function() {
      expect( $mb2.next( ).find( ".mb-add-button" ) ).not.toBeVisible( );
    });
    it("should add on A and ENTER but not TAB when triggerKeys is set", function() {
      var $input = $mb3.next( ).find( "input" );
      $input.val( TAGS[ 0 ] );

      keySim( $input, keys.ENTER );

      $input.val( TAGS[ 1 ] );
      keySim( $input, keys.CHAR_A );

      $input.val( TAGS[ 3 ] );
      keySim( $input, keys.TAB );

      expect( $mb3 ).toHaveTag( TAGS[ 0 ] );
      expect( $mb3 ).toHaveTag( TAGS[ 1 ] );
      expect( $mb3 ).not.toHaveTag( TAGS[ 3 ] );
    });
    it("should not have more than one tag when unique is set", function() {
      var $input = $mb1.next( ).find( "input" );
      $input.val( TAGS[ 0 ] );

      keySim( $input, keys.ENTER );

      $input.val( TAGS[ 0 ] );
      keySim( $input, keys.ENTER );

      expect( $mb1 ).toHaveOneTag( TAGS[ 0 ] );
    });
    it("should have more than one tag when unique is not set", function() {
      var $input = $mb2.next( ).find( "input" );
      $input.val( TAGS[ 0 ] );

      keySim( $input, keys.ENTER );

      $input.val( TAGS[ 0 ] );
      keySim( $input, keys.ENTER );

      expect( $mb2 ).toHaveMultipleTags( TAGS[ 0 ] );
    });
    it("should not allow tags that are less than 3 characters of length when minLength is set to 3", function() {
      var $input = $mb1.next( ).find( "input" );
      $input.val( TAGS[ 2 ] );

      keySim( $input, keys.ENTER );

      $input.val( TAGS[ 2 ] );
      keySim( $input, keys.ENTER );

      expect( $mb1 ).not.toHaveTag( TAGS[ 2 ] );
    });
    it("should allow tags of all length when minLength is not set", function() {
      var $input = $mb2.next( ).find( "input" );
      $input.val( TAGS[ 2 ] );

      keySim( $input, keys.ENTER );

      $input.val( TAGS[ 3 ] );
      keySim( $input, keys.ENTER );

      expect( $mb2 ).toHaveTag( TAGS[ 2 ] );
      expect( $mb2 ).toHaveTag( TAGS[ 3 ] );
    });
    it("should not allow tags that are more than 10 characters of length when maxLength is set to 10", function() {
      var $input = $mb5.next( ).find( "input" );
      $input.val( TAGS[ 4 ] );

      keySim( $input, keys.ENTER );

      $input.val( TAGS[ 5 ] );
      keySim( $input, keys.ENTER );

      expect( $mb5 ).toHaveTag( TAGS[ 4 ] );
      expect( $mb5 ).not.toHaveTag( TAGS[ 5 ] );
    });
    it("should allow only digits when regular express is set as rule", function() {
      var $input = $mb5.next( ).find( "input" );
      $input.val( TAGS[ 1 ] );

      keySim( $input, keys.ENTER );

      $input.val( TAGS[ 4 ] );
      keySim( $input, keys.ENTER );

      expect( $mb5 ).not.toHaveTag( TAGS[ 1 ] );
      expect( $mb5 ).toHaveTag( TAGS[ 4 ] );
    });
  } );

  describe( "API", function( ) {
    it("should be able to push tag", function() {
      $mb1.masterblaster( "push", TAGS[ 0 ] );
      expect( $mb1 ).toHaveTag( TAGS[ 0 ] );
    });
    it("should be able to get all tags", function() {
      $mb1.masterblaster( "push", TAGS[ 0 ] );
      expect( $mb1 ).toHaveTag( TAGS[ 0 ] );
      $mb1.masterblaster( "push", TAGS[ 1 ] );
      expect( $mb1 ).toHaveTag( TAGS[ 1 ] );

      var tags = $mb1.masterblaster( "getTags" );
      console.info( tags );
      expect( tags ).toEqual( [ [ TAGS[ 0 ], TAGS[ 1 ] ] ] );

    }); 
    it("should be able to pop tag", function() {
      $mb1.masterblaster( "push", TAGS[ 0 ] );
      expect( $mb1 ).toHaveTag( TAGS[ 0 ] );
      $mb1.masterblaster( "pop" );
      expect( $mb1 ).not.toHaveTag( TAGS[ 0 ] );
    });
    it("should be able to remove tag by name", function() {
      $mb2.masterblaster( "push", TAGS[ 0 ] );
      $mb2.masterblaster( "push", TAGS[ 1 ] );
      $mb2.masterblaster( "push", TAGS[ 2 ] );
      expect( $mb2 ).toHaveTag( TAGS[ 0 ] );
      expect( $mb2 ).toHaveTag( TAGS[ 1 ] );
      expect( $mb2 ).toHaveTag( TAGS[ 2 ] );
      $mb2.masterblaster( "remove", TAGS[ 0 ] );

      expect( $mb2 ).not.toHaveTag( TAGS[ 0 ] );
      expect( $mb2 ).toHaveTag( TAGS[ 1 ] );
      expect( $mb2 ).toHaveTag( TAGS[ 2 ] );
    });
    it("should be able to remove all tags by name", function() {
      $mb2.masterblaster( "push", TAGS[ 0 ] );
      $mb2.masterblaster( "push", TAGS[ 0 ] );
      $mb2.masterblaster( "push", TAGS[ 0 ] );
      $mb2.masterblaster( "push", TAGS[ 0 ] );
      $mb2.masterblaster( "push", TAGS[ 0 ] );
      $mb2.masterblaster( "push", TAGS[ 1 ] );
      $mb2.masterblaster( "push", TAGS[ 2 ] );
      expect( $mb2 ).toHaveMultipleTags( TAGS[ 0 ] );
      expect( $mb2 ).toHaveTag( TAGS[ 1 ] );
      expect( $mb2 ).toHaveTag( TAGS[ 2 ] );
      $mb2.masterblaster( "remove", TAGS[ 0 ] );

      expect( $mb2 ).not.toHaveTag( TAGS[ 0 ] );
      expect( $mb2 ).toHaveTag( TAGS[ 1 ] );
      expect( $mb2 ).toHaveTag( TAGS[ 2 ] );
    });

    it("should be able to remove all tags by name", function() {
      $mb2.masterblaster( "push", TAGS[ 0 ] );
      $mb2.masterblaster( "push", TAGS[ 0 ] );
      $mb2.masterblaster( "push", TAGS[ 0 ] );
      $mb2.masterblaster( "push", TAGS[ 0 ] );
      $mb2.masterblaster( "push", TAGS[ 0 ] );
      $mb2.masterblaster( "push", TAGS[ 1 ] );
      $mb2.masterblaster( "push", TAGS[ 2 ] );
      expect( $mb2 ).toHaveMultipleTags( TAGS[ 0 ] );
      expect( $mb2 ).toHaveTag( TAGS[ 1 ] );
      expect( $mb2 ).toHaveTag( TAGS[ 2 ] );
      $mb2.masterblaster( "remove", TAGS[ 0 ] );

      expect( $mb2 ).not.toHaveTag( TAGS[ 0 ] );
      expect( $mb2 ).toHaveTag( TAGS[ 1 ] );
      expect( $mb2 ).toHaveTag( TAGS[ 2 ] );
    });

    it("should be destroyable", function() {
      $mb4.masterblaster( "destroy" );
      var mb = function( ) {
        $mb4.masterblaster( "push", TAGS[ 0 ]  );
      };
      expect($mb4).toBeVisible( );
      expect($mb4.next( ".mb-container" ) ).not.toBeVisible( );
      expect( mb ).toThrow( );
    });
  } );

  describe( "Hotkeys", function( ) {
    it("should add on TAB and ENTER on default", function() {
      var $input = $mb1.next( ).find( "input" );
      $input.val( TAGS[ 0 ] );

      keySim( $input, keys.ENTER );

      $input.val( TAGS[ 3 ] );
      keySim( $input, keys.TAB );

      expect( $mb1 ).toHaveTag( TAGS[ 0 ] );
      expect( $mb1 ).toHaveTag( TAGS[ 3 ] );
    });
  });

} );

