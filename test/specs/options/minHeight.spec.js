describe('minHeight', () => {
  it('should be `0` by default', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      const compressor = new Compressor(image);

      expect(compressor.options.minHeight).to.equal(0);
      done();
    });
  });

  it('should not less than the given minimum height', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      const compressor = new Compressor(image, {
        minHeight: 1000,
        success(result) {
          const newImage = new Image();

          newImage.onload = () => {
            expect(newImage.naturalHeight).to.equal(1000);
            done();
          };
          newImage.src = URL.createObjectURL(result);
        },
      });

      expect(compressor.options.minHeight).to.equal(1000);
    });
  });

  it('should not less than the given minimum height even it is rotated', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      new Compressor(image, {
        minHeight: 1000,
        success(result) {
          const newImage = new Image();

          newImage.onload = () => {
            expect(newImage.naturalHeight).to.equal(1000);
            done();
          };
          newImage.src = URL.createObjectURL(result);
        },
      });
    });
  });

  it('should be ignored when the given minimum height does not greater than 0', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      new Compressor(image, {
        minHeight: -1000,
        success(result) {
          const newImage = new Image();

          newImage.onload = () => {
            expect(newImage.naturalHeight).to.above(0);
            done();
          };
          newImage.src = URL.createObjectURL(result);
        },
      });
    });
  });

  it('should be resized to fit the aspect ratio of the original image when the `minWidth` option is set', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      new Compressor(image, {
        minWidth: 750,
        minHeight: 1000,
        success(result) {
          const newImage = new Image();

          newImage.onload = () => {
            expect(newImage.naturalWidth).to.equal(833);
            expect(newImage.naturalHeight).to.equal(1000);
            done();
          };
          newImage.src = URL.createObjectURL(result);
        },
      });
    });
  });

  it('should be ignored when the `maxHeight` is set and its value is more lesser', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      new Compressor(image, {
        minHeight: 1000,
        maxHeight: 100,
        success(result) {
          const newImage = new Image();

          newImage.onload = () => {
            expect(newImage.naturalHeight).to.equal(100);
            done();
          };
          newImage.src = URL.createObjectURL(result);
        },
      });
    });
  });
});
