describe('demo suite', function(){
    it('should equal 5 when 2+3', function(){
        (2+3).should.equal(5);
    });

    it('should not exist', function(){
        should.not.exist(null);
    });
});