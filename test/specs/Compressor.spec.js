describe('Compressor', () => {
  it('should be a class (function)', () => {
    expect(Compressor).to.be.a('function');
  });

  it('should throw error when the first argument is not an image File or Blob object', () => {
    new Compressor(new Blob(['Hello, World!']), {
      error(err) {
        expect(err.message).to.equal('The first argument must be an image File or Blob object.');
      },
    });
  });

  it('should throw error when the first argument is not an valid image File or Blob object', () => {
    new Compressor(new Blob(['Hello, World!'], {
      type: 'image/jpeg',
    }), {
      error(err) {
        expect(err.message).to.equal('Failed to load the image.');
      },
    });
  });

  it('should throw error when failed to read the image with FileReader', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      const compressor = new Compressor(image, {
        error(err) {
          expect(err.message).to.equal('Failed to read the image with FileReader.');
          done();
        },
      });

      // The first asynchronous process will be image reading when enable orientation checking
      compressor.reader.onload = null;
      compressor.reader.onerror();
    });
  });

  it('should throw error when failed to load the image', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      const compressor = new Compressor(image, {
        checkOrientation: false,
        error(err) {
          expect(err.message).to.equal('Failed to load the image.');
          done();
        },
      });

      // The first asynchronous process will be image loading when disable orientation checking
      compressor.image.onload = null;
      compressor.image.onerror();
    });
  });

  it('should work with polyfill library when `canvas.toBlob` is not supported', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      new Compressor(image, {
        drew(context, canvas) {
          canvas.toBlob = null;
        },
        success(result) {
          expect(result).to.be.a('blob');
          done();
        },
      });
    });
  });

  it('should work when the `canvas.toBlob` function does not output any blob object', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      new Compressor(image, {
        drew(context, canvas) {
          canvas.toBlob = (callback) => {
            callback(null);
          };
        },
        success(result) {
          expect(result).to.equal(image);
          done();
        },
      });
    });
  });
});
