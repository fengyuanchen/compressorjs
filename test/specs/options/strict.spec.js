describe('strict', () => {
  it('should be `true` by default', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      const compressor = new Compressor(image);

      expect(compressor.options.strict).to.be.true;
      done();
    });
  });

  it('should output the original image as the result', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      new Compressor(image, {
        quality: 1,
        success(result) {
          expect(result).to.equal(image);
          done();
        },
      });
    });
  });

  it('should be ignored when the `mimeType` option is set and its value is different from the mime type of the image', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      new Compressor(image, {
        mimeType: 'image/png',
        success(result) {
          expect(result).to.not.equal(image);
          done();
        },
      });
    });
  });

  it('should be ignored when the `width` option is set and its value is greater than the natural width of the image', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      new Compressor(image, {
        width: 501,
        success(result) {
          expect(result).to.not.equal(image);
          done();
        },
      });
    });
  });

  it('should be ignored when the `height` option is set and its value is greater than the natural height of the image', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      new Compressor(image, {
        height: 601,
        success(result) {
          expect(result).to.not.equal(image);
          done();
        },
      });
    });
  });

  it('should be ignored when the `minWidth` option is set and its value is greater than the natural width of the image', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      new Compressor(image, {
        minWidth: 501,
        success(result) {
          expect(result).to.not.equal(image);
          done();
        },
      });
    });
  });

  it('should be ignored when the `minHeight` option is set and its value is greater than the natural height of the image', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      new Compressor(image, {
        minHeight: 601,
        success(result) {
          expect(result).to.not.equal(image);
          done();
        },
      });
    });
  });

  it('should be ignored when the `maxWidth` option is set and its value is less than the natural width of the image', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      new Compressor(image, {
        maxWidth: 499,
        success(result) {
          expect(result).to.not.equal(image);
          done();
        },
      });
    });
  });

  it('should be ignored when the `maxHeight` option is set and its value is less than the natural height of the image', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      new Compressor(image, {
        maxHeight: 599,
        success(result) {
          expect(result).to.not.equal(image);
          done();
        },
      });
    });
  });
});
