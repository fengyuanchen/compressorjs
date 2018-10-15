describe('width', () => {
  it('should be `undefined` by default', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      const compressor = new Compressor(image);

      expect(compressor.options.width).to.be.undefined;
      done();
    });
  });

  it('should equal to the given width', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      const compressor = new Compressor(image, {
        width: 100,
        success(result) {
          const newImage = new Image();

          newImage.onload = () => {
            expect(newImage.naturalWidth).to.equal(100);
            done();
          };
          newImage.src = URL.createObjectURL(result);
        },
      });

      expect(compressor.options.width).to.equal(100);
    });
  });

  it('should equal to the given width even it is rotated', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      new Compressor(image, {
        width: 100,
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

  it('should be ignored when the given width does not greater than 0', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      new Compressor(image, {
        width: -100,
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

  it('should be floored when it contains decimal number', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      new Compressor(image, {
        width: 100.30000000000000004,
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

  it('should be resized to fit the aspect ratio of the original image when the `height` option is set', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      new Compressor(image, {
        width: 100,
        height: 60,
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

  it('should be resized to fit the aspect ratio of the original image when the `height` option is set even it is rotated', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      new Compressor(image, {
        width: 100,
        height: 60,
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

  it('should be ignored when the `minWidth` option is set and its value is more greater', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      new Compressor(image, {
        width: 100,
        minWidth: 200,
        success(result) {
          const newImage = new Image();

          newImage.onload = () => {
            expect(newImage.naturalWidth).to.equal(200);
            done();
          };
          newImage.src = URL.createObjectURL(result);
        },
      });
    });
  });

  it('should be ignored when the `maxWidth` option is set and its value is lesser', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      new Compressor(image, {
        width: 200,
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
