/* jquery.masterblaster v.1
 * simple tag management
 * by aef
 */
( function( $, window, document, undefined ) {
  var pluginName = "masterblaster",
      defaults = { 
        animate: true,
        onRemove: null,
        onAdd: null,
        onInvalid: null, //tagName, error message
        triggerKeys: [ 9 ], //keycode when entered adds the tag
        tagRules: {
          unique: true,
          minLength: 3
        }
      },
      methods = [ "push", "pop", "remove" ];

  function MasterBlaster( $element, options ) {
    this.options = $.extend( defaults, options );
    this.$container = $( '<div class="mb-container"></div>' );
    this.$tagList = $( '<ul class="mb-taglist"></ul>' );
    this.$oldInput = $element;
    this.$input = $element.clone( );
    this.tag = [ '<li style="opacity:1" data-tag="" class="mb-tag">',
                  '<span class="mb-tag-text"></span>',
                  '<a href="javascript:void( );return;" class="mb-tag-remove"></a>',
                 '</li>' ].join( "" );
    //tagName => elem 
    this.elemCache = { };
    this.tags = [ ];

    this.setup( );
    this.inputEvents( );
  }

  MasterBlaster.prototype.addElem = function( $tag ) {
    if( this.options.animate ) {
      $tag.css( "opacity", 0 );
      $tag.insertBefore( this.$input );
      var width = $tag.css( "width" );
      $tag.css( "width", 0 );
      $tag.animate( {
        width: width
      }, "fast", function( ) {
       $tag.css( "width", "" );
       $tag.animate( { opacity: 1 } ); 
      } );
    }
    else {
      $tag.insertBefore( this.$input );
    }
  };

  MasterBlaster.prototype.buildTag = function( tagName ) {
    var $tag = $( this.tag );
    $tag.find( ".mb-tag-text" ).text( tagName );
    $tag.attr( "data-tag", tagName );

    return $tag;
  };

  MasterBlaster.prototype.inputEvents = function( ) {
    var _this = this;
    this.$input.on( "keydown", function( e ) {
      if( ~_this.options.triggerKeys.indexOf( e.keyCode || e.which ) ) {
        e.preventDefault(); 
        var $this = $( this );
        var tagName = _this.cleanTag( $this.val( ) );
        if( _this.isValid( tagName ) ) {
          _this.push( tagName );
        } 
        else if( typeof _this.options.onInvalid === "function" ) {
          _this.options.onInvalid( tagName, _this.error );
        }
        $this.val( "" );
      }
    } );
  };

  MasterBlaster.prototype.cleanTag = function( tagName ) {
    return tagName;
  };

  MasterBlaster.prototype.isValid = function( tagName ) {
    if( this.options.tagRules.unique && this.has( tagName ) ) {
      this.error = tagName + " already exists.";
      return false;
    }
    else if( this.options.tagRules.minLength && tagName.length < this.options.tagRules.minLength ) {
      this.error = tagName + " must be greater than " + this.options.tagRules.minLength + " characters.";
      return false;
    }
    else {
      return true;
    }
  };

  MasterBlaster.prototype.refreshTagEvents = function( ) {
    var _this = this;
    this.$tagList.find( ".mb-tag-remove" ).off( "click" );
    this.$tagList.find( ".mb-tag-remove" ).on( "click", function( e ) {
      e.preventDefault( );
      _this.remove( $( this ).parent( ).attr( "data-tag" ) );
    } );
  };

  MasterBlaster.prototype.removeElem = function( $tag ) {
    this.remove( $( this ).siblings( ".mb-tag-text" ).text( ) );
    if( this.options.animate ) {
      $tag.animate( { opacity: 0.01 }, "fast", function( ) {
        $tag.animate( { width: 0, margin: 0 }, "fast", function( ) {
          $tag.remove( );
        } );
      } );
    }
    else
      $tag.remove( ); 
  };

  MasterBlaster.prototype.has = function( tagName ) {
    return ~( this.tags.indexOf( tagName ) ); 
  };

  MasterBlaster.prototype.push = function( tagName ) {
    this.tags.push( tagName );
    this.elemCache[ tagName ] = this.buildTag( tagName );

    this.addElem( this.elemCache[ tagName ] );
    this.refreshTagEvents( );

    if( typeof this.options.onAdd === "function" )
      this.options.onAdd( tagName );
  };

  MasterBlaster.prototype.pop = function( ) {
    var tagName = this.tags[ this.tags.length - 1 ];
    this.remove( tagName );
  };

  MasterBlaster.prototype.remove = function( tagName ) {
    var index = this.tags.indexOf( tagName );
    if( !~index ) return;
    var $tag = this.elemCache[ tagName ];

    this.removeElem( $tag );

    this.tags.splice( index, 1 );
    delete this.elemCache[ tagName ];

    if( typeof this.options.onRemove === "function" )
      this.options.onRemove( tagName );
  };

  MasterBlaster.prototype.setup = function( ) {
    this.$container.insertAfter( this.$oldInput );
    this.$oldInput.hide( );
    this.$input.attr( "id", "" ).addClass( "mb-input" );
    this.$container.append( this.$tagList.append( this.$input ) );
  };
 
  $.fn[ pluginName ] = function( optionsOrMethod ) {
    var _$this = this;
    var masterblaster = null;
    var _arguments = Array.prototype.slice.call( arguments );
    //Initialize a new version of the plugin
    return this.each(function ( ) {
      if( !$.data( this, "plugin_" + pluginName ) ) {
        $.data( this, "plugin_" + pluginName, new MasterBlaster( $( this ), optionsOrMethod ) );
      }
      else {
        if( ~$.inArray( optionsOrMethod, methods ) ) {
          $.data( this, "plugin_" + pluginName )[ optionsOrMethod ].apply( $.data( this, "plugin_" + pluginName ), _arguments.splice( 1, _arguments.length ) );
        }
        else
          console.error( "Method", optionsOrMethod, "does not exist. Did you instantiate masterblaster." );
      }
    } );
  };
} )( jQuery, window, document );
