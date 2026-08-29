describe('create', () => {
  it('should be a static method', () => {
    expect(Compressor.create).to.be.a('function');
  });

  it('should create a Compressor instance', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      const compressor = Compressor.create(image, {
        quality: 0.6,
      });

      expect(compressor).to.be.an.instanceOf(Compressor);
      expect(compressor.file).to.equal(image);
      expect(compressor.options.quality).to.equal(0.6);
      done();
    });
  });
});
