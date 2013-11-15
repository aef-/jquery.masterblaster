beforeEach(function() {
  this.addMatchers({
    toHaveTag: function( tagName ) {
      return this.actual.next( ).find( "[data-tag='"+tagName+"']" ).length > 0
    },  
    toHaveOneTag: function( tagName ) {
      return this.actual.next( ).find( "[data-tag='"+tagName+"']" ).length === 1
    },   
    toHaveMultipleTags: function( tagName ) {
      return this.actual.next( ).find( "[data-tag='"+tagName+"']" ).length > 1;
    },   
  });
});
