describe('maxHeight', () => {
  it('should be `Infinity` by default', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      const compressor = new Compressor(image);

      expect(compressor.options.maxHeight).to.equal(Infinity);
      done();
    });
  });

  it('should not greater than the given maximum height', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      const compressor = new Compressor(image, {
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

      expect(compressor.options.maxHeight).to.equal(100);
    });
  });

  it('should not greater than the given maximum height even it is rotated', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      new Compressor(image, {
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

  it('should be ignored when the given maximum height does not greater than 0', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      new Compressor(image, {
        maxHeight: -100,
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

  it('should be resized to fit the aspect ratio of the original image when the `maxWidth` option is set', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      new Compressor(image, {
        maxWidth: 50,
        maxHeight: 100,
        success(result) {
          const newImage = new Image();

          newImage.onload = () => {
            expect(newImage.naturalWidth).to.equal(50);
            expect(newImage.naturalHeight).to.equal(60);
            done();
          };
          newImage.src = URL.createObjectURL(result);
        },
      });
    });
  });
});
