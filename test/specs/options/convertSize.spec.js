describe('convertSize', () => {
  it('should not convert the image from PNG to JPEG', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      const compressor = new Compressor(image, {
        success(result) {
          expect(image.type).to.equal('image/png');
          expect(result.type).to.equal('image/png');
          done();
        },
      });

      expect(compressor.options.convertSize).to.equal(5000000);
    });
  });

  it('should convert the image from PNG to JPEG', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      const compressor = new Compressor(image, {
        convertSize: 0,
        success(result) {
          expect(image.type).to.equal('image/png');
          expect(result.type).to.equal('image/jpeg');
          done();
        },
      });

      expect(compressor.options.convertSize).to.equal(0);
    });
  });
});
