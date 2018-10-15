describe('success', () => {
  it('should be `null` be default', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      const compressor = new Compressor(image);

      expect(compressor.options.success).to.be.null;
      done();
    });
  });

  it('should execute the `success` hook function', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      const compressor = new Compressor(image, {
        success(result) {
          expect(this).to.equal(compressor);
          expect(result).to.be.an.instanceOf(Blob);
          expect(result.name).to.equal(image.name);
          done();
        },
      });

      expect(compressor.options.success).to.be.a('function');
    });
  });
});
