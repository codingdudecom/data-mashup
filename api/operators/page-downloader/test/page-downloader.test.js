var pageDownloader = require("../../page-downloader")

describe('page-downloader', function() {
  	describe('#process()', function() {

    	it('should download page', function (done) {
        this.timeout(150000);
        pageDownloader.process("http://falln-brushes.deviantart.com/art/Blood-Brushes-20479297",function(err,body){
          if (err) throw err;
          console.log(body);
          done();
        });    		
    	});
	})
})