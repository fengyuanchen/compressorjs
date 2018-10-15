describe('checkOrientation', () => {
  it('should check orientation by default', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      const compressor = new Compressor(image, {
        success(result) {
          const newImage = new Image();

          newImage.onload = () => {
            expect(newImage.naturalWidth).to.below(newImage.naturalHeight);
            done();
          };
          newImage.src = URL.createObjectURL(result);
        },
      });

      expect(compressor.options.checkOrientation).to.be.true;
    });
  });

  it('should not check orientation', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      const compressor = new Compressor(image, {
        checkOrientation: false,
        success(result) {
          const newImage = new Image();

          newImage.onload = () => {
            expect(newImage.naturalWidth).to.above(newImage.naturalHeight);
            done();
          };
          newImage.src = URL.createObjectURL(result);
        },
      });

      expect(compressor.options.checkOrientation).to.be.false;
    });
  });
});
