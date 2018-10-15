describe('setDefaults', () => {
  it('should be a static method', () => {
    expect(Compressor.setDefaults).to.be.a('function');
  });

  it('should change the global default options', (done) => {
    Compressor.setDefaults({
      strict: false,
    });

    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      new Compressor(image, {
        quality: 1,
        success(result) {
          expect(result).to.not.equal(image);

          // Reverts it for the rest test suites
          Compressor.setDefaults({
            strict: true,
          });
          done();
        },
      });
    });
  });
});
