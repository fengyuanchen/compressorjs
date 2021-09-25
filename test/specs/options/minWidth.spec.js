describe('minWidth', () => {
  it('should be `0` by default', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      const compressor = new Compressor(image);

      expect(compressor.options.minWidth).to.equal(0);
      done();
    });
  });

  it('should not less than the given minimum width', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      const compressor = new Compressor(image, {
        minWidth: 1000,
        success(result) {
          const newImage = new Image();

          newImage.onload = () => {
            expect(newImage.naturalWidth).to.equal(1000);
            done();
          };
          newImage.src = URL.createObjectURL(result);
        },
      });

      expect(compressor.options.minWidth).to.equal(1000);
    });
  });

  it('should not less than the given minimum width even it is rotated', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      new Compressor(image, {
        minWidth: 1000,
        success(result) {
          const newImage = new Image();

          newImage.onload = () => {
            expect(newImage.naturalWidth).to.equal(1000);
            done();
          };
          newImage.src = URL.createObjectURL(result);
        },
      });
    });
  });

  it('should be ignored when the given minimum width does not greater than 0', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      new Compressor(image, {
        minWidth: -1000,
        success(result) {
          const newImage = new Image();

          newImage.onload = () => {
            expect(newImage.naturalWidth).to.above(0);
            done();
          };
          newImage.src = URL.createObjectURL(result);
        },
      });
    });
  });

  it('should be resized to fit the aspect ratio of the original image when the `minHeight` option is set', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      new Compressor(image, {
        minWidth: 1000,
        minHeight: 900,
        success(result) {
          const newImage = new Image();

          newImage.onload = () => {
            expect(newImage.naturalWidth).to.equal(1000);
            expect(newImage.naturalHeight).to.equal(1200);
            done();
          };
          newImage.src = URL.createObjectURL(result);
        },
      });
    });
  });

  it('should be ignored when the `maxWidth` is set and its value is more lesser', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      new Compressor(image, {
        minWidth: 1000,
        maxWidth: 100,
        success(result) {
          const newImage = new Image();

          newImage.onload = () => {
            expect(newImage.naturalWidth).to.equal(100);
            done();
          };
          newImage.src = URL.createObjectURL(result);
        },
      });
    });
  });
});
