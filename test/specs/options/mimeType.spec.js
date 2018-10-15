describe('mimeType', () => {
  it('should be `auto` by default', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      const compressor = new Compressor(image);

      expect(compressor.options.mimeType).to.equal('auto');
      done();
    });
  });

  it('should match the given mime type', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      image.name = 'picture.jpg';

      const mimeType = 'image/webp';
      const compressor = new Compressor(image, {
        mimeType,
        success(result) {
          expect(result.type).to.equal(mimeType);
          done();
        },
      });

      expect(compressor.options.mimeType).to.equal(mimeType);
    });
  });
});
